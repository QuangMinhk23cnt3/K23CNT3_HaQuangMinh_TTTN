import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

// Cấu hình cơ bản cho Swagger (Công cụ tự động tạo tài liệu API)
const options = {
    // definition: Chứa các thông tin tổng quan về API của bạn
    definition: {
        // Phiên bản chuẩn OpenAPI đang sử dụng (ở đây là 3.0.0, phiên bản phổ biến nhất hiện nay)
        openapi: "3.0.0",
        
        // info: Thông tin hiển thị trên cùng của trang tài liệu API
        info: {
            title: "Express REST API - User Management", // Tiêu đề trang tài liệu
            version: "1.0.0", // Phiên bản của API
            description:
                "API quản lý người dùng được xây dựng bằng Express.js và MongoDB. " +
                "Cung cấp các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) đầy đủ cho đối tượng User.",
            contact: {
                name: "API Support", // Tên người/nhóm hỗ trợ
                email: "support@example.com" // Email liên hệ khi API có lỗi
            },
            license: {
                name: "ISC", // Loại giấy phép mã nguồn mở
                url: "https://opensource.org/licenses/ISC"
            }
        },
        
        // servers: Danh sách các máy chủ nơi API đang chạy
        // Bạn có thể thêm server Production (máy chủ thật) vào đây sau này
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server (Máy chủ phát triển ở máy cá nhân)"
            }
        ],
        
        // tags: Phân loại các API thành từng nhóm để dễ nhìn trên giao diện
        tags: [
            {
                name: "Users",
                description: "Các thao tác quản lý người dùng (CRUD)"
            },
            {
                name: "Health",
                description: "Kiểm tra trạng thái server (xem server có đang chạy không)"
            }
        ],
        components: {
            schemas: {
                // ─── User Schema (response) ───────────────────────────────
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "64a1b2c3d4e5f6a7b8c9d0e1",
                            description: "MongoDB ObjectId"
                        },
                        name: {
                            type: "string",
                            example: "Hà Quang Minh",
                            description: "Họ và tên người dùng"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "haquangminhk23cnt3@gmail.com",
                            description: "Địa chỉ email (duy nhất)"
                        },
                        age: {
                            type: "integer",
                            minimum: 0,
                            maximum: 120,
                            example: 25,
                            description: "Tuổi người dùng (0–120)"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-15T08:30:00.000Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-15T08:30:00.000Z"
                        }
                    }
                },

                // ─── Create/Update User Request Body ─────────────────────
                UserInput: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                        name: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Hà Quang Minh",
                            description: "Họ và tên (2–100 ký tự)"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "haquangminhk23cnt3@gmail.com",
                            description: "Địa chỉ email hợp lệ và duy nhất"
                        },
                        age: {
                            type: "integer",
                            minimum: 0,
                            maximum: 120,
                            default: 18,
                            example: 25,
                            description: "Tuổi (0–120, mặc định 18)"
                        }
                    }
                },

                // ─── Success Response ─────────────────────────────────────
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string",
                            example: "Operation completed successfully"
                        },
                        data: {
                            description: "Dữ liệu trả về"
                        }
                    }
                },

                // ─── Error Response ───────────────────────────────────────
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string",
                            example: "Error message description"
                        }
                    }
                }
            }
        }
    },
    // Đường dẫn tới các file chứa JSDoc annotations
    apis: [
        path.join(__dirname, "../routes/*.ts").replace(/\\/g, "/"),
        path.join(__dirname, "../server.ts").replace(/\\/g, "/")
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
