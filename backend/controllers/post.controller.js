const express= require('express');
const Post = require('../models/post.model');


exports.createPost= async(req,res)=>{
try {
    const { content, title, image,category} = req.body;
    const userId= req.user._id;

    if(!content|| !title ||!category) return res.status(403).json({message:"Content ,category and title are required"})
    
    const postExist = await Post.findOne({title})
    if (postExist) return res.status(406).json({message: "Already the post exist"});

    const blog = await Post.create({title,image,category,content,userId});
    res.status(201).json({success: true, message: blog});
    console.log('Post created successfully')
} catch (error) {
    res.status(405).json({message:"post not created"});
    console.error("failed to create",error.message)
}

}
exports.getAll = async(req,res) => {
    try {
        const blogs = await Post.find().populate('userId', 'userName email').sort({ createdAt: -1 }); // Newest first
        if(!blogs) return res.status(404).json({message:"No post found"});
        res.status(200).json({success: true,message: blogs})
        console.log("All blogs have been fetched")
    } catch (error) {
        res.status(404).json({message:"no post have been fetched"});
        console.error("failed to fetch",error.message)
    }
}

exports.getOne=async(req, res)=>{
   try {
    const {postId}= req.params.id;
    if(!postId) return res.status(400).json({message:"insert the postId"})

    const blog = await Post.findById(postId).populate('userId', 'userName email');
    if(!blog) return res.status(404).json({message:"No bpost to be fetched"});
     res.status(200).json({success: true, message: blog});
     console.log("One post fetched")
   } catch (error) {
        res.status(400).json({message: "not able to fetch"});
        console.error("no post was fetched", error.message)
   }
    
}

exports.updated= async(req, res)=>{
    try {
        const {postId} = req.params.id
        const {title,content,image,category} = req.body

        if(!postId) return res.status(400).json({message: "postId required"});

        const postExist=  await Post.findById(postId);

        if (!postExist) return res.status(404).json({message: "No such post that exist in the database"})
        
        const updatedPost = await Post.findByIdAndUpdate(postId, {title,content,image,category},({
            new: true,
            runValidators: true,
        })).populate('userId', 'userName email');

        if(!updatedPost) return res.status(500).json("not updated");
        res.status(201).json({success: true, message: updatedPost});

        console.log("Updated successfully");



    } catch (error) {
        res.status(500).json('Not able to update');
        console.error('updating failed', error.message)
    }
}

exports.deleteOne= async(req, res) => {
    try {
        const {postId} = req.params.id;
        
        if(!postId) return res.status(405).json({message: "input the postId"});

        const deleted = await Post.findByIdAndDelete(postId);
        if(!deleted) return res.status(400).json({message:"post Not deleted"});
        res.status(200).json("Post Deleted successfully");
        console.log("post deleted")
    } catch (error) {
        res.status(500).json("not abble to delete")
        console.error("Not able to delete", error.message)
    }
}
