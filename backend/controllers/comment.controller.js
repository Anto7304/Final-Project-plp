const express = require('express');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model')
const { logger, auditLogger } = require('../utils/logger'); // Use auditLogger for sensitive actions
const mongoose = require('mongoose');

const createComment = async(req, res)=>{
    try {
        const {postId, content}  = req.body;
        const userId = req.user.id;

        if(!postId || !content)  return res.status(400).json({ success: false, message: "postId and content are required" })
        
        const exist = await Post.findById(postId);
        if (!exist) return res.status(404).json({ success: false, message: "No such post to comment" });

        const comment = await Comment.create({
            postId,
            userId,
            content,
            likes: [],
            numberOfLikes: 0
        });

        res.status(201).json({ success: true, comment })
        logger.info(`Comment created: ${comment._id}`);
        auditLogger.info({ action: 'createComment', userId, commentId: comment._id, postId });
    }   catch (error) {
        logger.error(`Failed to create comment: ${error.message}`);
        res.status(500).json({ success: false, message: "Not able to create a comment" });
    }
};

const getComments = async(req, res)=>{
    try {
        const {postId}= req.params;
        if(!postId) return res.status(400).json({ success: false, message: "Post id required" });
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" });
        }
        // Populate userId with userName and email
        const comments = await Comment.find({postId}).populate('userId', 'userName email');
        res.status(200).json({ success: true, message: comments, count: comments.length });
        logger.info(`Comments fetched for post: ${postId}`);
    } catch (error) {
        logger.error(`Failed to fetch comments: ${error.message}`);
        res.status(500).json({ success: false, message: "Can't fetch comments" });
    }
}

const updateComment = async (req, res) => {
    try {
        const {id} = req.params;
        const {content} = req.body;
        const userId = req.user.id;

        if(!content) return res.status(400).json({ success: false, message: "Content is required" });
        
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ success: false, message: "No comment found" });

        if(comment.userId.toString() !== userId.toString()) return res.status(403).json({ success: false, message: "You are not authorized" });
        comment.content = content;
        const updated = await comment.save();

        res.status(200).json({ success: true, comment: updated });
        logger.info(`Comment updated: ${id}`);
        auditLogger.info({ action: 'updateComment', userId, commentId: id });
    } catch (error) {
        logger.error(`Failed to update comment: ${error.message}`);
        res.status(500).json({ success: false, message: "Not updated" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        if (comment.userId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        logger.info(`Comment deleted: ${id}`);
        auditLogger.info({ action: 'deleteComment', userId, commentId: id });
    } catch (error) {
        logger.error(`Error deleting comment: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id.toString(); // Ensure string

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Convert all likes to string for comparison
        comment.likes = comment.likes.map(like => like.toString());
        const likeIndex = comment.likes.indexOf(userId);
        let message = '';

        if (likeIndex === -1) {
            comment.likes.push(userId);
            comment.numberOfLikes += 1;
            message = 'Comment liked';
        } else {
            comment.likes.splice(likeIndex, 1);
            comment.numberOfLikes -= 1;
            message = 'Comment unliked';
        }

        const updatedComment = await comment.save();

        res.status(200).json({
            success: true,
            message,
            data: {
                likes: updatedComment.likes,
                numberOfLikes: updatedComment.numberOfLikes
            }
        });
        logger.info(`Comment like toggled: ${id}`);
        auditLogger.info({ action: 'toggleLike', userId, commentId: id, like: message });
    } catch (error) {
        logger.error(`Error toggling like: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const flagComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        if (comment.flags.includes(userId)) return res.status(400).json({ success: false, message: 'Already flagged' });
        comment.flags.push(userId);
        await comment.save();
        res.status(200).json({ success: true, message: 'Comment flagged' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to flag comment' });
    }
};

const unflagComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        comment.flags = comment.flags.filter(id => id.toString() !== userId.toString());
        await comment.save();
        res.status(200).json({ success: true, message: 'Comment unflagged' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unflag comment' });
    }
};

const getFlaggedComments = async (req, res) => {
    try {
        const comments = await Comment.find({ flags: { $exists: true, $not: { $size: 0 } } }).populate('userId', 'userName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch flagged comments' });
    }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  toggleLike,
  flagComment,
  unflagComment,
  getFlaggedComments
};