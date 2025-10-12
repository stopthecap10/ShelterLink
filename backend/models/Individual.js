const mongoose = require('mongoose');

const individualSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
      required: true 
    },
    phone: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true }
    }
  },
  currentLocation: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  housingStatus: {
    current: {
      type: String,
      enum: ['homeless', 'at-risk', 'temporarily-housed', 'seeking-housing'],
      required: true
    },
    duration: String, // How long in current situation
    previousHousing: String
  },
  needs: [{
    category: { 
      type: String, 
      enum: ['housing', 'food', 'medical', 'mental-health', 'substance-abuse', 'employment', 'education', 'legal', 'other'],
      required: true 
    },
    description: String,
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium' 
    },
    isMet: { type: Boolean, default: false }
  }],
  employment: {
    status: {
      type: String,
      enum: ['employed', 'unemployed', 'part-time', 'seeking-work', 'unable-to-work'],
      required: true
    },
    currentJob: {
      title: String,
      company: String,
      hours: String,
      income: Number
    },
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    jobPreferences: {
      type: [String],
      location: String,
      schedule: String,
      minWage: Number
    }
  },
  health: {
    physicalHealth: {
      conditions: [String],
      medications: [String],
      allergies: [String],
      mobility: {
        type: String,
        enum: ['fully-mobile', 'limited-mobility', 'wheelchair', 'other'],
        default: 'fully-mobile'
      }
    },
    mentalHealth: {
      conditions: [String],
      currentTreatment: String,
      medications: [String]
    },
    substanceUse: {
      history: String,
      currentStatus: String,
      treatmentHistory: String
    }
  },
  family: {
    hasChildren: { type: Boolean, default: false },
    children: [{
      name: String,
      age: Number,
      relationship: String,
      needs: [String]
    }],
    pets: [{
      type: String,
      name: String,
      specialNeeds: String
    }]
  },
  preferences: {
    shelterType: [String], // ['emergency', 'transitional', 'permanent', 'family', 'single-gender']
    location: {
      preferredCities: [String],
      maxDistance: Number, // in miles
      avoidAreas: [String]
    },
    services: [String], // Required services
    accessibility: [String] // Accessibility needs
  },
  documents: [{
    type: { type: String, required: true },
    url: String,
    name: String,
    uploadedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
  }],
  caseHistory: [{
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelter'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'terminated']
    },
    notes: String,
    outcome: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for geospatial queries
individualSchema.index({ "currentLocation.coordinates": "2dsphere" });

// Index for text search
individualSchema.index({ 
  "personalInfo.firstName": "text", 
  "personalInfo.lastName": "text",
  "currentLocation.address.city": "text",
  "currentLocation.address.state": "text"
});

// Virtual for full name
individualSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age
individualSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Method to add a need
individualSchema.methods.addNeed = function(needData) {
  this.needs.push(needData);
  return this.save();
};

// Method to update location
individualSchema.methods.updateLocation = function(locationData) {
  this.currentLocation = { ...this.currentLocation, ...locationData, lastUpdated: new Date() };
  return this.save();
};

// Method to add case history entry
individualSchema.methods.addCaseHistory = function(caseData) {
  this.caseHistory.push(caseData);
  return this.save();
};

module.exports = mongoose.model('Individual', individualSchema);
