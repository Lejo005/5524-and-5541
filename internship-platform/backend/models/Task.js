const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'submitted', 'approved', 'rejected'],
    default: 'assigned'
  },
  submission: {
    content: {
      type: String,
      default: null
    },
    submittedAt: {
      type: Date,
      default: null
    }
  },
  feedback: {
    content: {
      type: String,
      default: null
    },
    providedAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
