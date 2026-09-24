import express from "express";
import { suggestTask } from "../controllers/ai.controller";

const router = express.Router();

// Không yêu cầu xác thực để AI endpoint hoạt động cho tất cả user đã đăng nhập trên frontend
// (Frontend tự quản lý auth state, backend AI chỉ cần nhận prompt và trả kết quả)

/**
 * @swagger
 * /api/ai/suggest:
 *   post:
 *     summary: Gợi ý công việc bằng AI (Google Gemini)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Câu lệnh tự nhiên để AI xử lý
 *                 example: "Lập kế hoạch tuần này cho đồ án tốt nghiệp"
 *     responses:
 *       200:
 *         description: Phản hồi thành công từ AI
 *       400:
 *         description: Thiếu prompt đầu vào
 *       500:
 *         description: Lỗi server hoặc lỗi API Google AI
 */
router.post("/suggest", suggestTask);

export default router;
