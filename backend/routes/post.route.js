/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Blog post endpoints
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post (admin only)
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               content:
 *                 type: string
 *                 minLength: 10
 *               image:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Post already exists
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a single post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post (admin only)
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post (admin only)
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {deleteOne, updated, getAll,getOne,createPost,flagPost,unflagPost,getFlaggedPosts}= require('../controllers/post.controller')
const { body, validationResult } = require('express-validator');
const { postLimiter } = require('../utils/rateLimiters');
const mongoose = require('mongoose');

const postValidation = [
  body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').optional().isLength({ min: 2, max: 30 }).withMessage('Category must be 2-30 characters'),
];

const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid post ID.' });
  }
  next();
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

router.post('/posts',protect,authorization(['admin']),postLimiter,postValidation,validate,createPost);
router.get('/posts',getAll);
router.get('/posts/:id',protect,validateObjectId,getOne);
router.put('/posts/:id',protect,authorization(['admin']),postLimiter,validateObjectId,postValidation,validate,updated);
router.delete('/posts/:id',protect,authorization(['admin']),postLimiter,validateObjectId,deleteOne);
router.patch('/posts/:id/flag', protect, flagPost);
router.patch('/posts/:id/unflag', protect, unflagPost);
router.get('/flagged-posts', protect, authorization(['admin']), getFlaggedPosts);

module.exports= router;