const express = require('express');
const User = require('../models/user.model'); 
const { logger, auditLogger } = require('../utils/logger'); // Use auditLogger for sensitive actions
const bcryptjs = require('bcryptjs');

exports.getMe = async (req, res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        res.status(200).json({ success: true, message: user });
        logger.info(`User profile fetched: ${user.email}`);
    } catch (error) {
        logger.error(`Cannot find user: ${error.message}`);
        res.status(500).json({ success: false, message: 'Cannot find user' });
    }
}

exports.updateProfile = async (req, res)=>{
    try {
        const {userName, email, profilePicture} = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ success: false, message: "No such profile like that" })

        if (email && email !== user.email){
            const exist = await User.findOne({email});
            if (exist)  return res.status(409).json({ success: false, message: "Email already in use" })
        }

        if (userName && userName !== user.userName){
            const exist = await User.findOne({userName});
            if (exist)  return res.status(409).json({ success: false, message: "Username already in use" })
        }

        // updating the fields
        user.userName = userName || user.userName
        user.email = email || user.email;
        user.profilePicture= profilePicture || user.profilePicture;

        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.status(200).json({ success: true, user: updatedUser });
        logger.info(`User updated profile: ${user.email}`);
        auditLogger.info({ action: 'updateProfile', userId: userId, updatedFields: { userName, email, profilePicture } });
    } catch (error) {
        logger.error(`User not updated: ${error.message}`);
        res.status(500).json({ success: false, message: "Cannot update profile" });
    }
}

exports.deleteAccount = async (req, res) =>{
    try {
        const userId = req.user.id; 
        const user= await User.findById(userId);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted" })
        logger.info(`User deleted: ${user.email}`);
        auditLogger.info({ action: 'deleteAccount', userId });
    } catch (error) {
        logger.error(`Cannot delete user: ${error.message}`);
        res.status(500).json({ success: false, message: "Cannot delete user" });
    }
}

exports.getAllUser= async (req,res)=>{
    try {
        if(req.user.role !=='admin') return res.status(403).json({ success: false, message: "You are not Admin" });

        const users = await User.find().select('-password')
        res.status(200).json({ success: true, message: users, count: users.length })
        logger.info(`All users fetched by admin: ${req.user.id}`);
        auditLogger.info({ action: 'getAllUser', adminId: req.user.id });
    } catch (error) {
        logger.error(`Admin failed to fetch users: ${error.message}`);
        res.status(500).json({ success: false, message: "You must be an admin to view all users" })
    }
}

exports.updateUserRole = async(req,res)=>{
    try {
        const {id}= req.params;
        const{role} = req.body;
    
        if (!role || !['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: "Valid role is required" })
        if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: "You must be an admin to update roles" });

        const user = await User.findByIdAndUpdate(id,{role},{new: true, runValidators:true}).select('-password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" })
        res.status(200).json({ success: true, user })
        logger.info(`User role updated: ${user.email} to ${role}`);
        auditLogger.info({ action: 'updateUserRole', adminId: req.user.id, targetUserId: id, newRole: role });
    } catch (error) {
        logger.error(`Cannot update user role: ${error.message}`);
        res.status(500).json({ success: false, message: "Cannot update user role" })
    }
}

exports.updateUserStatus = async(req,res)=>{
    try {
        const {id}= req.params;
        const{status} = req.body;
    
        if (!status || !['active', 'suspended'].includes(status)) return res.status(400).json({ success: false, message: "Valid status is required" })
        if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: "You must be an admin to update status" });

        const user = await User.findByIdAndUpdate(id,{status},{new: true, runValidators:true}).select('-password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" })
        res.status(200).json({ success: true, user })
        logger.info(`User status updated: ${user.email} to ${status}`);
        auditLogger.info({ action: 'updateUserStatus', adminId: req.user.id, targetUserId: id, newStatus: status });
    } catch (error) {
        logger.error(`Cannot update user status: ${error.message}`);
        res.status(500).json({ success: false, message: "Cannot update user status" })
    }
}

exports.resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: "You must be an admin to reset passwords" });
        const hash = await bcryptjs.hash(password, 15);
        const user = await User.findByIdAndUpdate(id, { password: hash }, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user });
        logger.info(`User password reset: ${user.email}`);
        auditLogger.info({ action: 'resetUserPassword', adminId: req.user.id, targetUserId: id });
    } catch (error) {
        logger.error(`Cannot reset user password: ${error.message}`);
        res.status(500).json({ success: false, message: "Cannot reset user password" });
    }
}