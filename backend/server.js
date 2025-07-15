const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.route');
const commentRoutes= require('./routes/comment.route');
const postRoutes =require('./routes/post.route')
const userRoutes = require('./routes/user.route');


dotenv.config()
const app = express();

connectDB();
app.use(express.json());
app.use(cors({
    origin:'',
    methogs:['put', 'get','delete','post'],
    credentials: true,
}));


app.use('/api',authRoutes);
app.use('/api',commentRoutes)
app.use('/api',postRoutes)
app.use('/api',userRoutes)


app.listen(process.env.PORT,
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
)