"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../model/user.model"));
const jwt_1 = require("../utils/jwt");
const otp_1 = require("../utils/otp");
const email_service_1 = require("./email.service");
// ─── Helper: Validate email format ──────────────────────────
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// ─── Helper: Tạo custom error với statusCode ────────────────
const createError = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};
// ─── SIGNUP ─────────────────────────────────────────────────
const signup = async ({ name, email, password, }) => {
    // Validate input
    if (!name || !name.trim()) {
        throw createError("Trường 'name' là bắt buộc");
    }
    if (name.trim().length < 2 || name.trim().length > 100) {
        throw createError("Trường 'name' phải có độ dài từ 2 đến 100 ký tự");
    }
    if (!email || !email.trim()) {
        throw createError("Trường 'email' là bắt buộc");
    }
    if (!isValidEmail(email)) {
        throw createError("Định dạng email không hợp lệ");
    }
    if (!password || password.length < 8) {
        throw createError("Mật khẩu phải có ít nhất 8 ký tự");
    }
    if (password.length > 128) {
        throw createError("Mật khẩu không được vượt quá 128 ký tự");
    }
    email = email.toLowerCase().trim();
    const existedUser = await user_model_1.default.findOne({ email });
    if (existedUser) {
        throw createError("Email đã được đăng ký");
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const verifyToken = (0, otp_1.generateRandomToken)(32);
    const user = await user_model_1.default.create({
        name: name.trim(),
        email,
        password: passwordHash,
        emailVerifyToken: (0, otp_1.hashToken)(verifyToken),
        emailVerifyExpires: new Date(Date.now() +
            Number(process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15) *
                60 *
                1000),
    });
    try {
        await (0, email_service_1.sendVerificationEmail)(email, name.trim(), verifyToken);
    }
    catch (emailError) {
        console.warn("⚠️ Không thể gửi email qua Gmail SMTP:", emailError.message);
        console.log(`🔑 [DEV] Token xác thực của ${email}:`, verifyToken);
    }
    const result = {
        id: user._id,
        name: user.name,
        email: user.email,
    };
    // Chỉ trả verifyToken trong môi trường development để dễ test
    if (process.env.NODE_ENV === "development") {
        result.verifyToken = verifyToken;
    }
    return result;
};
// ─── VERIFY EMAIL ───────────────────────────────────────────
const verifyEmail = async (token) => {
    if (!token) {
        throw createError("Token xác thực là bắt buộc");
    }
    const tokenHash = (0, otp_1.hashToken)(token);
    const user = await user_model_1.default.findOne({
        emailVerifyToken: tokenHash,
        emailVerifyExpires: {
            $gt: new Date(),
        },
    }).select("+emailVerifyToken +emailVerifyExpires");
    if (!user) {
        throw createError("Token xác thực không hợp lệ hoặc đã hết hạn");
    }
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();
    return true;
};
// ─── SIGNIN ─────────────────────────────────────────────────
const signin = async ({ email, password, }) => {
    if (!email || !password) {
        throw createError("Email và mật khẩu là bắt buộc");
    }
    email = email.toLowerCase().trim();
    const user = await user_model_1.default.findOne({
        email,
    }).select("+password +refreshTokenHash");
    if (!user) {
        throw createError("Email hoặc mật khẩu không đúng", 401);
    }
    // Kiểm tra tài khoản có bị khoá không
    if (user.isActive === false) {
        throw createError("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ admin.", 403);
    }
    const passwordMatched = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatched) {
        throw createError("Email hoặc mật khẩu không đúng", 401);
    }
    if (!user.isEmailVerified && process.env.NODE_ENV === "production") {
        throw createError("Vui lòng xác thực email trước khi đăng nhập", 403);
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user);
    user.refreshTokenHash =
        await bcryptjs_1.default.hash(refreshToken, 12);
    user.lastLoginAt = new Date();
    await user.save();
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
// ─── REFRESH ACCESS TOKEN ───────────────────────────────────
const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw createError("Refresh token không tồn tại", 401);
    }
    let payload;
    try {
        payload =
            (0, jwt_1.verifyRefreshToken)(refreshToken);
    }
    catch {
        throw createError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
    }
    if (payload.type !== "refresh") {
        throw createError("Token không hợp lệ", 401);
    }
    const user = await user_model_1.default.findById(payload.sub).select("+refreshTokenHash");
    if (!user ||
        !user.refreshTokenHash) {
        throw createError("Refresh token không hợp lệ", 401);
    }
    // Kiểm tra tài khoản có bị khoá không
    if (user.isActive === false) {
        throw createError("Tài khoản của bạn đã bị khoá", 403);
    }
    const matched = await bcryptjs_1.default.compare(refreshToken, user.refreshTokenHash);
    if (!matched) {
        throw createError("Refresh token không hợp lệ", 401);
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user);
    const newRefreshToken = (0, jwt_1.generateRefreshToken)(user);
    user.refreshTokenHash =
        await bcryptjs_1.default.hash(newRefreshToken, 12);
    await user.save();
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};
// ─── FORGOT PASSWORD ────────────────────────────────────────
const forgotPassword = async (email) => {
    if (!email) {
        throw createError("Email là bắt buộc");
    }
    email = email.toLowerCase().trim();
    const user = await user_model_1.default.findOne({
        email,
    });
    /*
     Không nên báo email có tồn tại hay không
     để tránh email enumeration.
    */
    if (!user) {
        return true;
    }
    const token = (0, otp_1.generateRandomToken)(32);
    user.passwordResetTokenHash =
        (0, otp_1.hashToken)(token);
    user.passwordResetExpires =
        new Date(Date.now() +
            Number(process.env.RESET_PASSWORD_EXPIRES_MINUTES || 15) *
                60 *
                1000);
    await user.save();
    try {
        await (0, email_service_1.sendPasswordResetEmail)(user.email, user.name, token);
    }
    catch (emailError) {
        console.warn("⚠️ Không thể gửi email qua Gmail SMTP:", emailError.message);
        console.log(`🔑 [DEV] Token reset mật khẩu của ${user.email}:`, token);
    }
    return true;
};
// ─── VERIFY FORGOT PASSWORD ────────────────────────────────
const verifyForgotPassword = async (token) => {
    if (!token) {
        throw createError("Token là bắt buộc");
    }
    const tokenHash = (0, otp_1.hashToken)(token);
    const user = await user_model_1.default.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: {
            $gt: new Date(),
        },
    }).select("+passwordResetTokenHash +passwordResetExpires");
    if (!user) {
        throw createError("Token reset password không hợp lệ hoặc đã hết hạn");
    }
    return {
        valid: true,
    };
};
// ─── RESET PASSWORD ─────────────────────────────────────────
const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw createError("Token và mật khẩu mới là bắt buộc");
    }
    if (newPassword.length < 8) {
        throw createError("Mật khẩu mới phải có ít nhất 8 ký tự");
    }
    const tokenHash = (0, otp_1.hashToken)(token);
    const user = await user_model_1.default.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: {
            $gt: new Date(),
        },
    }).select("+passwordResetTokenHash +passwordResetExpires +refreshTokenHash");
    if (!user) {
        throw createError("Token reset password không hợp lệ hoặc đã hết hạn");
    }
    user.password =
        await bcryptjs_1.default.hash(newPassword, 12);
    user.passwordResetTokenHash =
        undefined;
    user.passwordResetExpires =
        undefined;
    /*
     Đăng xuất tất cả session
     sau khi đổi password.
    */
    user.refreshTokenHash =
        undefined;
    await user.save();
    return true;
};
// ─── CHANGE PASSWORD (user đã đăng nhập) ───────────────────
const changePassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw createError("Mật khẩu hiện tại và mật khẩu mới là bắt buộc");
    }
    if (newPassword.length < 8) {
        throw createError("Mật khẩu mới phải có ít nhất 8 ký tự");
    }
    if (newPassword.length > 128) {
        throw createError("Mật khẩu mới không được vượt quá 128 ký tự");
    }
    if (currentPassword === newPassword) {
        throw createError("Mật khẩu mới phải khác mật khẩu hiện tại");
    }
    const user = await user_model_1.default.findById(userId)
        .select("+password +refreshTokenHash");
    if (!user) {
        throw createError("User không tồn tại", 404);
    }
    const passwordMatched = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!passwordMatched) {
        throw createError("Mật khẩu hiện tại không đúng", 401);
    }
    user.password = await bcryptjs_1.default.hash(newPassword, 12);
    // Đăng xuất tất cả session sau khi đổi password
    user.refreshTokenHash = undefined;
    await user.save();
    return true;
};
// ─── SIGNOUT ────────────────────────────────────────────────
const signout = async (userId) => {
    await user_model_1.default.findByIdAndUpdate(userId, {
        $unset: {
            refreshTokenHash: 1,
        },
    });
    return true;
};
exports.default = {
    signup,
    verifyEmail,
    signin,
    refreshAccessToken,
    forgotPassword,
    verifyForgotPassword,
    resetPassword,
    changePassword,
    signout,
};
