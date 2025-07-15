const express = require('express');
const router = express.Router();
const {signUp,login} = require('../controllers/auth.controller')
const {protect, authorization} = require('../middleware/authorization')

router.post('/signup',signUp);
router.get('/login',login);

module.exports=router;