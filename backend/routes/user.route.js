const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {getMe,updateProfile,deleteAccount,getAllUser,updateUserRole} = require('../controllers/user.controller');

router.get('/me',protect,getMe);
router.get('/All',protect,authorization(['admin']),getAllUser);
router.put('/role/:id',protect, authorization(['admin']),updateUserRole);
router.put('/user/:id',protect,updateProfile);
router.delete('/user/:id',protect,deleteAccount);
 module.exports= router;