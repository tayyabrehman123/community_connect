const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const filter = { status: 'active' };
    if (req.query.profession) {
      filter.profession = req.query.profession;
    }
    const jobs = await Job.find(filter).populate('postedBy', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jobs posted by a specific user (for testing, use ?userId=xxx)
router.get('/my-jobs', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId query param required' });
    }
    const jobs = await Job.find({ postedBy: userId })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new job (NO AUTH REQUIRED FOR TESTING)
router.post('/', async (req, res) => {
  try {
    const { profession } = req.body;
    if (!profession) {
      return res.status(400).json({ message: 'Profession is required' });
    }
    const job = new Job(req.body);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job (NO AUTH REQUIRED FOR TESTING)
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job (NO AUTH REQUIRED FOR TESTING)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jobs for a specific worker's profession
router.get('/for-worker/:workerId', async (req, res) => {
  try {
    const User = require('../models/User');
    const worker = await User.findById(req.params.workerId);
    if (!worker || !worker.profession) {
      return res.status(404).json({ message: 'Worker or profession not found' });
    }
    const jobs = await Job.find({ profession: worker.profession, status: 'active' }).populate('postedBy', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 