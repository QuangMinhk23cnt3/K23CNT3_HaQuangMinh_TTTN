"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedDefaultData = async () => {
    try {
        const demoEmail = "minh.hq@k23cnt3.edu.vn";
        const existedUser = await user_model_1.default.findOne({ email: demoEmail });
        if (!existedUser) {
            const passwordHash = await bcryptjs_1.default.hash("12345678", 12);
            await user_model_1.default.create({
                name: "Hà Quang Minh",
                email: demoEmail,
                password: passwordHash,
                role: "admin",
                isActive: true,
                isEmailVerified: true,
            });
            console.log(`✅ [Seed] Đã tự động tạo tài khoản sinh viên: ${demoEmail} (mật khẩu: 12345678)`);
        }
    }
    catch (error) {
        console.warn("⚠️ [Seed] Bỏ qua seed dữ liệu:", error.message);
    }
};
const connectDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/express_demo";
        await mongoose_1.default.connect(uri);
        console.log("MongoDB connected successfully");
        await seedDefaultData();
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};
exports.default = connectDatabase;
