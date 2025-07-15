/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment endpoints
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to comment on
 *               content:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /{id}/toggle-like:
 *   patch:
 *     summary: Like or unlike a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Like toggled
 *       404:
 *         description: Comment not found
 */
const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {createComment,getComments,updateComment,deleteComment,toggleLike,flagComment,unflagComment,getFlaggedComments } = require('../controllers/comment.controller')
const { body, validationResult } = require('express-validator');
const { commentLimiter } = require('../utils/rateLimiters');
const mongoose = require('mongoose');

const commentValidation = [
  body('content').isLength({ min: 2, max: 500 }).withMessage('Content must be 2-500 characters'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

// Robust ObjectId validator middleware
function validateObjectId(param) {
  return function(req, res, next) {
    const id = req.params[param];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: `Invalid ${param}` });
    }
    next();
  };
}

router.post('/comments', protect, commentLimiter, commentValidation, validate, createComment);
router.get('/comments/:postId', protect, validateObjectId('postId'), getComments);
router.put('/comments/:id', protect, commentLimiter, validateObjectId('id'), commentValidation, validate, updateComment);
router.delete('/comments/:id', protect, commentLimiter, validateObjectId('id'), deleteComment);

router.patch('/comments/:id/toggle-like', protect, toggleLike);
router.patch('/comments/:id/flag', protect, flagComment);
router.patch('/comments/:id/unflag', protect, unflagComment);
router.get('/flagged-comments', protect, authorization(['admin']), getFlaggedComments);

module.exports = router;