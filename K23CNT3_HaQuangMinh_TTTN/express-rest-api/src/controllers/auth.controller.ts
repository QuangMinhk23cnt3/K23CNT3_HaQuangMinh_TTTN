import authService from "../services/auth.service";

/**
 * Controller xử lý đăng ký tài khoản mới (Signup)
 * 
 * @param req Request từ client (chứa body gồm name, email, password)
 * @param res Response trả về cho client
 * @param next Middleware tiếp theo (dùng để chuyển lỗi cho Global Error Handler)
 */
export const signup = async (req: any, res: any, next: any) => {
  try {
    // Gọi tầng service để xử lý logic nghiệp vụ đăng ký (lưu DB, mã hóa password, gửi email...)
    const result = await authService.signup(req.body);

    // Trả về mã trạng thái 201 (Created) và dữ liệu khi đăng ký thành công
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công. Vui lòng kiểm tra email.",
      data: result,
    });
  } catch (error) {
    // Nếu có lỗi (email trùng, mật khẩu yếu...), ném lỗi sang hàm xử lý lỗi chung (error.middleware)
    next(error);
  }
};

/**
 * Controller xử lý xác thực email
 * 
 * @param req Request chứa token xác thực trong req.body.token
 */
export const verifyEmail = async (req: any, res: any, next: any) => {
  try {
    // Chuyển token từ body xuống service để đối chiếu với database
    await authService.verifyEmail(req.body.token);

    res.json({
      success: true,
      message: "Email đã được xác thực",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xử lý đăng nhập (Signin)
 * Trả về Access Token và Refresh Token để duy trì phiên đăng nhập.
 */
export const signin = async (req: any, res: any, next: any) => {
  try {
    // Service sẽ kiểm tra mật khẩu, tạo JWT tokens và trả về
    const result = await authService.signin(req.body);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (error) {
    // Bắt lỗi như "Sai mật khẩu", "Tài khoản bị khóa"
    next(error);
  }
};

/**
 * Controller xử lý việc cấp lại Access Token mới (khi token cũ hết hạn 15 phút)
 * Người dùng gửi lên Refresh Token để lấy lại Access Token mà không cần đăng nhập lại.
 */
export const refreshToken = async (req: any, res: any, next: any) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);

    res.json({
      success: true,
      data: result, // Chứa new Access Token và new Refresh Token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xử lý yêu cầu Quên mật khẩu
 * Sẽ sinh ra token reset và gửi vào email của người dùng.
 */
export const forgotPassword = async (req: any, res: any, next: any) => {
  try {
    await authService.forgotPassword(req.body.email);

    // Trả về thông báo chung chung bảo mật để hacker không biết email có tồn tại thật không
    res.json({
      success: true,
      message: "Nếu email tồn tại, hệ thống đã gửi hướng dẫn reset password.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller kiểm tra xem token quên mật khẩu có hợp lệ / hết hạn chưa
 */
export const verifyForgotPassword = async (req: any, res: any, next: any) => {
  try {
    const result = await authService.verifyForgotPassword(req.body.token);

    res.json({
      success: true,
      data: result, // Trả về hợp lệ (valid: true) để frontend chuyển sang màn hình nhập mật khẩu mới
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xử lý Đặt lại mật khẩu mới (Reset Password)
 * Sau khi người dùng đã verify token từ email và nhập mật khẩu mới.
 */
export const resetPassword = async (req: any, res: any, next: any) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xử lý Đăng xuất (Signout)
 * Xóa bỏ refresh token khỏi cơ sở dữ liệu để token đó không còn hiệu lực.
 */
export const signout = async (req: any, res: any, next: any) => {
  try {
    // req.user.sub lấy từ authMiddleware (chứa ID của user đang đăng nhập)
    await authService.signout(req.user.sub);

    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xử lý Đổi mật khẩu (dành cho người dùng đã đăng nhập)
 */
export const changePassword = async (req: any, res: any, next: any) => {
  try {
    // Cần truyền ID user, mật khẩu cũ và mật khẩu mới xuống tầng service
    await authService.changePassword(
      req.user.sub,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    next(error);
  }
};
