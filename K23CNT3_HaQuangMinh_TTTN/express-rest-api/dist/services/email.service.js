"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});
const sendVerificationEmail = async (email, name, token) => {
    const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email?token=${token}`;
    const mailOptions = {
        from: `"Auth Service" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Xác thực địa chỉ email",
        html: `
      <h2>Xin chào ${name},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm vào liên kết bên dưới để xác thực tài khoản của bạn:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>Hoặc nhập mã token xác thực: <b>${token}</b></p>
      <p>Liên kết sẽ hết hạn sau ${process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15} phút.</p>
    `,
    };
    return transporter.sendMail(mailOptions);
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    const mailOptions = {
        from: `"Auth Service" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Yêu cầu đặt lại mật khẩu",
        html: `
      <h2>Xin chào ${name},</h2>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng bấm vào liên kết bên dưới để tạo mật khẩu mới:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Hoặc nhập mã token reset: <b>${token}</b></p>
      <p>Liên kết sẽ hết hạn sau ${process.env.RESET_PASSWORD_EXPIRES_MINUTES || 15} phút.</p>
    `,
    };
    return transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
