const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');

// Validation middleware
const validateInternshipInput = (req, res, next) => {
  const { title, company, location, description, requirements, responsibilities, deadline } = req.body;
  
  if (!title || !company || !location || !description || !requirements || !responsibilities || !deadline) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Convert single strings to arrays if needed
  if (typeof req.body.requirements === 'string') {
    req.body.requirements = req.body.requirements.split('\n').filter(item => item.trim().length > 0);
  }
  
  if (typeof req.body.responsibilities === 'string') {
    req.body.responsibilities = req.body.responsibilities.split('\n').filter(item => item.trim().length > 0);
  }
  
  if (req.body.benefits && typeof req.body.benefits === 'string') {
    req.body.benefits = req.body.benefits.split('\n').filter(item => item.trim().length > 0);
  }

  // Ensure deadline is a valid date
  if (req.body.deadline) {
    req.body.deadline = new Date(req.body.deadline);
  }
  
  next();
};

// @route   POST /api/internships
// @desc    Create a new internship
// @access  Private (mentors only)
router.post('/', auth, validateInternshipInput, async (req, res) => {
  try {
    // Check if user is mentor or employer
    if (req.user.role !== 'mentor' && req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only mentors can create internships' });
    }

    const {
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      benefits,
      deadline,
      status,
      duration
    } = req.body;

    // Create new internship
    const internship = new Internship({
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      benefits,
      deadline,
      status,
      duration,
      mentor: req.user.id // Associate with the mentor who created it
    });

    const savedInternship = await internship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('mentor', 'name email'); // Get mentor details
    
    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/mentor
// @desc    Get internships created by the logged-in mentor
// @access  Private (mentors only)
router.get('/mentor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const internships = await Internship.find({ mentor: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(internships);
  } catch (error) {
    console.error('Error fetching mentor internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/:id
// @desc    Get internship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('mentor', 'name email');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/internships/:id
// @desc    Update internship
// @access  Private (mentor only)
router.put('/:id', auth, validateInternshipInput, async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the creator of the internship
    if (internship.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this internship' });
    }
    
    // Update fields
    const updatedFields = { ...req.body };
    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    
    res.json(internship);
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship
// @access  Private (mentor only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the creator of the internship
    if (internship.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this internship' });
    }
    
    await Internship.findByIdAndRemove(req.params.id);
    res.json({ message: 'Internship removed' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;