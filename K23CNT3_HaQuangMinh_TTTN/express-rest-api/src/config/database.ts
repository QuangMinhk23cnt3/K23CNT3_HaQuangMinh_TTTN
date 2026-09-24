import mongoose from "mongoose";
import { seedDefaultData } from "../utils/seed";

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/express_demo";
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
        await seedDefaultData();
    } catch (error: any) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDatabase;