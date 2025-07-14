const express = require('express');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model')

exports.createComment=async(req, res)=>{
    try {
            const {postId, content}  = req.body;
    const userId = req.user._id;

    if(!postId || !content)  return res.status(403).json("postId and content are required")
    
    const exist = await Post.findById(postId);
     if (!exist) return res.json("No such post to comment");

    const comment = await Comment.create({
        postId,
        userId,
        content,
        likes: [],
        numberOfLikes: 0
    });

    res.status(201).json({success: true, message: comment})

    }   catch (error) {
        req.status(500).json(" not able to create a comment");
        console.error("no comment created", error.message)
    }
};

exports.getComments = async(req, res)=>{
    try {
        const {postId}= req.params;
        if(!postId) return res.json("Post id required")

            const comments = await Comment.find({_id:postId});

            res.status(200).json({ success: true, count: comments.length,message: comments});
            console.log("All comments have been fetched");
    } catch (error) {
        res.status(500).json("cant fetch comments");
        console.error("cant fetch comments", error.message)
    }
}


exports.updateComment= async (req, res)=>{
    try {
        const {id} =req.params;
        const {content} = req.body;
        const userId = req.user._id

        if(!content) return res.status(404).json("Content is required")
             
            const comment = await Comment.findById(id);

            if (!comment) return res.status(404).json({message: "No comment"});

            // to check ownership before updating

        if(comment.userId.toString() !== userId.toString()) return res.status(403).json({message: "you are not authorized"})
            comment.content =content 
        const updated = await comment.save();

        res.status(201).json({success: true, message: updated})
        console.log("Updated comment successfully")
        
    } catch (error) {
        res.status(500).json("not updated");
        console.log("updating failed",error.message)
    }
}

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role; // From authentication middleware

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership or admin status
    if (comment.userId.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already liked the comment
    const likeIndex = comment.likes.indexOf(userId);
    let message = '';

    if (likeIndex === -1) {
      // Add like
      comment.likes.push(userId);
      comment.numberOfLikes += 1;
      message = 'Comment liked';
    } else {
      // Remove like
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

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};