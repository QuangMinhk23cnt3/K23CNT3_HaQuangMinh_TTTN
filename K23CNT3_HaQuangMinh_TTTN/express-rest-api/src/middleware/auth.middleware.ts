import { verifyAccessToken } from "../utils/jwt";

/**
 * Middleware: Trạm gác bảo vệ các API riêng tư (yêu cầu đăng nhập)
 * Bất kỳ request nào đi qua đây đều bị kiểm tra xem có "thẻ căn cước" (Access Token) hợp lệ không.
 */
const authMiddleware = (req: any, res: any, next: any) => {
  try {
    // 1. Tìm "thẻ căn cước" trong header Authorization
    const authHeader = req.headers.authorization;

    // 2. Nếu không có header này, hoặc header không bắt đầu bằng chữ "Bearer " (chuẩn OAuth2) thì chặn lại
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token không được cung cấp hoặc không hợp lệ",
      });
    }

    // 3. Tách lấy phần chữ cái lằng ngoằng của token (bỏ chữ Bearer đi)
    const token = authHeader.split(" ")[1];
    
    // 4. Giải mã và kiểm tra chữ ký (signature) của token xem có đúng do server của mình cấp không
    const decoded = verifyAccessToken(token) as any;

    // 5. Đảm bảo token này là Access Token (chứ không phải Refresh Token mang đi xài bậy)
    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    // 6. Lưu tạm thông tin giải mã được (chứa ID người dùng) vào biến req.user
    // Các controller phía sau (như task.controller) sẽ dùng req.user này để biết "ai đang gọi API"
    req.user = decoded;
    
    // 7. Cho phép đi tiếp vào Controller
    next();
  } catch (error: any) {
    // Nếu token bị chỉnh sửa bậy, hoặc hết hạn 15 phút, hàm verifyAccessToken sẽ văng lỗi (throw error).
    // Catch sẽ bắt lấy lỗi đó và đuổi khách về.
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

export default authMiddleware;
