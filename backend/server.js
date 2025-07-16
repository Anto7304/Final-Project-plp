const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.route');
const commentRoutes = require('./routes/comment.route');
const postRoutes = require('./routes/post.route');
const userRoutes = require('./routes/user.route');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { logger } = require('./utils/logger');
const { protect, authorization } = require('./middleware/authorization');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const statusMonitor = require('express-status-monitor');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
// Only sanitize req.body to avoid Express 5 incompatibility
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  next();
});
// app.use(xss()); // Disabled: not compatible with Express 5. Manually sanitize user input in controllers if needed.
app.use(hpp());
app.use(compression());

// Helmet config: stricter in production
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  );
} else {
  app.use(helmet());
}

// CORS: use env variable for origin in production
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['PUT', 'GET', 'DELETE', 'POST', 'PATCH'],
    credentials: true,
  })
);

// Status Monitor
app.use(statusMonitor());

function restrictToLocalhost(req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.ip !== '127.0.0.1' && req.ip !== '::1') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
}

app.use('/api/monitor', restrictToLocalhost, statusMonitor().pageRoute);
// NOTE: In production, restrict /api/monitor to admin IPs or protect with authentication.

// Swagger/OpenAPI setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Final Project API',
    version: '1.0.0',
    description: 'API documentation for the Final Project backend',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'], // Scan for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/docs', restrictToLocalhost, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', commentRoutes);
app.use('/api',postRoutes)

// Admin endpoint to fetch audit logs
app.get('/api/audit-logs', protect, authorization(['admin']), (req, res) => {
  const logPath = path.join(__dirname, 'logs', 'audit.log');
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not read audit log' });
    const lines = data.trim().split('\n').filter(Boolean);
    const logs = lines.map(line => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
    res.json({ success: true, logs });
  });
});

// Admin endpoint to clear audit logs
app.delete('/api/audit-logs', protect, authorization(['admin']), (req, res) => {
  const logPath = path.join(__dirname, 'logs', 'audit.log');
  fs.writeFile(logPath, '', 'utf8', (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not clear audit log' });
    res.json({ success: true, message: 'Audit log cleared' });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    error: err
  });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => {
    logger.info('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Process terminated');
  });
});