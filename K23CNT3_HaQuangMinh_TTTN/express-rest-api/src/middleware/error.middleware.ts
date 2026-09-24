const errorMiddleware = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  // Xác định status code từ error object hoặc mặc định
  let statusCode = err.statusCode || 500;
  let message = err.message || "Có lỗi xảy ra";

  // ─── Mongoose Validation Error ────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map(
      (e: any) => e.message
    );
    message = messages.join(". ");
  }

  // ─── Mongoose Cast Error (Invalid ObjectId) ───────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Giá trị '${err.value}' không hợp lệ cho trường '${err.path}'`;
  }

  // ─── Mongoose Duplicate Key Error ─────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Giá trị '${err.keyValue[field]}' cho trường '${field}' đã tồn tại`;
  }

  // ─── JWT Errors ───────────────────────────────────────────
  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Token không hợp lệ hoặc đã hết hạn";
  }

  // Log lỗi server
  if (statusCode >= 500) {
    console.error("❌ Server Error:", err);
  } else {
    console.warn("⚠️ Client Error:", message);
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && statusCode >= 500
        ? "Đã xảy ra lỗi từ server"
        : message,
  });
};

export default errorMiddleware;
