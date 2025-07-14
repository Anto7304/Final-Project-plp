const express = requuire('express');
const router = express.Router();
const {register,login} = require('../controllers/auth.controller')
const {protect, authorization} = require('../controllers/authorization')

