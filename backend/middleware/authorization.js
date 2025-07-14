const jwt= require('jsonwebtoken');
const User =require('../models/user.model');

//authorization

exports.protect = (req,res,next)=>{
   
    const auth = req.headers.authorization;
     if(!auth || !auth.startsWith("Bearer ")) return res.status(404).json({message:"You are not authorize"})
   const token=auth.split(' ')[1];
    if (!token) return res.status(401).json({message: 'Token required'})

        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
            next();
            console.log("token decoded")
        } catch (error) {
            res.status(403).json({message: "invalid token"})
            console.error('token required',error.message)
        }
}
// authorization
exports.authorization = (role)=>{
    return (req,res,next) =>{
        if (!role.includes(req.user.role)){
            return res.status(403).json({message:"Access denied"})
        }
        next();
    }
    
}