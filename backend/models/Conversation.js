const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['shelter', 'individual'],
      required: true
    },
    joinedAt: { type: Date, default: Date.now },
    lastReadAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  type: {
    type: String,
    enum: ['shelter-individual', 'shelter-shelter', 'individual-individual', 'group'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  context: {
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelter'
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    caseId: String,
    category: {
      type: String,
      enum: ['housing-inquiry', 'job-application', 'case-management', 'general', 'emergency'],
      default: 'general'
    }
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'closed', 'archived'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: Date
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  notes: String,
  resolvedAt: Date,
  closedAt: Date,
  archivedAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
conversationSchema.index({ 'participants.user': 1, status: 1 });
conversationSchema.index({ 'context.shelter': 1 });
conversationSchema.index({ 'context.job': 1 });
conversationSchema.index({ status: 1, priority: 1 });
conversationSchema.index({ updatedAt: -1 });

// Virtual for participant count
conversationSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Method to add participant
conversationSchema.methods.addParticipant = function(userId, role) {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      role: role
    });
  }
  return this.save();
};

// Method to remove participant
conversationSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(
    p => p.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to update last read time for a participant
conversationSchema.methods.updateLastRead = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastReadAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to update last message
conversationSchema.methods.updateLastMessage = function(messageData) {
  this.lastMessage = {
    content: messageData.content,
    sender: messageData.sender,
    sentAt: messageData.sentAt || new Date()
  };
  return this.save();
};

// Method to increment unread count
conversationSchema.methods.incrementUnread = function() {
  this.unreadCount += 1;
  return this.save();
};

// Method to reset unread count for a participant
conversationSchema.methods.resetUnreadForUser = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastReadAt = new Date();
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to resolve conversation
conversationSchema.methods.resolve = function(notes = '') {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  if (notes) this.notes = notes;
  return this.save();
};

// Method to close conversation
conversationSchema.methods.close = function(notes = '') {
  this.status = 'closed';
  this.closedAt = new Date();
  if (notes) this.notes = notes;
  return this.save();
};

// Method to archive conversation
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Static method to find conversations for a user
conversationSchema.statics.findByUser = function(userId, status = 'active') {
  return this.find({
    'participants.user': userId,
    status: status
  }).populate('participants.user', 'email userType')
    .populate('context.shelter', 'name')
    .populate('context.job', 'title company')
    .sort({ updatedAt: -1 });
};

// Static method to find or create conversation between users
conversationSchema.statics.findOrCreate = async function(participants, subject, context = {}) {
  // Try to find existing conversation
  const existingConversation = await this.findOne({
    'participants.user': { $all: participants.map(p => p.user) },
    status: 'active'
  });
  
  if (existingConversation) {
    return existingConversation;
  }
  
  // Create new conversation
  const conversation = new this({
    participants: participants,
    type: this.determineType(participants),
    subject: subject,
    context: context
  });
  
  return conversation.save();
};

// Helper method to determine conversation type
conversationSchema.statics.determineType = function(participants) {
  if (participants.length === 2) {
    const roles = participants.map(p => p.role);
    if (roles.includes('shelter') && roles.includes('individual')) {
      return 'shelter-individual';
    } else if (roles.every(role => role === 'shelter')) {
      return 'shelter-shelter';
    } else if (roles.every(role => role === 'individual')) {
      return 'individual-individual';
    }
  }
  return 'group';
};

module.exports = mongoose.model('Conversation', conversationSchema);
