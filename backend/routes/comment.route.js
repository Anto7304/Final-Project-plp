const express = require('express');
const router = express.Router();
const {protect, authorization} = require('../middleware/authorization')
const {createComment,getComments,updateComment,deleteComment,toggleLike } = require('../controllers/comment.controller')


router.post('/comments',protect,createComment);
router.get('/comments',protect,getComments);
router.put('/comments/:id',protect,updateComment);
router.delete('/comments/:id',protect,deleteComment);

router.patch('/:id/toggle-like', toggleLike);


module.exports= router;