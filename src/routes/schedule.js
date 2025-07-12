import express from 'express';
import { protect, hasRole } from '../middleware/auth.js';
import { createSchedule, deleteSchedule, getAllSchedules, getScheduleById, updateSchedule, createMultipleSchedules } from '../controllers/ScheduleController.js';

const router = express.Router();



router.get('/', getAllSchedules);
// Create a new job
// router.post('/', protect, hasRole('recruiter'), createSchedule);
router.post('/', protect, createSchedule);

// router.post('/', protect, hasRole('recruiter'), createSchedule);
router.post('/multiple', protect, createMultipleSchedules);

// Update a job
// router.put('/:id', protect, hasRole('recruiter'), updateSchedule);
router.put('/:id', updateSchedule);

// Delete a job
// router.delete('/:id', protect, hasRole('recruiter'), deleteSchedule);
router.delete('/:id', deleteSchedule);

// Get a single job by ID
router.get('/:id', getScheduleById);

export default router;