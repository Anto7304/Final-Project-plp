const mongoose= require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },

    title: {
        type: String,
        requied: true,
        trim:  true,
        unique: true
    },

    image: {
        type: String,
        
    },

    category: {
        type: String,
        default:  'uncategorized'
    }


},{timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;