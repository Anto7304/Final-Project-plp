const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error("Mondodb not connected",error.message);
        process.exit(1);
        
    }
}

module.exports= connectDB;