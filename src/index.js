// // Import environment variables and required modules
// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const cookieParser = require('cookie-parser');
// // const authRouter = require('./routes/auth.js');
// // const jobsRouter = require('./routes/jobs.js');
// // const uploadRouter = require('./routes/upload.js');
// // const jobsApplicationsRouter = require('./routes/apply.js');
// // // const paymentRouter = require('./routes/payment.js');
// // const courseRoutes = require('./routes/courseRoutes.js');
// // const blogRoutes = require('./routes/blogRoutes.js');
// // const morgan = require('morgan');
// // const path = require('path');
// // const fs = require('fs');

// import dotenv from 'dotenv';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import authRouter from './routes/auth.js';
// import jobsRouter from './routes/jobs.js';
// import uploadRouter from './routes/upload.js';
// import jobsApplicationsRouter from './routes/apply.js';
// import paymentRouter from './routes/payment.js';
// import courseRoutes from './routes/courseRoutes.js';
// import blogRoutes from './routes/blogRoutes.js';
// import morgan from 'morgan';
// import path from 'path';
// import { promises as fs } from 'fs';


// // Create Express app
// const app = express();

// // initialize dotenv
// dotenv.config();


// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
//   // console.log('Headers:', req.headers);
//   next();
// });
// app.use(morgan('dev'));
// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Define allowed origins dynamically from environment variable
// const allowedOrigins = [
//   'http://localhost:8080',
//   'http://localhost:8081',
//   'https://drushimavodot.vercel.app',
// ]; // Add your frontend URLs here

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           'The CORS policy for this site does not allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//       'authorization',
//       'Accept',
//       'Cookie',
//       'Origin',
//       'X-Requested-With',
//     ],
//     credentials: true,
//     exposedHeaders: ['Set-Cookie'],
//     preflightContinue: false, // Ensure preflight requests are handled
//     optionsSuccessStatus: 204, // Respond with 204 for preflight requests
//   })
// );
// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   // console.log('SIGTERM signal received. Closing server...');
//   server.close(() => {
//     console.log('Server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });

// // Root endpoint redirect
// app.get('/', (req, res) => {
//   res.redirect('/api');
// });

// // Health check endpoint
// app.get('/api', (req, res) => {
//   res.json({
//     message: 'API is running',
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//   });
// });

// // Routes
// app.use('/api/auth', authRouter);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/jobs', jobsRouter);
// app.use('/api/jobs/applications', jobsApplicationsRouter);
// app.use('/api/upload', uploadRouter);
// app.use('/api/payments', paymentRouter);
// app.use('/api/courses', courseRoutes);

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Serve uploaded files statically
// app.use('/uploads', express.static(uploadsDir));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // Start server
// const PORT = process.env.PORT || 10000;
// const server = app.listen(Number(PORT), () => {
//   console.log(`Server running on port ${PORT}`);
// });



import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Routes
import jobsApplicationsRouter from './routes/apply.js';
import authRouter from './routes/auth.js';
import blogRoutes from './routes/blogRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import jobsRouter from './routes/jobs.js';
import paymentRouter from './routes/payment.js';
import scheduleRouter from './routes/schedule.js';
import uploadRouter from './routes/upload.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// CORS configuration
const allowedOrigins = [
    'https://drushim-hub.netlify.app',
    'http://localhost:8080',
    'http://localhost:8081',
  ];
  
//   app.use(
//     cors({
//       origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           console.warn(`❌ CORS blocked: ${origin}`);
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//       allowedHeaders: [
//         'Content-Type',
//         'Authorization',
//         'X-Requested-With',
//         'Accept',
//         'Origin',
//       ],
//       exposedHeaders: ['Set-Cookie'],
//       optionsSuccessStatus: 204,
//     })
//   );

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('🔁 Server closed');
    mongoose.connection.close(false, () => {
      console.log('🛑 MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Health check
app.get('/api', (req, res) => {
  res.json({
    message: 'API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/jobs/applications', jobsApplicationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/courses', courseRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, '../uploads');

try {
  await fs.mkdir(uploadsDir, { recursive: true });
  console.log('📂 Uploads directory ready.');
} catch (err) {
  console.error('❌ Failed to create uploads directory:', err);
}

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Error handler
app.use((err, req, res, next) => {
  console.error('❗ Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8000;


const server = app.listen(Number(PORT), () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
