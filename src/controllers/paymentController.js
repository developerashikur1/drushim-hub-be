const axios = require('axios');
const { successResponse, errorResponse } = require('../utils/response.js');

const PAYMENT_API_BASE_URL = 'https://api.greeninvoice.co.il/api/v1';

exports.getPaymentTypes = async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_API_BASE_URL}/payments/types?lang=en`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`,
      },
    });
    return successResponse(res, 'Payment types retrieved successfully', response.data);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve payment types', error);
  }
};

exports.createPayment = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['description', 'amount', 'currency', 'client'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return errorResponse(res, `Missing required fields: ${missingFields.join(', ')}`, null, 400);
    }
    
    // Validate client information
    if (!req.body.client.name || !req.body.client.emails || req.body.client.emails.length === 0) {
      return errorResponse(res, 'Client name and email are required', null, 400);
    }

    // Fix 1: Validate email format in client emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.client.emails.every(email => emailRegex.test(email))) {
      return errorResponse(res, 'Invalid email format in client emails', null, 400);
    }

    // Fix 2: Convert amount to cents if needed and validate numeric value
    const amount = Math.round(parseFloat(req.body.amount) * 100); // Convert to cents
    if (isNaN(amount) || amount <= 0) {
      return errorResponse(res, 'Invalid amount value', null, 400);
    }

    // Validate URLs
    const urlRegex = /^(https?:\/\/)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
    if (req.body.successUrl && !urlRegex.test(req.body.successUrl)) {
      return errorResponse(res, 'Invalid success URL format', null, 400);
    }
    if (req.body.failureUrl && !urlRegex.test(req.body.failureUrl)) {
      return errorResponse(res, 'Invalid failure URL format', null, 400);
    }
    if (req.body.notifyUrl && !urlRegex.test(req.body.notifyUrl)) {
      return errorResponse(res, 'Invalid notify URL format', null, 400);
    }

    const paymentData = {
      description: req.body.description,
      type: req.body.type || 320,
      date: req.body.date || new Date().toISOString().split('T')[0],
      dueDate: req.body.dueDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      lang: req.body.lang || "en",
      currency: req.body.currency.toUpperCase(),
      vatType: req.body.vatType || 0,
      amount: amount,
      maxPayments: req.body.maxPayments || 1,
      pluginId: req.body.pluginId || "87903a3c-cc68-447f-95a6-f0292a9f5b69",
      client: {
        ...req.body.client,
        country: req.body.client.country || "IL"
      },
      successUrl: req.body.successUrl,
      failureUrl: req.body.failureUrl,
      notifyUrl: req.body.notifyUrl,
      custom: {
        ...req.body.custom,
        amount: req.body.amount
      }
    };

    const tokenResponse = await axios.post(
      `${PAYMENT_API_BASE_URL}/account/token`,
      {
        id: process.env.PAYMENT_API_ID,
        secret: process.env.PAYMENT_API_SECRET
      }
    );
    
    if (!tokenResponse.data?.token) {
      console.error('Token response:', tokenResponse.data);
      throw new Error('Invalid token response from payment provider');
    }

    const bearerToken = tokenResponse.data.token;

    const response = await axios.post(`${PAYMENT_API_BASE_URL}/payments/form`, paymentData, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return successResponse(res, 'Payment created successfully', response.data);
  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message);
    return errorResponse(res, 'Failed to create payment', error.response?.data || error.message);
  }
};

exports.paymentWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('Received payment webhook:', webhookData);
    // Process the webhook data as needed
    return successResponse(res, 'Webhook received successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to process webhook', error);
  }
};