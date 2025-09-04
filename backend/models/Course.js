const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'interactive', 'project', 'reading', 'quiz'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'file']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Arts', 'Music', 'Programming', 'Science', 'Mathematics', 'Language']
  },
  grade: {
    type: Number,
    required: true,
    min: 7,
    max: 9
  },
  thumbnail: {
    type: String,
    default: ''
  },
  modules: [moduleSchema],
  assessment: assessmentSchema,
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  price: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  learningObjectives: [{
    type: String,
    required: true
  }],
  completionCertificate: {
    enabled: {
      type: Boolean,
      default: true
    },
    template: {
      type: String,
      default: 'default'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ grade: 1, category: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1, isActive: 1 });
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ tags: 1 });

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function() {
  // This would be calculated based on enrollment data
  return 0;
});

// Pre-save middleware to update enrollment count
courseSchema.pre('save', function(next) {
  if (this.isModified('enrollmentCount')) {
    // Update any related statistics
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);