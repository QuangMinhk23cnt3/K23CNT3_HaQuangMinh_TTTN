/**
 * Middleware kiểm tra quyền truy cập dựa trên role.
 *
 * Sử dụng SAU authMiddleware.
 *
 * @example
 *   router.get("/admin-only", authMiddleware, authorize("admin"), handler);
 *   router.get("/multi-role", authMiddleware, authorize("admin", "manager"), handler);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập. Yêu cầu role: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

export default authorize;
