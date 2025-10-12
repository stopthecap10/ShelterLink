const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Shelter = require('../models/Shelter');
const Rating = require('../models/Rating');
const { authenticateToken, requireShelter, requireVerified, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/shelters
// @desc    Get all shelters with filtering and search
// @access  Public
router.get('/', [
  optionalAuth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString(),
  query('city').optional().isString(),
  query('state').optional().isString(),
  query('services').optional().isString(),
  query('availableBeds').optional().isBoolean(),
  query('lat').optional().isFloat(),
  query('lng').optional().isFloat(),
  query('radius').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      search,
      city,
      state,
      services,
      availableBeds,
      lat,
      lng,
      radius = 25
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { isActive: true, verificationStatus: 'verified' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filters
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }

    // Services filter
    if (services) {
      const serviceArray = services.split(',').map(s => s.trim());
      query['services.name'] = { $in: serviceArray };
    }

    // Available beds filter
    if (availableBeds === 'true') {
      query['capacity.availableBeds'] = { $gt: 0 };
    }

    // Geospatial search
    if (lat && lng) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      };
    }

    const shelters = await Shelter.find(query)
      .populate('user', 'email userType isVerified')
      .sort(search ? { score: { $meta: 'textScore' } } : { 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shelter.countDocuments(query);

    res.json({
      shelters,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + shelters.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get shelters error:', error);
    res.status(500).json({ message: 'Server error fetching shelters' });
  }
});

// @route   GET /api/shelters/:id
// @desc    Get shelter by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id)
      .populate('user', 'email userType isVerified');

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    if (!shelter.isActive) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.json(shelter);
  } catch (error) {
    console.error('Get shelter error:', error);
    res.status(500).json({ message: 'Server error fetching shelter' });
  }
});

// @route   POST /api/shelters
// @desc    Create new shelter
// @access  Private (Shelter users only)
router.post('/', [
  authenticateToken,
  requireShelter,
  body('name').notEmpty().trim(),
  body('description').notEmpty(),
  body('address.street').notEmpty(),
  body('address.city').notEmpty(),
  body('address.state').notEmpty(),
  body('address.zipCode').notEmpty(),
  body('contact.phone').notEmpty(),
  body('contact.email').isEmail(),
  body('capacity.totalBeds').isInt({ min: 1 }),
  body('capacity.availableBeds').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if shelter already exists for this user
    const existingShelter = await Shelter.findOne({ user: req.user._id });
    if (existingShelter) {
      return res.status(400).json({ message: 'Shelter profile already exists for this user' });
    }

    const shelter = new Shelter({
      user: req.user._id,
      ...req.body
    });

    await shelter.save();
    await shelter.populate('user', 'email userType isVerified');

    res.status(201).json({
      message: 'Shelter created successfully',
      shelter
    });
  } catch (error) {
    console.error('Create shelter error:', error);
    res.status(500).json({ message: 'Server error creating shelter' });
  }
});

// @route   PUT /api/shelters/:id
// @desc    Update shelter
// @access  Private (Shelter owner only)
router.put('/:id', [
  authenticateToken,
  requireShelter,
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty(),
  body('contact.phone').optional().notEmpty(),
  body('contact.email').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    const updatedShelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'email userType isVerified');

    res.json({
      message: 'Shelter updated successfully',
      shelter: updatedShelter
    });
  } catch (error) {
    console.error('Update shelter error:', error);
    res.status(500).json({ message: 'Server error updating shelter' });
  }
});

// @route   PUT /api/shelters/:id/availability
// @desc    Update shelter bed availability
// @access  Private (Shelter owner only)
router.put('/:id/availability', [
  authenticateToken,
  requireShelter,
  body('availableBeds').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { availableBeds } = req.body;

    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    if (availableBeds > shelter.capacity.totalBeds) {
      return res.status(400).json({ 
        message: 'Available beds cannot exceed total beds' 
      });
    }

    await shelter.updateAvailability(availableBeds);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('availability-updated', {
        shelterId: shelter._id,
        availableBeds: shelter.capacity.availableBeds,
        totalBeds: shelter.capacity.totalBeds,
        lastUpdated: shelter.capacity.lastUpdated
      });
    }

    res.json({
      message: 'Availability updated successfully',
      availability: {
        availableBeds: shelter.capacity.availableBeds,
        totalBeds: shelter.capacity.totalBeds,
        lastUpdated: shelter.capacity.lastUpdated
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error updating availability' });
  }
});

// @route   POST /api/shelters/:id/services
// @desc    Add service to shelter
// @access  Private (Shelter owner only)
router.post('/:id/services', [
  authenticateToken,
  requireShelter,
  body('name').notEmpty().trim(),
  body('description').optional().isString(),
  body('available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    await shelter.addService(req.body);

    res.json({
      message: 'Service added successfully',
      services: shelter.services
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ message: 'Server error adding service' });
  }
});

// @route   PUT /api/shelters/:id/services/:serviceId
// @desc    Update shelter service
// @access  Private (Shelter owner only)
router.put('/:id/services/:serviceId', [
  authenticateToken,
  requireShelter,
  body('name').optional().notEmpty().trim(),
  body('description').optional().isString(),
  body('available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    const service = shelter.services.id(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    Object.assign(service, req.body);
    await shelter.save();

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error updating service' });
  }
});

// @route   DELETE /api/shelters/:id/services/:serviceId
// @desc    Remove service from shelter
// @access  Private (Shelter owner only)
router.delete('/:id/services/:serviceId', authenticateToken, requireShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    shelter.services.pull(req.params.serviceId);
    await shelter.save();

    res.json({
      message: 'Service removed successfully',
      services: shelter.services
    });
  } catch (error) {
    console.error('Remove service error:', error);
    res.status(500).json({ message: 'Server error removing service' });
  }
});

// @route   GET /api/shelters/:id/ratings
// @desc    Get shelter ratings
// @access  Public
router.get('/:id/ratings', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10 } = req.query;

    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const ratings = await Rating.getShelterRatings(req.params.id, page, limit);
    const averageData = await Rating.getAverageRating(req.params.id);

    res.json({
      ratings,
      average: averageData
    });
  } catch (error) {
    console.error('Get shelter ratings error:', error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
});

// @route   DELETE /api/shelters/:id
// @desc    Delete shelter
// @access  Private (Shelter owner only)
router.delete('/:id', authenticateToken, requireShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found or access denied' });
    }

    // Soft delete
    shelter.isActive = false;
    await shelter.save();

    res.json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    console.error('Delete shelter error:', error);
    res.status(500).json({ message: 'Server error deleting shelter' });
  }
});

module.exports = router;
