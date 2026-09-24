"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = __importDefault(require("./config/database"));
const swagger_1 = __importDefault(require("./config/swagger"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ─── Security Middleware ──────────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Tắt CSP để cho phép load các tài nguyên frontend bình thường (nếu có lỗi CSS/JS)
    crossOriginEmbedderPolicy: false
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Cho phép same-origin, curl/postman không có origin header, hoặc bất kỳ origin nào kết nối đến
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ─── Request Logging ──────────────────────────────────────────────────────────
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: "Quá nhiều request. Vui lòng thử lại sau 15 phút.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", apiLimiter);
// ─── Body Parsers & Cookies ──────────────────────────────────────────────────
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ─── Connect MongoDB ──────────────────────────────────────────────────────────
(0, database_1.default)();
// ─── Swagger UI ───────────────────────────────────────────────────────────────
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    explorer: true,
    customSiteTitle: "Express REST API - Docs",
    customCss: `
            .swagger-ui .topbar { background-color: #1a1a2e; }
            .swagger-ui .topbar-wrapper .link span { display: none; }
            .swagger-ui .topbar-wrapper::after {
                content: 'Express REST API - User Management';
                color: #e94560;
                font-size: 1.2rem;
                font-weight: bold;
            }
        `,
    swaggerOptions: {
        docExpansion: "list",
        defaultModelsExpandDepth: 2,
        filter: true,
        showRequestDuration: true
    }
}));
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swagger_1.default);
});
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
// ─── Serve Frontend ───────────────────────────────────────────────────────────
// Phục vụ thư mục static của React build
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
// Các request không bắt đầu bằng /api sẽ được điều hướng tới index.html
app.use((req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../frontend/dist/index.html'));
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    try {
        fs_1.default.appendFileSync('error.log', new Date().toISOString() + ': ' + err.stack + '\n');
    }
    catch (e) { }
    res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Đã xảy ra lỗi không mong đợi từ server."
            : err.message || "Đã xảy ra lỗi không mong đợi từ server."
    });
});
// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`📄 Swagger JSON Spec: http://localhost:${PORT}/api-docs.json\n`);
});
