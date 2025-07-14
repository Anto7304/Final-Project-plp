const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        required: true,
        unique: true,
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
        
    },

   role: {
    type: String,
    enum: ['user','admin'],
    default: 'user'
   }
 },{timestamps: true})

 const User = mongoose.model('User', userSchema);

 module.exports = User;