const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) =>
  res.status(200).json({ success: true, message: 'TaskFlow API is running', time: new Date() })
);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) =>
  res.json({ success: true, message: 'Welcome to TaskFlow API', endpoints: ['/api/auth', '/api/projects', '/api/tasks', '/api/users', '/api/notifications'] })
);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database, then start the server
connectDB().then(() => {
  const server = app.listen(PORT, () =>
    console.log(`TaskFlow server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  );

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
