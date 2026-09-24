import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

import connectDatabase from "./config/database";
import swaggerSpec from "./config/swagger";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import aiRoutes from "./routes/ai.routes";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();


// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: false, // Tắt CSP để cho phép load các tài nguyên frontend bình thường (nếu có lỗi CSS/JS)
    crossOriginEmbedderPolicy: false
}));

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(
    morgan(
        process.env.NODE_ENV === "production" ? "combined" : "dev"
    )
);


// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
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
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ─── Connect MongoDB ──────────────────────────────────────────────────────────
connectDatabase();


// ─── Swagger UI ───────────────────────────────────────────────────────────────
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
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
    })
);

app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
});


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);


// ─── Serve Frontend ───────────────────────────────────────────────────────────
// Phục vụ thư mục static của React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Các request không bắt đầu bằng /api sẽ được điều hướng tới index.html
app.use((req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err.stack);
    try {
        fs.appendFileSync('error.log', new Date().toISOString() + ': ' + err.stack + '\n');
    } catch(e) {}
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