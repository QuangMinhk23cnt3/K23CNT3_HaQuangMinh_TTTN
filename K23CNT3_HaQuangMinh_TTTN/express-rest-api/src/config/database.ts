import mongoose from "mongoose";
import User from "../model/user.model";
import bcrypt from "bcryptjs";

const seedDefaultData = async () => {
    try {
        const demoEmail = "minh.hq@k23cnt3.edu.vn";
        const existedUser = await User.findOne({ email: demoEmail });

        if (!existedUser) {
            const passwordHash = await bcrypt.hash("12345678", 12);
            await User.create({
                name: "Hà Quang Minh",
                email: demoEmail,
                password: passwordHash,
                role: "admin",
                isActive: true,
                isEmailVerified: true,
            });
            console.log(`✅ [Seed] Đã tự động tạo tài khoản sinh viên: ${demoEmail} (mật khẩu: 12345678)`);
        }
    } catch (error: any) {
        console.warn("⚠️ [Seed] Bỏ qua seed dữ liệu:", error.message);
    }
};

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
