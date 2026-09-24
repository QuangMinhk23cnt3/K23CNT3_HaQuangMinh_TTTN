"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Tên là bắt buộc"],
        trim: true,
        minlength: [2, "Tên phải có ít nhất 2 ký tự"],
        maxlength: [100, "Tên không được vượt quá 100 ký tự"],
    },
    email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Định dạng email không hợp lệ",
        ],
    },
    password: {
        type: String,
        required: [true, "Mật khẩu là bắt buộc"],
        minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
        select: false,
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin", "sales", "teacher", "manager", "accountant"],
            message: "Role '{VALUE}' không hợp lệ",
        },
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifyToken: {
        type: String,
        select: false,
    },
    emailVerifyExpires: {
        type: Date,
        select: false,
    },
    refreshTokenHash: {
        type: String,
        select: false,
    },
    passwordResetTokenHash: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    lastLoginAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
