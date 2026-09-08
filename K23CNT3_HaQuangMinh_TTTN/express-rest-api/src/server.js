const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

const connectDatabase = require("./config/database");
const swaggerSpec = require("./config/swagger");
const userRoutes = require("./routes/user.routes");


dotenv.config();


const app = express();


// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// Endpoint trả về raw JSON spec (dùng cho Postman import)
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
});


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);


// ─── Health Check ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     description: Kiểm tra trạng thái hoạt động của server và API.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server đang hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Express + MongoDB API is running"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 docs:
 *                   type: string
 *                   example: "http://localhost:3000/api-docs"
 */
app.get("/", (req, res) => {
    res.json({
        message: "Express + MongoDB API is running",
        version: "1.0.0",
        docs: `http://localhost:${process.env.PORT || 3000}/api-docs`
    });
});


// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.originalUrl}' không tồn tại.`
    });
});


// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi không mong đợi từ server."
    });
});


// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`📄 Swagger JSON Spec: http://localhost:${PORT}/api-docs.json\n`);
});