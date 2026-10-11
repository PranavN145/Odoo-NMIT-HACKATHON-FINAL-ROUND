const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const eventsRoutes = require('./routes/events.routes');
const productsRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api', productsRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
