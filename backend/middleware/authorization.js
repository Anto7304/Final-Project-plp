const jwt= require('jsonwebtoken');
const User =require('../models/user.model');
const { logger } = require('../utils/logger'); // Use destructuring for logger

// Protect middleware: verifies JWT and attaches user to req
exports.protect = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        logger.info('Authorization header missing or malformed');
        return res.status(401).json({ success: false, message: "You are not authorized" });
    }
    const token = auth.split(' ')[1];
    if (!token) {
        logger.info('Token missing from authorization header');
        return res.status(401).json({ success: false, message: 'Token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        logger.info(`Token decoded for user: ${decoded.id}`);
        next();
    } catch (error) {
        logger.info(`Invalid token: ${error.message}`);
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
}

// Authorization middleware: checks user role
exports.authorization = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.info(`Access denied for user: ${req.user.id}, role: ${req.user.role}`);
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        next();
    }
}