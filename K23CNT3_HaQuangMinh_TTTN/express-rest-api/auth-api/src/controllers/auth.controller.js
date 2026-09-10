const authService =
  require("../services/auth.service");

const signup = async (req, res, next) => {
  try {
    const result =
      await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (
  req,
  res,
  next
) => {
  try {
    await authService.verifyEmail(
      req.body.token
    );

    res.json({
      success: true,
      message:
        "Email đã được xác thực",
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.signin(req.body);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.refreshAccessToken(
        req.body.refreshToken
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    await authService.forgotPassword(
      req.body.email
    );

    res.json({
      success: true,
      message:
        "Nếu email tồn tại, hệ thống đã gửi hướng dẫn reset password.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyForgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.verifyForgotPassword(
        req.body.token
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
/* resetpassword */
const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    await authService.resetPassword(
      req.body.token,
      req.body.newPassword
    );

    res.json({
      success: true,
      message:
        "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};
/* signout */
const signout = async (
  req,
  res,
  next
) => {
  try {
    await authService.signout(
      req.user.sub
    );

    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  signin,
  refreshToken,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  signout,
};


