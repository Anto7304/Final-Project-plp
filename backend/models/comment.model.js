const mongoose = require ('mongoose')

const commentSchema =   new mongoose.Schema({
    content: {
        type: String,
        rtequired: true
    },

    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required: true,
    },

    likes: {
        type: Array,
        default:[],
    } ,

    numberOfLikes:{
        type: Number,
        default: 0
    },

    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
},{timestamps: true});

const Comment= mongoose.model('Comment', commentSchema);
module.exports = Comment