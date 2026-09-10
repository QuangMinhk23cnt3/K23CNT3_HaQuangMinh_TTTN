const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const {
  generateRandomToken,
  hashToken,
} = require("../utils/otp");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./email.service");

const signup = async ({
  name,
  email,
  password,
}) => {
  email = email.toLowerCase().trim();

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new Error("Email đã được đăng ký");
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const verifyToken =
    generateRandomToken(32);

  const user = await User.create({
    name,
    email,
    password: passwordHash,

    emailVerifyToken:
      hashToken(verifyToken),

    emailVerifyExpires:
      new Date(
        Date.now() +
        Number(
          process.env.EMAIL_VERIFY_EXPIRES_MINUTES || 15
        ) *
        60 *
        1000
      ),
  });

  try {
    await sendVerificationEmail(
      email,
      name,
      verifyToken
    );
  } catch (emailError) {
    console.warn("⚠️ Không thể gửi email qua Gmail SMTP:", emailError.message);
    console.log(`🔑 [DEV] Token xác thực của ${email}:`, verifyToken);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verifyToken, // Trả về để dễ dàng copy test verify-email
  };
};

const verifyEmail = async (token) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    emailVerifyToken: tokenHash,

    emailVerifyExpires: {
      $gt: new Date(),
    },
  }).select(
    "+emailVerifyToken +emailVerifyExpires"
  );

  if (!user) {
    throw new Error(
      "Token xác thực không hợp lệ hoặc đã hết hạn"
    );
  }

  user.isEmailVerified = true;

  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;

  await user.save();

  return true;
};

const signin = async ({
  email,
  password,
}) => {
  email = email.toLowerCase().trim();

  const user = await User.findOne({
    email,
  }).select(
    "+password +refreshTokenHash"
  );

  if (!user) {
    throw new Error(
      "Email hoặc mật khẩu không đúng"
    );
  }

  const passwordMatched =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatched) {
    throw new Error(
      "Email hoặc mật khẩu không đúng"
    );
  }

  if (!user.isEmailVerified) {
    throw new Error(
      "Vui lòng xác thực email trước khi đăng nhập"
    );
  }

  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);

  user.refreshTokenHash =
    await bcrypt.hash(refreshToken, 12);

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

const refreshAccessToken = async (
  refreshToken
) => {
  if (!refreshToken) {
    throw new Error(
      "Refresh token không tồn tại"
    );
  }

  let payload;

  try {
    payload =
      verifyRefreshToken(refreshToken);
  } catch {
    throw new Error(
      "Refresh token không hợp lệ hoặc đã hết hạn"
    );
  }

  if (payload.type !== "refresh") {
    throw new Error("Token không hợp lệ");
  }

  const user = await User.findById(
    payload.sub
  ).select("+refreshTokenHash");

  if (
    !user ||
    !user.refreshTokenHash
  ) {
    throw new Error(
      "Refresh token không hợp lệ"
    );
  }

  const matched =
    await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );

  if (!matched) {
    throw new Error(
      "Refresh token không hợp lệ"
    );
  }

  const accessToken =
    generateAccessToken(user);

  const newRefreshToken =
    generateRefreshToken(user);

  user.refreshTokenHash =
    await bcrypt.hash(
      newRefreshToken,
      12
    );

  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const forgotPassword = async (
  email
) => {
  email = email.toLowerCase().trim();

  const user = await User.findOne({
    email,
  });

  /*
   Không nên báo email có tồn tại hay không
   để tránh email enumeration.
  */

  if (!user) {
    return true;
  }

  const token =
    generateRandomToken(32);

  user.passwordResetTokenHash =
    hashToken(token);

  user.passwordResetExpires =
    new Date(
      Date.now() +
      Number(
        process.env.RESET_PASSWORD_EXPIRES_MINUTES || 15
      ) *
      60 *
      1000
    );

  await user.save();

  try {
    await sendPasswordResetEmail(
      user.email,
      user.name,
      token
    );
  } catch (emailError) {
    console.warn("⚠️ Không thể gửi email qua Gmail SMTP:", emailError.message);
    console.log(`🔑 [DEV] Token reset mật khẩu của ${user.email}:`, token);
  }

  return true;
};

const verifyForgotPassword = async (
  token
) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,

    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select(
    "+passwordResetTokenHash +passwordResetExpires"
  );

  if (!user) {
    throw new Error(
      "Token reset password không hợp lệ hoặc đã hết hạn"
    );
  }

  return {
    valid: true,
  };
};

const resetPassword = async (
  token,
  newPassword
) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,

    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select(
    "+passwordResetTokenHash +passwordResetExpires +refreshTokenHash"
  );

  if (!user) {
    throw new Error(
      "Token reset password không hợp lệ hoặc đã hết hạn"
    );
  }

  user.password =
    await bcrypt.hash(
      newPassword,
      12
    );

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

const signout = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshTokenHash: 1,
      },
    }
  );

  return true;
};

module.exports = {
  signup,
  verifyEmail,
  signin,
  refreshAccessToken,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  signout,
};
