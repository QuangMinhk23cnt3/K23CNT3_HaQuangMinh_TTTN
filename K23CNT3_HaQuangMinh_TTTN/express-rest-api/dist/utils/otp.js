"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateOTP = exports.generateRandomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomToken = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString("hex");
};
exports.generateRandomToken = generateRandomToken;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const hashToken = (token) => {
    return crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
};
exports.hashToken = hashToken;
