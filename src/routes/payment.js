// const express = require('express');
// const router = express.Router();
// const paymentController = require('../controllers/paymentController.js');

// // Route to get payment types
// router.get('/types', paymentController.getPaymentTypes);

// // Route to create a payment
// router.post('/create', paymentController.createPayment);

// // Route to handle payment webhooks
// router.post('/webhook', paymentController.paymentWebhook);

// module.exports = router;

import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get payment types
router.get('/types', paymentController.getPaymentTypes);

// Route to create a payment
router.post('/make-payment', protect, paymentController.makePayment);

// Route to create a payment
router.post('/create', paymentController.createPayment);

// Route to handle payment webhooks
router.post('/webhook', paymentController.paymentWebhook);

export default router;