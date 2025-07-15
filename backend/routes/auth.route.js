/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - userName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               userName:
 *                 type: string
 *                 minLength: 3
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User or username already exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and receive JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       403:
 *         description: Wrong password
 *       404:
 *         description: User not found
 */
const express = require('express');
const router = express.Router();
const {signUp,login} = require('../controllers/auth.controller')
const {protect, authorization} = require('../middleware/authorization')
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../utils/rateLimiters');
const ExpressBrute = require('express-brute');

// Brute-force protection (MemoryStore for demo; use RedisStore in production)
const bruteStore = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(bruteStore, {
  freeRetries: 5,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour
  failCallback: (req, res, next, nextValidRequestDate) => {
    return res.status(429).json({
      success: false,
      message: `Too many failed login attempts. Try again at ${nextValidRequestDate.toLocaleTimeString()}`
    });
  }
});

router.post(
  '/signup',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('userName').isLength({ min: 3 }).withMessage('User name must be at least 3 characters'),
    body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }
    next();
  },
  signUp
);

router.post(
  '/login',
  authLimiter,
  bruteForce.prevent,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }
    next();
  },
  login
);

module.exports=router;