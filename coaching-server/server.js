require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');
const cors    = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Security & Logging
app.use(helmet());
app.use(morgan('combined'));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static uploaded files
app.use('/api/uploads',
  cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }),
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'public/uploads'))
);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount Routes
try {
  const authRoutes = require('./routes/auth');
  const courseRoutes = require('./routes/courses');
  const blogRoutes = require('./routes/blogs');
  const serviceRoutes = require('./routes/services');
  const contactRoutes = require('./routes/contacts');
  const studentRoutes = require('./routes/students'); // NEW
  const adminManagementRoutes = require('./routes/admin'); // NEW
const paymentRoutes = require('./routes/payment'); // ✅ Correct


  // Public API Routes (accessible by anyone, including students without login for Browse)
  app.use('/api/courses', courseRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/contacts', contactRoutes); // For contact forms

  // Authentication Routes (for both admin and students)
  app.use('/api/auth', authRoutes);

  // Student Specific Routes (require student role)
  app.use('/api/student', studentRoutes);

  // Admin Specific Management Routes (require admin role, for managing data like students, enrollments)
  app.use('/api/admin', adminManagementRoutes); // New base path for admin-specific management

    // NEW: Mount Payment Routes
app.use('/api/payments', paymentRoutes); // ✅ Keep this

  console.log('✅ All routes mounted successfully');
} catch (err) {
  console.error('❌ Route mounting error:', err);
}

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} at http://localhost:${PORT}`);
});