// const express = require('express');
// const router = express.Router();
// const jobApplicationController = require('../controllers/applyController.js');
// const { protect, hasRole } = require('../middleware/auth.js');
// router.post('/', jobApplicationController.applyForJob);
// router.get('/', jobApplicationController.getAllApplications);
// router.get('/user/:email', jobApplicationController.getApplicationsByUser);
// router.get('/:id', jobApplicationController.getApplicationById);

// module.exports = router;


import express from 'express';
import * as jobApplicationController from '../controllers/applyController.js';
import { protect, hasRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', jobApplicationController.applyForJob);
router.get('/', jobApplicationController.getAllApplications);
router.get('/user/:email', jobApplicationController.getApplicationsByUser);
router.get('/:id', jobApplicationController.getApplicationById);

export default router;