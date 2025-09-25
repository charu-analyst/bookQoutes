import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const url=process.env.MONGO_URL


mongoose 
 .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
         })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));