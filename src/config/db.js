import mongoose from "mongoose";
import dotenv from "dotenv"
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;