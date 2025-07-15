/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /All:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     summary: Update user role (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {getMe,updateProfile,deleteAccount,getAllUser,updateUserRole,updateUserStatus,resetUserPassword} = require('../controllers/user.controller');
const { body, validationResult } = require('express-validator');
const { userLimiter } = require('../utils/rateLimiters');
const mongoose = require('mongoose');

const profileValidation = [
  body('userName').optional().isLength({ min: 3 }).withMessage('User name must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
];

const roleValidation = [
  body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID.' });
  }
  next();
};

router.get('/me',protect,getMe);
router.get('/All',protect,authorization(['admin']),getAllUser);
router.put('/role/:id',protect, authorization(['admin']),updateUserRole);
router.put('/user/:id',protect,userLimiter,validateObjectId,profileValidation,validate,updateProfile);
router.delete('/user/:id',protect,userLimiter,validateObjectId,deleteAccount);
router.patch('/status/:id',protect, authorization(['admin']),updateUserStatus);
router.patch('/reset-password/:id',protect, authorization(['admin']),resetUserPassword);
 module.exports= router;