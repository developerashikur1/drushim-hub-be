const express = require('express');
const { protect, hasRole } = require('../middleware/auth.js');
const {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getAllMyJobs,
  createJobPost,
} = require('../controllers/jobController.js');

const router = express.Router();
router.get('/',getAllJobs);
// Create a new job
router.post('/', protect, hasRole('recruiter'), createJob);

// router.post('/generate-job-post', protect, hasRole('recruiter'), createJobPost);
router.post('/generate-job-post', createJobPost);

// Update a job
router.put('/:id', protect, hasRole('recruiter'), updateJob);

// Delete a job
router.delete('/:id', protect, hasRole('recruiter'), deleteJob);

// Get all jobs with pagination and filters
router.get('/my-jobs',protect, hasRole('recruiter'),getAllMyJobs);


// Get a single job by ID
router.get('/:id', getJobById);

module.exports = router;