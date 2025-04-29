const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('internship', 'title company')
      .populate('student', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const applications = await Application.find({ student: req.params.studentId })
      .populate('internship', 'title company')
      .populate('student', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications by internship ID
router.get('/internship/:internshipId', async (req, res) => {
  try {
    const applications = await Application.find({ internship: req.params.internshipId })
      .populate('internship', 'title company')
      .populate('student', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internship', 'title company')
      .populate('student', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new application
router.post('/', async (req, res) => {
  const application = new Application({
    internship: req.body.internship,
    student: req.body.student,
    resume: req.body.resume,
    coverLetter: req.body.coverLetter,
    status: req.body.status
  });

  try {
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = req.body.status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    await application.remove();
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
