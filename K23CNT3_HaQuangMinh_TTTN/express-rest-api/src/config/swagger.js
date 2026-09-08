const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express REST API - User Management",
            version: "1.0.0",
            description:
                "API quản lý người dùng được xây dựng bằng Express.js và MongoDB. " +
                "Cung cấp các thao tác CRUD đầy đủ cho đối tượng User.",
            contact: {
                name: "API Support",
                email: "support@example.com"
            },
            license: {
                name: "ISC",
                url: "https://opensource.org/licenses/ISC"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ],
        tags: [
            {
                name: "Users",
                description: "Các thao tác quản lý người dùng (CRUD)"
            },
            {
                name: "Health",
                description: "Kiểm tra trạng thái server"
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
    // Dùng forward slash vì swagger-jsdoc dùng glob (không hỗ trợ backslash trên Windows)
    apis: [
        path.join(__dirname, "../routes/*.js").replace(/\\/g, "/"),
        path.join(__dirname, "../server.js").replace(/\\/g, "/")
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
