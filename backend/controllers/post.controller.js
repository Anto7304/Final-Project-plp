const express= require('express');
const Post = require('../models/post.model');


exports.createPost= async(req,res)=>{
try {
    const { content, title, image,category} = req.body;
    const userId= req.user._id;

    if(!content|| !title ) return res.status(400).json({message:"Content  and title are required"})
    
    const postExist = await Post.findOne({title})
    if (postExist) return res.status(406).json({message: "Already the post exist"});

    const blog = await Post.create({title,image:image||null,category:category|| 'uncategorized',content,userId});
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
    const postId = req.params.id;
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
        const postId = req.params.id;
        const {title,content,image,category} = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        if(!postId) return res.status(400).json({message: "postId required"});

        const postExist=  await Post.findById(postId);

        if (!postExist) return res.status(404).json({message: "No such post that exist in the database"})
        
            if(postExist.userId.toString()!== userId.toString()&& userRole!=='admin')return res.status(403),json({message: " you must be an admin"})
       
       
                post.content= content || post.content;
                post.title= title||user.title;
                post.image= image||post.image;
                post.category= category|| post.category;

          
                const updatedPost = await postExist.save();

        if(!updatedPost) return res.status(500).json("not updated");
        res.status(201).json({success: true, data: updatedPost});

            console.log("Updated successfully");
    } catch (error) {
        res.status(500).json({messsage:'Not able to update'});
        console.error('updating failed', error.message)
    }
}

exports.deleteOne= async(req, res) => {
    try {
        const postId = req.params.id;
        const userId= req.user._id;
        const userRole =req.user.role;

        if(!postId) return res.status(405).json({message: "input the postId"});

        const post= await Post.findById(postId);
        if(!post) return res.status(400).json({message:"post Not deleted"});
       

        if(post.userId.toString()!== userId.toString()&& userRole!=='admin') return res.status(403).json({message: "YUou unauthorized"})
            await post.deleteOne();
        res.status(200).json({message: "post deleted successfully"})
        console.log("post deleted")
    } catch (error) {
        res.status(500).json("not abble to delete")
        console.error("Not able to delete", error.message)
    }
}
