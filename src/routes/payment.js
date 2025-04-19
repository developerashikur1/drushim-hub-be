const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');

// Route to get payment types
router.get('/types', paymentController.getPaymentTypes);

// Route to create a payment
router.post('/create', paymentController.createPayment);

// Route to handle payment webhooks
router.post('/webhook', paymentController.paymentWebhook);

module.exports = router;