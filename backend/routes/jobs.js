const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Shelter = require('../models/Shelter');
const Individual = require('../models/Individual');
const { authenticateToken, requireShelter, requireIndividual, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and search
// @access  Public
router.get('/', [
  optionalAuth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString(),
  query('city').optional().isString(),
  query('state').optional().isString(),
  query('type').optional().isIn(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
  query('compensationType').optional().isIn(['hourly', 'salary', 'contract', 'volunteer']),
  query('experienceLevel').optional().isIn(['entry-level', 'mid-level', 'senior', 'any']),
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
      type,
      compensationType,
      experienceLevel,
      lat,
      lng,
      radius = 25
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filters
    if (city) {
      query['location.address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['location.address.state'] = new RegExp(state, 'i');
    }

    // Employment type filter
    if (type) {
      query['employment.type'] = type;
    }

    // Compensation type filter
    if (compensationType) {
      query['compensation.type'] = compensationType;
    }

    // Experience level filter
    if (experienceLevel) {
      query['requirements.experience.level'] = experienceLevel;
    }

    // Geospatial search
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      };
    }

    const jobs = await Job.find(query)
      .populate('shelter', 'name address contact')
      .populate('postedBy', 'email userType')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + jobs.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('shelter', 'name address contact services')
      .populate('postedBy', 'email userType')
      .populate('applications.individual', 'personalInfo.firstName personalInfo.lastName');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error fetching job' });
  }
});

// @route   POST /api/jobs
// @desc    Create new job posting
// @access  Private (Shelter users only)
router.post('/', [
  authenticateToken,
  requireShelter,
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('company.name').notEmpty().trim(),
  body('location.address.city').notEmpty(),
  body('location.address.state').notEmpty(),
  body('employment.type').isIn(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
  body('compensation.type').isIn(['hourly', 'salary', 'contract', 'volunteer']),
  body('application.process').isIn(['online', 'email', 'phone', 'in-person', 'shelter-referral'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify shelter exists and user owns it
    const shelter = await Shelter.findOne({ user: req.user._id });
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter profile not found' });
    }

    const job = new Job({
      shelter: shelter._id,
      postedBy: req.user._id,
      ...req.body
    });

    await job.save();
    await job.populate('shelter', 'name address contact');
    await job.populate('postedBy', 'email userType');

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job posting
// @access  Private (Job poster only)
router.put('/:id', [
  authenticateToken,
  requireShelter,
  body('title').optional().notEmpty().trim(),
  body('description').optional().notEmpty(),
  body('status').optional().isIn(['active', 'paused', 'filled', 'expired', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .populate('shelter', 'name address contact')
    .populate('postedBy', 'email userType');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (Individual users only)
router.post('/:id/apply', [
  authenticateToken,
  requireIndividual,
  body('documents').optional().isArray(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isAcceptingApplications()) {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Get individual profile
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    await job.addApplication(individual._id, req.body);

    res.json({
      message: 'Application submitted successfully',
      application: job.applications[job.applications.length - 1]
    });
  } catch (error) {
    if (error.message === 'Individual has already applied for this job') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

// @route   GET /api/jobs/:id/applications
// @desc    Get job applications (for job poster)
// @access  Private (Job poster only)
router.get('/:id/applications', authenticateToken, requireShelter, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id
    }).populate('applications.individual', 'personalInfo employment skills experience');

    if (!job) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    res.json({
      applications: job.applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   PUT /api/jobs/:id/applications/:applicationId
// @desc    Update application status
// @access  Private (Job poster only)
router.put('/:id/applications/:applicationId', [
  authenticateToken,
  requireShelter,
  body('status').isIn(['applied', 'reviewing', 'interviewed', 'accepted', 'rejected']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    const application = job.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    if (req.body.notes) {
      application.notes = req.body.notes;
    }

    await job.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

// @route   GET /api/jobs/my-applications
// @desc    Get individual's job applications
// @access  Private (Individual users only)
router.get('/my-applications', authenticateToken, requireIndividual, async (req, res) => {
  try {
    const individual = await Individual.findOne({ user: req.user._id });
    if (!individual) {
      return res.status(404).json({ message: 'Individual profile not found' });
    }

    const jobs = await Job.find({
      'applications.individual': individual._id
    })
    .populate('shelter', 'name address contact')
    .populate('postedBy', 'email userType')
    .sort({ 'applications.appliedAt': -1 });

    // Filter applications for this individual
    const applications = jobs.map(job => {
      const application = job.applications.find(
        app => app.individual.toString() === individual._id.toString()
      );
      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          employment: job.employment,
          compensation: job.compensation,
          status: job.status,
          shelter: job.shelter,
          postedBy: job.postedBy
        },
        application
      };
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   GET /api/jobs/my-postings
// @desc    Get shelter's job postings
// @access  Private (Shelter users only)
router.get('/my-postings', authenticateToken, requireShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findOne({ user: req.user._id });
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter profile not found' });
    }

    const jobs = await Job.find({ shelter: shelter._id })
      .populate('shelter', 'name address contact')
      .populate('postedBy', 'email userType')
      .populate('applications.individual', 'personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my postings error:', error);
    res.status(500).json({ message: 'Server error fetching job postings' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job posting
// @access  Private (Job poster only)
router.delete('/:id', authenticateToken, requireShelter, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    // Soft delete
    job.status = 'cancelled';
    await job.save();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
});

module.exports = router;
