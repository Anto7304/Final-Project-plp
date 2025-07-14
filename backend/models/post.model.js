import mongoose from "mongoose";

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
    },

    slug: {
        tyupe: String,
        required: true,
        unique: true
    }
},{timestamps: true});

const Post = mongoose.model('Post', postSchema);
export default Post;