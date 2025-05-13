import express from 'express';
import { protect, hasRole } from '../middleware/auth.js';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getAllMyJobs,
  createJobPost,
} from '../controllers/jobController.js';

const router = express.Router();


router.get('/:id', getJobById);

router.get('/', getAllJobs);
// Create a new job
// router.post('/', protect, hasRole('recruiter'), createJob);
router.post('/',  createJob);

// router.post('/generate-job-post', protect, hasRole('recruiter'), createJobPost);
router.post('/generate-job-post', createJobPost);

// Update a job
// router.put('/:id', protect, hasRole('recruiter'), updateJob);
router.put('/:id', updateJob);

// Delete a job
// router.delete('/:id', protect, hasRole('recruiter'), deleteJob);
router.delete('/:id', deleteJob);

// Get all jobs with pagination and filters
// router.get('/my-jobs',protect, hasRole('recruiter'),getAllMyJobs);
router.get('/my-jobs', getAllMyJobs);


// Get a single job by ID

export default router;