const express = require('express');
const User = require('../models/user.model')
const bcryptjs = require ('bcryptjs')
const jwt = require('jsonwebtoken');
app.use(express.json());

exports.signUp = async(req, res)=>{
    try {
        const {email, password, userName,profilePicture} = req.body;
        if(!email || !password || !userName || userName===(' ')|| password=== (' ')|| email===(' ')||!profilePicture){
            return res.json({message:"Password, email,userName and profilePicture required"})
        }
    const nameExist = await User.findOne({userName})
    if (nameExist) return res.json({message:'Username exist'});

    const userExist = await User.findOne({email})
     if (userExist) {
        return res.json({message:"user exist"})
     }
    const hash =await bcryptjs.hash(password, 15);

    const user = await User.create({email,userName,password: hash,profilePicture})
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '1h'})
        res.json({token})
        console.log("User registered")
    } catch (error) {
        res.status(500).json({message:"Server error"})
        console.error("user not signup ", error.message)
    }
}

exports.login = async(req, res)=>{
    try {
        const {email,password} = req.body;
        if(!email|| !password || email===(' ')|| password===(' ')) return res.json("Wrong credentials")

        const user = await User.findOne({email});

        if (!user) return res.status(404).json({message:"User not found"})

        const isMatch =await bcryptjs.compare(password, user.password);

        if (!isMatch) return res.status(403).json({message: "Wrong password"});

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '1h'})
        res.json({token})
        console.log("Login successfully")
        
    } catch (error) {
        res.status(500).json({message:"login failed"})
        console.error("not login:",error.message);
    }
}