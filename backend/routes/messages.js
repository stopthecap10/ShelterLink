const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.findByUser(req.user._id);

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
});

// @route   POST /api/messages/conversations
// @desc    Create or find conversation
// @access  Private
router.post('/conversations', [
  authenticateToken,
  body('participants').isArray({ min: 1 }),
  body('subject').notEmpty().trim(),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participants, subject, context = {} } = req.body;

    // Add current user to participants if not already included
    const allParticipants = [...participants];
    const currentUserExists = allParticipants.some(
      p => p.user.toString() === req.user._id.toString()
    );
    
    if (!currentUserExists) {
      allParticipants.push({
        user: req.user._id,
        role: req.user.userType
      });
    }

    const conversation = await Conversation.findOrCreate(
      allParticipants,
      subject,
      context
    );

    await conversation.populate('participants.user', 'email userType');
    await conversation.populate('context.shelter', 'name');
    await conversation.populate('context.job', 'title company');

    res.json({
      message: 'Conversation created/found successfully',
      conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error creating conversation' });
  }
});

// @route   GET /api/messages/conversations/:id
// @desc    Get conversation by ID
// @access  Private
router.get('/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      'participants.user': req.user._id
    })
    .populate('participants.user', 'email userType')
    .populate('context.shelter', 'name address contact')
    .populate('context.job', 'title company location');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error fetching conversation' });
  }
});

// @route   GET /api/messages/conversations/:id/messages
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversations/:id/messages', [
  authenticateToken,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      'participants.user': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversation: req.params.id,
      isDeleted: false
    })
    .populate('sender', 'email userType')
    .populate('recipient', 'email userType')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Message.countDocuments({
      conversation: req.params.id,
      isDeleted: false
    });

    // Mark messages as read for current user
    const unreadMessages = messages.filter(
      msg => msg.recipient.toString() === req.user._id.toString() && !msg.isRead
    );

    for (const message of unreadMessages) {
      await message.markAsRead();
    }

    // Update conversation unread count
    await conversation.resetUnreadForUser(req.user._id);

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + messages.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// @route   POST /api/messages/conversations/:id/messages
// @desc    Send message in conversation
// @access  Private
router.post('/conversations/:id/messages', [
  authenticateToken,
  body('content').notEmpty().trim().isLength({ max: 1000 }),
  body('type').optional().isIn(['text', 'image', 'file', 'system']),
  body('attachments').optional().isArray(),
  body('metadata.isUrgent').optional().isBoolean(),
  body('metadata.priority').optional().isIn(['low', 'normal', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type = 'text', attachments = [], metadata = {} } = req.body;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      'participants.user': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (conversation.status !== 'active') {
      return res.status(400).json({ message: 'Cannot send messages to inactive conversation' });
    }

    // Find recipient (other participants)
    const recipient = conversation.participants.find(
      p => p.user.toString() !== req.user._id.toString()
    );

    if (!recipient) {
      return res.status(400).json({ message: 'No recipient found' });
    }

    // Create message
    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      recipient: recipient.user,
      content,
      type,
      attachments,
      metadata
    });

    await message.save();
    await message.populate('sender', 'email userType');
    await message.populate('recipient', 'email userType');

    // Update conversation
    await conversation.updateLastMessage({
      content: message.content,
      sender: message.sender._id,
      sentAt: message.createdAt
    });

    await conversation.incrementUnread();

    // Emit real-time message
    const io = req.app.get('io');
    if (io) {
      io.to(conversation._id.toString()).emit('receive-message', {
        message,
        conversationId: conversation._id
      });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.markAsRead();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error marking message as read' });
  }
});

// @route   PUT /api/messages/:id
// @desc    Edit message
// @access  Private (Sender only)
router.put('/:id', [
  authenticateToken,
  body('content').notEmpty().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user._id,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or access denied' });
    }

    // Check if message is too old to edit (e.g., 15 minutes)
    const editTimeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (Date.now() - message.createdAt.getTime() > editTimeLimit) {
      return res.status(400).json({ message: 'Message is too old to edit' });
    }

    await message.editMessage(content);

    res.json({
      message: 'Message edited successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error editing message' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (Sender only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user._id,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or access denied' });
    }

    await message.softDelete();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
});

// @route   PUT /api/messages/conversations/:id/status
// @desc    Update conversation status
// @access  Private
router.put('/conversations/:id/status', [
  authenticateToken,
  body('status').isIn(['active', 'resolved', 'closed', 'archived']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      'participants.user': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    switch (status) {
      case 'resolved':
        await conversation.resolve(notes);
        break;
      case 'closed':
        await conversation.close(notes);
        break;
      case 'archived':
        await conversation.archive();
        break;
      default:
        conversation.status = status;
        await conversation.save();
    }

    res.json({
      message: 'Conversation status updated successfully',
      conversation
    });
  } catch (error) {
    console.error('Update conversation status error:', error);
    res.status(500).json({ message: 'Server error updating conversation status' });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count for user
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
      isDeleted: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error fetching unread count' });
  }
});

module.exports = router;
