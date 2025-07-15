const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {deleteOne, updated, getAll,getOne,createPost}= require('../controllers/post.controller')

router.post('/posts',protect,authorization(['admin']),createPost);
router.get('/posts',protect,getAll);
router.get('/posts/:id',protect,getOne);
router.put('/posts/:id',protect,authorization(['admin']),updated);
router.delete('/posts/:id',protect,authorization(['admin']),deleteOne);

module.exports= router;