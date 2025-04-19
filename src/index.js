// Import environment variables and required modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.js');
const jobsRouter = require('./routes/jobs.js');
const uploadRouter = require('./routes/upload.js');
const jobsApplicationsRouter = require('./routes/apply.js');
const paymentRouter = require('./routes/payment.js');
const courseRoutes = require('./routes/courseRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');


// Create Express app
const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  // console.log('Headers:', req.headers);
  next();
});
app.use(morgan('dev'));
// Middleware
app.use(express.json());
app.use(cookieParser());

// Define allowed origins dynamically from environment variable
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'https://drushimavodot.vercel.app',
]; // Add your frontend URLs here

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'authorization',
      'Accept',
      'Cookie',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false, // Ensure preflight requests are handled
    optionsSuccessStatus: 204, // Respond with 204 for preflight requests
  })
);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  // console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Root endpoint redirect
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Health check endpoint
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
app.use('/api/jobs/applications', jobsApplicationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/courses', courseRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 10000;
const server = app.listen(Number(PORT), () => {
  console.log(`Server running on port ${PORT}`);
});
