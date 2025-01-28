import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully!");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        console.log("db not connected");
    }
};
