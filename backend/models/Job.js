const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    name: { type: String, required: true },
    website: String,
    description: String
  },
  location: {
    address: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    isRemote: { type: Boolean, default: false }
  },
  employment: {
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
      required: true
    },
    schedule: String,
    startDate: Date,
    duration: String
  },
  compensation: {
    type: {
      type: String,
      enum: ['hourly', 'salary', 'contract', 'volunteer'],
      required: true
    },
    amount: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    },
    benefits: [String]
  },
  requirements: {
    experience: {
      level: {
        type: String,
        enum: ['entry-level', 'mid-level', 'senior', 'any'],
        default: 'any'
      },
      years: Number,
      description: String
    },
    education: {
      level: {
        type: String,
        enum: ['none', 'high-school', 'associates', 'bachelors', 'masters', 'phd'],
        default: 'none'
      },
      field: String,
      required: { type: Boolean, default: false }
    },
    skills: [String],
    certifications: [String],
    other: [String]
  },
  application: {
    process: {
      type: String,
      enum: ['online', 'email', 'phone', 'in-person', 'shelter-referral'],
      required: true
    },
    instructions: String,
    contactInfo: {
      name: String,
      email: String,
      phone: String
    },
    deadline: Date,
    documents: [String] // Required documents
  },
  support: {
    training: {
      provided: { type: Boolean, default: false },
      description: String,
      duration: String
    },
    mentorship: { type: Boolean, default: false },
    resources: [String],
    accommodations: [String] // For individuals with special needs
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'filled', 'expired', 'cancelled'],
    default: 'active'
  },
  applications: [{
    individual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Individual'
    },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'interviewed', 'accepted', 'rejected'],
      default: 'applied'
    },
    notes: String,
    documents: [{
      type: String,
      url: String,
      name: String
    }]
  }],
  tags: [String], // For categorization and search
  isVerified: { type: Boolean, default: false },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for text search
jobSchema.index({ 
  title: "text", 
  description: "text", 
  "company.name": "text",
  "location.address.city": "text",
  "location.address.state": "text",
  tags: "text"
});

// Index for filtering
jobSchema.index({ status: 1, "employment.type": 1, "compensation.type": 1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Method to add application
jobSchema.methods.addApplication = function(individualId, applicationData = {}) {
  // Check if individual already applied
  const existingApplication = this.applications.find(
    app => app.individual.toString() === individualId.toString()
  );
  
  if (existingApplication) {
    throw new Error('Individual has already applied for this job');
  }
  
  this.applications.push({
    individual: individualId,
    ...applicationData
  });
  return this.save();
};

// Method to update application status
jobSchema.methods.updateApplicationStatus = function(individualId, status, notes = '') {
  const application = this.applications.find(
    app => app.individual.toString() === individualId.toString()
  );
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  application.status = status;
  application.notes = notes;
  return this.save();
};

// Method to check if job is still accepting applications
jobSchema.methods.isAcceptingApplications = function() {
  if (this.status !== 'active') return false;
  if (this.application.deadline && new Date() > this.application.deadline) return false;
  return true;
};

// Static method to find jobs by location
jobSchema.statics.findByLocation = function(coordinates, maxDistance = 50) {
  return this.find({
    status: 'active',
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance * 1609.34 // Convert miles to meters
      }
    }
  });
};

module.exports = mongoose.model('Job', jobSchema);
