const express = require('express');
const User = require('../models/user.model')
const bcryptjs = require ('bcryptjs')
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger'); // Use destructuring for logger

exports.signUp = async(req, res)=>{
    try {
        const {email, password, userName,profilePicture} = req.body;
        if(!email?.trim() || !password?.trim() || !userName?.trim() || userName===(' ')|| password=== (' ')|| email===(' ')||!profilePicture){
            return res.status(400).json({ success: false, message: "Password, email, userName and profilePicture required" });
        }
        const nameExist = await User.findOne({userName})
        if (nameExist) return res.status(409).json({ success: false, message: 'Username exists' });

        const userExist = await User.findOne({email})
        if (userExist) {
            return res.status(409).json({ success: false, message: "User exists" });
        }
        const hash =await bcryptjs.hash(password, 15);

        const user = await User.create({
            email: email.trim().toLowerCase(),
            userName:userName.trim(),
            password: hash,
            profilePicture:profilePicture||null
        })
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )

        const userResponse={
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePicture: user.profilePicture,
            role: user.role
        }

        res.status(201).json({
            success:true,
            token,
            user: userResponse
        })
        logger.info(`User registered: ${user.email}`);
    } catch (error) {
        logger.error(`User signup failed: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.login = async(req, res)=>{
    try {
        const {email,password} = req.body;
        if(!email?.trim()|| !password?.trim()|| email===(' ')|| password===(' ')) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({email:email.trim().toLowerCase()}).select('+password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, message: "Your account is suspended. Please contact support." });
        }

        const isMatch =await bcryptjs.compare(password, user.password);

        if (!isMatch) return res.status(403).json({ success: false, message: "Wrong password" });

        const token = jwt.sign({id: user._id, role: user.role},process.env.JWT_SECRET,{expiresIn: '1h'})
        const userResponse={
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePicture: user.profilePicture,
            role: user.role
        }

        res.status(200).json({
            success:true,
            token,
            user: userResponse
        })
        logger.info(`User logged in: ${user.email}`);
    } catch (error) {
        logger.error(`Login failed: ${error.message}`);
        res.status(500).json({ success: false, message: "Login failed" });
    }
}