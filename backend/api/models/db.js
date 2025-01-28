import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected");
    } catch (err) {
        console.log(err);
        console.log("db not connected");
    }
};