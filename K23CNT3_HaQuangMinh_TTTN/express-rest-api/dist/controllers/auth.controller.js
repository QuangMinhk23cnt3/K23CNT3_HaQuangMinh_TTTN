"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.signout = exports.resetPassword = exports.verifyForgotPassword = exports.forgotPassword = exports.refreshToken = exports.signin = exports.verifyEmail = exports.signup = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const signup = async (req, res, next) => {
    try {
        const result = await auth_service_1.default.signup(req.body);
        res.status(201).json({
            success: true,
            message: "Đăng ký thành công. Vui lòng kiểm tra email.",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const verifyEmail = async (req, res, next) => {
    try {
        await auth_service_1.default.verifyEmail(req.body.token);
        res.json({
            success: true,
            message: "Email đã được xác thực",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
const signin = async (req, res, next) => {
    try {
        const result = await auth_service_1.default.signin(req.body);
        res.json({
            success: true,
            message: "Đăng nhập thành công",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signin = signin;
const refreshToken = async (req, res, next) => {
    try {
        const result = await auth_service_1.default.refreshAccessToken(req.body.refreshToken);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res, next) => {
    try {
        await auth_service_1.default.forgotPassword(req.body.email);
        res.json({
            success: true,
            message: "Nếu email tồn tại, hệ thống đã gửi hướng dẫn reset password.",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const verifyForgotPassword = async (req, res, next) => {
    try {
        const result = await auth_service_1.default.verifyForgotPassword(req.body.token);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyForgotPassword = verifyForgotPassword;
/* resetpassword */
const resetPassword = async (req, res, next) => {
    try {
        await auth_service_1.default.resetPassword(req.body.token, req.body.newPassword);
        res.json({
            success: true,
            message: "Đặt lại mật khẩu thành công",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
/* signout */
const signout = async (req, res, next) => {
    try {
        await auth_service_1.default.signout(req.user.sub);
        res.json({
            success: true,
            message: "Đăng xuất thành công",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signout = signout;
/* changePassword */
const changePassword = async (req, res, next) => {
    try {
        await auth_service_1.default.changePassword(req.user.sub, req.body.currentPassword, req.body.newPassword);
        res.json({
            success: true,
            message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
