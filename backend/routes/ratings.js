const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Shelter = require('../models/Shelter');
const Individual = require('../models/Individual');
const { authenticateToken, requireIndividual, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create a new rating
// @access  Private (Individual users only)
router.post('/', [
  authenticateToken,
  requireIndividual,
  body('shelter').isMongoId(),
  body('overallRating').isInt({ min: 1, max: 5 }),
  body('categories.cleanliness.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.safety.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.staff.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.services.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.accessibility.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.communication.rating').optional().isInt({ min: 1, max: 5 }),
  body('review.title').optional().isString().isLength({ max: 100 }),
  body('review.content').optional().isString().isLength({ max: 1000 }),
  body('experience.stayDuration').optional().isString(),
  body('experience.visitDate').optional().isISO8601(),
  body('experience.servicesUsed').optional().isArray(),
  body('experience.outcome').optional().isIn(['positive', 'neutral', 'negative', 'mixed']),
  body('isAnonymous').optional().isBoolean(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shelter: shelterId, ...ratingData } = req.body;

    // Verify shelter exists
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    // Get individual profile
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    // Check if individual has already rated this shelter
    const existingRating = await Rating.findOne({
      shelter: shelterId,
      individual: individual._id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this shelter' });
    }

    // Create rating
    const rating = new Rating({
      shelter: shelterId,
      individual: individual._id,
      ...ratingData
    });

    await rating.save();
    await rating.populate('shelter', 'name address');
    await rating.populate('individual', 'personalInfo.firstName personalInfo.lastName');

    // Update shelter's average rating
    await shelter.updateRating(rating.overallRating);

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Server error creating rating' });
  }
});

// @route   GET /api/ratings/shelter/:shelterId
// @desc    Get ratings for a specific shelter
// @access  Public
router.get('/shelter/:shelterId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 20 }),
  query('sortBy').optional().isIn(['createdAt', 'overallRating', 'helpful.count'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    // Verify shelter exists
    const shelter = await Shelter.findById(req.params.shelterId);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const ratings = await Rating.getShelterRatings(req.params.shelterId, page, limit, sortBy);
    const averageData = await Rating.getAverageRating(req.params.shelterId);

    res.json({
      ratings,
      average: averageData,
      shelter: {
        _id: shelter._id,
        name: shelter.name,
        address: shelter.address
      }
    });
  } catch (error) {
    console.error('Get shelter ratings error:', error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
});

// @route   GET /api/ratings/my-ratings
// @desc    Get individual's ratings
// @access  Private (Individual users only)
router.get('/my-ratings', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    const ratings = await Rating.find({ individual: individual._id })
      .populate('shelter', 'name address')
      .sort({ createdAt: -1 });

    res.json({ ratings });
  } catch (error) {
    console.error('Get my ratings error:', error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
});

// @route   PUT /api/ratings/:id
// @desc    Update a rating
// @access  Private (Rating author only)
router.put('/:id', [
  authenticateToken,
  requireIndividual,
  body('overallRating').optional().isInt({ min: 1, max: 5 }),
  body('categories.cleanliness.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.safety.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.staff.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.services.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.accessibility.rating').optional().isInt({ min: 1, max: 5 }),
  body('categories.communication.rating').optional().isInt({ min: 1, max: 5 }),
  body('review.title').optional().isString().isLength({ max: 100 }),
  body('review.content').optional().isString().isLength({ max: 1000 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    const rating = await Rating.findOne({
      _id: req.params.id,
      individual: individual._id
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found or access denied' });
    }

    // Check if rating is too old to edit (e.g., 7 days)
    const editTimeLimit = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - rating.createdAt.getTime() > editTimeLimit) {
      return res.status(400).json({ message: 'Rating is too old to edit' });
    }

    const oldRating = rating.overallRating;
    Object.assign(rating, req.body);
    await rating.save();

    // Update shelter's average rating if overall rating changed
    if (oldRating !== rating.overallRating) {
      const shelter = await Shelter.findById(rating.shelter);
      if (shelter) {
        // Recalculate average rating
        const averageData = await Rating.getAverageRating(shelter._id);
        shelter.rating.average = averageData.averageRating;
        shelter.rating.count = averageData.totalRatings;
        await shelter.save();
      }
    }

    await rating.populate('shelter', 'name address');
    await rating.populate('individual', 'personalInfo.firstName personalInfo.lastName');

    res.json({
      message: 'Rating updated successfully',
      rating
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error updating rating' });
  }
});

// @route   DELETE /api/ratings/:id
// @desc    Delete a rating
// @access  Private (Rating author only)
router.delete('/:id', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    const rating = await Rating.findOne({
      _id: req.params.id,
      individual: individual._id
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found or access denied' });
    }

    // Update shelter's average rating
    const shelter = await Shelter.findById(rating.shelter);
    if (shelter) {
      // Recalculate average rating
      const averageData = await Rating.getAverageRating(shelter._id);
      shelter.rating.average = averageData.averageRating;
      shelter.rating.count = averageData.totalRatings;
      await shelter.save();
    }

    await Rating.findByIdAndDelete(rating._id);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error deleting rating' });
  }
});

// @route   POST /api/ratings/:id/helpful
// @desc    Mark rating as helpful
// @access  Private
router.post('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await rating.markHelpful(req.user._id);

    res.json({
      message: 'Rating marked as helpful',
      helpfulCount: rating.helpful.count
    });
  } catch (error) {
    console.error('Mark rating helpful error:', error);
    res.status(500).json({ message: 'Server error marking rating as helpful' });
  }
});

// @route   DELETE /api/ratings/:id/helpful
// @desc    Unmark rating as helpful
// @access  Private
router.delete('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await rating.unmarkHelpful(req.user._id);

    res.json({
      message: 'Rating unmarked as helpful',
      helpfulCount: rating.helpful.count
    });
  } catch (error) {
    console.error('Unmark rating helpful error:', error);
    res.status(500).json({ message: 'Server error unmarking rating as helpful' });
  }
});

// @route   POST /api/ratings/:id/response
// @desc    Add response to rating (for shelter staff)
// @access  Private (Shelter users only)
router.post('/:id/response', [
  authenticateToken,
  body('content').notEmpty().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Verify user is associated with the shelter
    const shelter = await Shelter.findOne({ user: req.user._id });
    if (!shelter || shelter._id.toString() !== rating.shelter.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await rating.addResponse(req.user._id, content);

    res.json({
      message: 'Response added successfully',
      response: rating.response
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Server error adding response' });
  }
});

// @route   POST /api/ratings/:id/flag
// @desc    Flag a rating for review
// @access  Private
router.post('/:id/flag', [
  authenticateToken,
  body('reason').notEmpty().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;

    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await rating.flag(req.user._id, reason);

    res.json({ message: 'Rating flagged for review' });
  } catch (error) {
    console.error('Flag rating error:', error);
    res.status(500).json({ message: 'Server error flagging rating' });
  }
});

// @route   GET /api/ratings/:id
// @desc    Get specific rating
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('shelter', 'name address')
      .populate('individual', 'personalInfo.firstName personalInfo.lastName');

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (!rating.isPublic && (!req.user || req.user._id.toString() !== rating.individual.user.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ rating });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ message: 'Server error fetching rating' });
  }
});

module.exports = router;
