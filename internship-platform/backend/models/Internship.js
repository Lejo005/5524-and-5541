const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an internship title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [50, 'Company name cannot be more than 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  requirements: {
    type: [String],
    required: [true, 'Please provide at least one requirement'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please provide at least one requirement'
    }
  },
  responsibilities: {
    type: [String],
    required: [true, 'Please provide at least one responsibility'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please provide at least one responsibility'
    }
  },
  benefits: {
    type: [String],
    default: []
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide an application deadline'],
    validate: {
      validator: function(v) {
        return v > Date.now();
      },
      message: 'Deadline must be in the future'
    }
  },
  duration: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open'
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
InternshipSchema.index({ title: 'text', company: 'text', description: 'text' });
InternshipSchema.index({ status: 1 });
InternshipSchema.index({ deadline: 1 });

module.exports = mongoose.model('Internship', InternshipSchema);