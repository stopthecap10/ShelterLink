const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    emergencyContact: {
      name: String,
      phone: String
    }
  },
  capacity: {
    totalBeds: { type: Number, required: true, min: 0 },
    availableBeds: { type: Number, required: true, min: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  services: [{
    name: { type: String, required: true },
    description: String,
    available: { type: Boolean, default: true }
  }],
  requirements: [{
    type: { type: String, required: true },
    description: String,
    mandatory: { type: Boolean, default: false }
  }],
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for text search
shelterSchema.index({ 
  name: "text", 
  description: "text", 
  "address.city": "text", 
  "address.state": "text" 
});

// Virtual for availability percentage
shelterSchema.virtual('availabilityPercentage').get(function() {
  if (this.capacity.totalBeds === 0) return 0;
  return Math.round((this.capacity.availableBeds / this.capacity.totalBeds) * 100);
});

// Method to update bed availability
shelterSchema.methods.updateAvailability = function(availableBeds) {
  this.capacity.availableBeds = Math.max(0, Math.min(availableBeds, this.capacity.totalBeds));
  this.capacity.lastUpdated = new Date();
  return this.save();
};

// Method to add a service
shelterSchema.methods.addService = function(serviceData) {
  this.services.push(serviceData);
  return this.save();
};

// Method to update rating
shelterSchema.methods.updateRating = function(newRating) {
  const totalRatings = this.rating.count;
  const currentTotal = this.rating.average * totalRatings;
  const newTotal = currentTotal + newRating;
  const newCount = totalRatings + 1;
  
  this.rating.average = newTotal / newCount;
  this.rating.count = newCount;
  return this.save();
};

module.exports = mongoose.model('Shelter', shelterSchema);
