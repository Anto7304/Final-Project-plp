const express = require('express');
const User = require('../models/user.model'); 

exports.getMe = async (req, res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(404).json({message: "User not found"})

            res.status(200).json({message: user});
            console.log("user found")
    } catch (error) {
        res.status(500).json('cannot find user');
        console.error("cannot fing a user",error)
    }
}

exports.updateProfile = async (req, res)=>{
    try {
        const {userName, email, profilePicture} = req.body;
        userId= req.use.id;

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message:"No such profile like that"})

        if (email && email !== user.email){
            const exist = await User.findOne({email});
            if (exist)  return res.status(400).json({message:"email already in use"})
        }

        if (userName && userName !== user.user.userName){
            const exist = await User.findOne({userName});
            if (exist)  return res.status(406).json({message:"userName already in use"})
        }

        // updating the fields
        user.userName = userName || user.userName
        user.email = email || user.email;
        user.profilePicture= profilePicture || user.profilePicture;

        const updatedUser = await user.save();

        updatedUser.password = undefined;// to prevent the password to appear in response

        res.status(201).json({success: true, message:updatedUser});
        console.log("User updated profile")
    } catch (error) {
        res.status(401).json({message: "cannot update profile"});
        console.error("user not updated",error.message)
    }
}

exports.deleteAccount = async (req, res) =>{
    try {
        const userId = req.user.id; 
         const user= await User.findById(userId);

         if (!user) return res.status(404).json({message:"User not found"});
        
         await user.deleteOne();
         res.status(200).json({message: "User deleted"})
    } catch (error) {
        res.status(406).json("cannot delete")
    }
}

exports.getAllUser= async (req,res)=>{
    try {
        if(req.user.role !=='admin') return res.status(401).json({message:"you are not Admin"});

        const users = await User.find().select('-password')
        res.status(200).json({success: true, message:users, count: users.length})
    } catch (error) {
        res.status(401).json({message:"you must be an admin to view all users"})
    }
}

exports.updateUserRole = async(req,res)=>{
    try {
        const {id}= req.params;
        const{role} = req.body;
    
        if (!role || !['user', 'admin'].includes(role)) return res.status(401).json({message: "Valid role is required"})
             if (req.user.role !== 'admin') return res.status(401).json({message:"you must be an asmin to update roles"});

        const user = await User.findByIdAndUpdate(id,{role},{new: true, runValidators:true}).select('-password');

        if (!user) return res.status(404).json({message: "User not found"})
            res.status(200).json({message: user})
    } catch (error) {
        res.status(500).json({message: "cannot update"})
    }
}