const express= require('express');
const Post = require('../models/post.model');
const { logger, auditLogger } = require('../utils/logger'); // Use auditLogger for sensitive actions

exports.createPost= async(req,res)=>{
    try {
        const { content, title, image,category} = req.body;
        const userId= req.user.id;

        // Generate slug from title
        const slugify = (str) => str
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')           // Replace spaces with -
          .replace(/&/g, '-and-')          // Replace & with 'and'
          .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
          .replace(/--+/g, '-')            // Replace multiple - with single -
          .replace(/^-+/, '')              // Trim - from start of text
          .replace(/-+$/, '');             // Trim - from end of text
        const slug = slugify(title);

        if(!content|| !title ) return res.status(400).json({ success: false, message: "Content and title are required" })
        
        const postExist = await Post.findOne({title})
        if (postExist) return res.status(409).json({ success: false, message: "Post with this title already exists" });

        const blog = await Post.create({title,image:image||null,category:category|| 'uncategorized',content,userId, slug});
        res.status(201).json({ success: true, post: blog });
        logger.info(`Post created: ${blog._id}`);
        auditLogger.info({ action: 'createPost', userId, postId: blog._id });
    } catch (error) {
        logger.error(`Failed to create post: ${error.message}`);
        res.status(500).json({ success: false, message: "Post not created" });
    }
}

exports.getAll = async(req,res) => {
    try {
        const blogs = await Post.find().populate('userId', 'userName email').sort({ createdAt: -1 });
        if(!blogs || blogs.length === 0) return res.status(404).json({ success: false, message: "No posts found" });
        res.status(200).json({ success: true, message: blogs })
        logger.info("All posts fetched");
    } catch (error) {
        logger.error(`Failed to fetch posts: ${error.message}`);
        res.status(500).json({ success: false, message: "No posts have been fetched" });
    }
}

exports.getOne=async(req, res)=>{
    try {
        const postId = req.params.id;
        const blog = await Post.findById(postId).populate('userId', 'userName email');
        if(!blog) return res.status(404).json({ success: false, message: "No post found" });
        res.status(200).json({ success: true, post: blog });
        logger.info(`Post fetched: ${postId}`);
    } catch (error) {
        logger.error(`Failed to fetch post: ${error.message}`);
        res.status(500).json({ success: false, message: "Not able to fetch post" });
    }
}

exports.updated = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content, image, category, slug } = req.body;

    const postExist = await Post.findById(postId);
    if (!postExist) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    postExist.title = title || postExist.title;
    postExist.content = content || postExist.content;
    postExist.image = image || postExist.image;
    postExist.category = category || postExist.category;
    postExist.slug = slug || postExist.slug; // Always set slug

    // If using multer for file upload:
    if (req.file) {
      postExist.image = req.file.path; // or whatever your image field is
    }

    const updatedPost = await postExist.save();

    logger.info(`Post updated: ${postId}`);
    auditLogger.info({ action: 'updatePost', userId: req.user.id, postId });

    res.status(200).json({ success: true, post: updatedPost });
  } catch (err) {
    next(err);
  }
};

exports.deleteOne= async(req, res) => {
    try {
        const postId = req.params.id;
        const userId= req.user.id;
        const userRole =req.user.role;

        if(!postId) return res.status(400).json({ success: false, message: "postId required" });

        const post= await Post.findById(postId);
        if(!post) return res.status(404).json({ success: false, message: "Post not found" });

        if(post.userId.toString()!== userId.toString()&& userRole!=='admin') return res.status(403).json({ success: false, message: "You are not authorized to delete this post" })
        await post.deleteOne();
        res.status(200).json({ success: true, message: "Post deleted successfully" })
        logger.info(`Post deleted: ${postId}`);
        auditLogger.info({ action: 'deletePost', userId, postId });
    } catch (error) {
        logger.error(`Failed to delete post: ${error.message}`);
        res.status(500).json({ success: false, message: "Not able to delete post" })
    }
}

exports.flagPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        if (post.flags.includes(userId)) return res.status(400).json({ success: false, message: 'Already flagged' });
        post.flags.push(userId);
        await post.save();
        res.status(200).json({ success: true, message: 'Post flagged' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to flag post' });
    }
};

exports.unflagPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        post.flags = post.flags.filter(id => id.toString() !== userId.toString());
        await post.save();
        res.status(200).json({ success: true, message: 'Post unflagged' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unflag post' });
    }
};

exports.getFlaggedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ flags: { $exists: true, $not: { $size: 0 } } }).populate('userId', 'userName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch flagged posts' });
    }
};
