import mongoose from "mongoose";
 const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        required: true,
        unique,
        trim: true
    },

    email:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },

    password:{
        type:String,
        required: true,
        trim: true
    },

    profilePicture:{
        type: String,
        type: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
 },{timestamps: true})

 const User = mongoose.model('User',userSchema);
 export default User;