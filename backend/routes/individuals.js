const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Individual = require('../models/Individual');
const { authenticateToken, requireIndividual, requireVerified, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/individuals/profile
// @desc    Get current individual's profile
// @access  Private (Individual only)
router.get('/profile', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id })
      .populate('user', 'email userType isVerified lastLogin');

    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    res.json(individual);
  } catch (error) {
    console.error('Get individual profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/individuals/profile
// @desc    Update individual profile
// @access  Private (Individual only)
router.put('/profile', [
  authenticateToken,
  requireIndividual,
  body('personalInfo.firstName').optional().notEmpty().trim(),
  body('personalInfo.lastName').optional().notEmpty().trim(),
  body('personalInfo.phone').optional().notEmpty(),
  body('housingStatus.current').optional().isIn(['homeless', 'at-risk', 'temporarily-housed', 'seeking-housing']),
  body('employment.status').optional().isIn(['employed', 'unemployed', 'part-time', 'seeking-work', 'unable-to-work'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const individual = await Individual.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'email userType isVerified lastLogin');

    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      individual
    });
  } catch (error) {
    console.error('Update individual profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST /api/individuals/needs
// @desc    Add a need to individual profile
// @access  Private (Individual only)
router.post('/needs', [
  authenticateToken,
  requireIndividual,
  body('category').isIn(['housing', 'food', 'medical', 'mental-health', 'substance-abuse', 'employment', 'education', 'legal', 'other']),
  body('description').optional().isString(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
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

    await individual.addNeed(req.body);

    res.json({
      message: 'Need added successfully',
      needs: individual.needs
    });
  } catch (error) {
    console.error('Add need error:', error);
    res.status(500).json({ message: 'Server error adding need' });
  }
});

// @route   PUT /api/individuals/needs/:needId
// @desc    Update a need
// @access  Private (Individual only)
router.put('/needs/:needId', [
  authenticateToken,
  requireIndividual,
  body('category').optional().isIn(['housing', 'food', 'medical', 'mental-health', 'substance-abuse', 'employment', 'education', 'legal', 'other']),
  body('description').optional().isString(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('isMet').optional().isBoolean()
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

    const need = individual.needs.id(req.params.needId);
    if (!need) {
      return res.status(404).json({ message: 'Need not found' });
    }

    Object.assign(need, req.body);
    await individual.save();

    res.json({
      message: 'Need updated successfully',
      need
    });
  } catch (error) {
    console.error('Update need error:', error);
    res.status(500).json({ message: 'Server error updating need' });
  }
});

// @route   DELETE /api/individuals/needs/:needId
// @desc    Remove a need
// @access  Private (Individual only)
router.delete('/needs/:needId', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    individual.needs.pull(req.params.needId);
    await individual.save();

    res.json({
      message: 'Need removed successfully',
      needs: individual.needs
    });
  } catch (error) {
    console.error('Remove need error:', error);
    res.status(500).json({ message: 'Server error removing need' });
  }
});

// @route   PUT /api/individuals/location
// @desc    Update individual's current location
// @access  Private (Individual only)
router.put('/location', [
  authenticateToken,
  requireIndividual,
  body('address.street').optional().isString(),
  body('address.city').optional().isString(),
  body('address.state').optional().isString(),
  body('address.zipCode').optional().isString(),
  body('coordinates.lat').optional().isFloat(),
  body('coordinates.lng').optional().isFloat()
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

    await individual.updateLocation(req.body);

    res.json({
      message: 'Location updated successfully',
      currentLocation: individual.currentLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error updating location' });
  }
});

// @route   POST /api/individuals/case-history
// @desc    Add case history entry
// @access  Private (Individual only)
router.post('/case-history', [
  authenticateToken,
  requireIndividual,
  body('shelter').isMongoId(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('status').optional().isIn(['active', 'completed', 'terminated']),
  body('notes').optional().isString(),
  body('outcome').optional().isString()
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

    await individual.addCaseHistory(req.body);

    res.json({
      message: 'Case history added successfully',
      caseHistory: individual.caseHistory
    });
  } catch (error) {
    console.error('Add case history error:', error);
    res.status(500).json({ message: 'Server error adding case history' });
  }
});

// @route   GET /api/individuals/case-history
// @desc    Get individual's case history
// @access  Private (Individual only)
router.get('/case-history', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id })
      .populate('caseHistory.shelter', 'name address contact');

    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    res.json({
      caseHistory: individual.caseHistory
    });
  } catch (error) {
    console.error('Get case history error:', error);
    res.status(500).json({ message: 'Server error fetching case history' });
  }
});

// @route   GET /api/individuals/documents
// @desc    Get individual's documents
// @access  Private (Individual only)
router.get('/documents', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    res.json({
      documents: individual.documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
});

// @route   POST /api/individuals/documents
// @desc    Upload document
// @access  Private (Individual only)
router.post('/documents', [
  authenticateToken,
  requireIndividual,
  body('type').notEmpty().trim(),
  body('name').notEmpty().trim(),
  body('url').isURL()
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

    individual.documents.push(req.body);
    await individual.save();

    res.json({
      message: 'Document uploaded successfully',
      documents: individual.documents
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error uploading document' });
  }
});

// @route   DELETE /api/individuals/documents/:docId
// @desc    Remove document
// @access  Private (Individual only)
router.delete('/documents/:docId', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    individual.documents.pull(req.params.docId);
    await individual.save();

    res.json({
      message: 'Document removed successfully',
      documents: individual.documents
    });
  } catch (error) {
    console.error('Remove document error:', error);
    res.status(500).json({ message: 'Server error removing document' });
  }
});

// @route   GET /api/individuals/nearby-shelters
// @desc    Find nearby shelters based on individual's location
// @access  Private (Individual only)
router.get('/nearby-shelters', [
  authenticateToken,
  requireIndividual,
  query('radius').optional().isFloat({ min: 0, max: 100 }),
  query('services').optional().isString(),
  query('availableBeds').optional().isBoolean()
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

    if (!individual.currentLocation.coordinates) {
      return res.status(400).json({ message: 'Location not set. Please update your location first.' });
    }

    const { radius = 25, services, availableBeds } = req.query;

    let query = {
      isActive: true,
      verificationStatus: 'verified',
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: individual.currentLocation.coordinates
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      }
    };

    if (services) {
      const serviceArray = services.split(',').map(s => s.trim());
      query['services.name'] = { $in: serviceArray };
    }

    if (availableBeds === 'true') {
      query['capacity.availableBeds'] = { $gt: 0 };
    }

    const shelters = await Shelter.find(query)
      .populate('user', 'email userType isVerified')
      .limit(20);

    res.json({
      shelters,
      searchLocation: individual.currentLocation,
      searchRadius: radius
    });
  } catch (error) {
    console.error('Find nearby shelters error:', error);
    res.status(500).json({ message: 'Server error finding nearby shelters' });
  }
});

module.exports = router;
