const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: true
  },
  individual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Individual',
    required: true
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  categories: {
    cleanliness: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    safety: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    staff: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    services: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    accessibility: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    communication: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  },
  review: {
    title: String,
    content: {
      type: String,
      maxlength: 1000
    },
    pros: [String],
    cons: [String],
    recommendations: String
  },
  experience: {
    stayDuration: String,
    visitDate: Date,
    servicesUsed: [String],
    outcome: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed']
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  response: {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    respondedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  moderation: {
    flaggedBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      flaggedAt: Date
    }],
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationNotes: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
ratingSchema.index({ shelter: 1, createdAt: -1 });
ratingSchema.index({ individual: 1, createdAt: -1 });
ratingSchema.index({ overallRating: 1 });
ratingSchema.index({ status: 1 });
ratingSchema.index({ isPublic: 1, status: 1 });

// Compound index to prevent duplicate ratings
ratingSchema.index({ shelter: 1, individual: 1 }, { unique: true });

// Virtual for average category rating
ratingSchema.virtual('averageCategoryRating').get(function() {
  const categories = Object.values(this.categories);
  const ratings = categories.filter(cat => cat.rating).map(cat => cat.rating);
  
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Method to mark as helpful
ratingSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark as helpful
ratingSchema.methods.unmarkHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count = Math.max(0, this.helpful.count - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add response
ratingSchema.methods.addResponse = function(userId, content) {
  this.response = {
    from: userId,
    content: content,
    respondedAt: new Date()
  };
  return this.save();
};

// Method to flag rating
ratingSchema.methods.flag = function(userId, reason) {
  this.moderation.flaggedBy.push({
    user: userId,
    reason: reason,
    flaggedAt: new Date()
  });
  
  if (this.moderation.flaggedBy.length >= 3) {
    this.status = 'flagged';
  }
  
  return this.save();
};

// Method to moderate rating
ratingSchema.methods.moderate = function(moderatorId, status, notes = '') {
  this.status = status;
  this.moderation.moderatedBy = moderatorId;
  this.moderation.moderatedAt = new Date();
  this.moderation.moderationNotes = notes;
  return this.save();
};

// Static method to get average rating for a shelter
ratingSchema.statics.getAverageRating = async function(shelterId) {
  const result = await this.aggregate([
    { $match: { shelter: mongoose.Types.ObjectId(shelterId), status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$overallRating' },
        totalRatings: { $sum: 1 },
        categoryAverages: {
          $push: {
            cleanliness: '$categories.cleanliness.rating',
            safety: '$categories.safety.rating',
            staff: '$categories.staff.rating',
            services: '$categories.services.rating',
            accessibility: '$categories.accessibility.rating',
            communication: '$categories.communication.rating'
          }
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      categoryAverages: {}
    };
  }
  
  const data = result[0];
  const categoryAverages = {};
  
  // Calculate category averages
  ['cleanliness', 'safety', 'staff', 'services', 'accessibility', 'communication'].forEach(category => {
    const ratings = data.categoryAverages
      .map(cat => cat[category])
      .filter(rating => rating !== null && rating !== undefined);
    
    categoryAverages[category] = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
  });
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalRatings: data.totalRatings,
    categoryAverages: categoryAverages
  };
};

// Static method to get ratings for a shelter with pagination
ratingSchema.statics.getShelterRatings = function(shelterId, page = 1, limit = 10, sortBy = 'createdAt') {
  const skip = (page - 1) * limit;
  
  return this.find({ 
    shelter: shelterId, 
    status: 'approved',
    isPublic: true 
  })
  .populate('individual', 'personalInfo.firstName personalInfo.lastName')
  .sort({ [sortBy]: -1 })
  .skip(skip)
  .limit(limit);
};

module.exports = mongoose.model('Rating', ratingSchema);
