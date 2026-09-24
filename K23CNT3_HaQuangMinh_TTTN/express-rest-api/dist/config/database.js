"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("../utils/seed");
const connectDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/express_demo";
        await mongoose_1.default.connect(uri);
        console.log("MongoDB connected successfully");
        await (0, seed_1.seedDefaultData)();
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};
exports.default = connectDatabase;
