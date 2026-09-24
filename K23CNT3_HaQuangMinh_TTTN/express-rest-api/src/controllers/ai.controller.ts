import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization - chỉ tạo instance khi cần, đảm bảo env đã được load
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY chưa được cấu hình trong .env');
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

// In-memory cache lưu kết quả phản hồi (TTL: 15 phút) giúp các câu hỏi lặp lại phản hồi tức thì (< 5ms)
interface CacheEntry {
    data: string;
    timestamp: number;
}
const aiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export const suggestTask = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Thiếu prompt đầu vào" });
        }

        // 1. Kiểm tra cache trước - nếu có thì trả về ngay tức thì (< 5ms)
        const cacheKey = prompt.trim();
        const cached = aiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return res.status(200).json({ success: true, data: cached.data, cached: true });
        }

        const ai = getGenAI();

        // 2. Sử dụng model Flash-Lite siêu nhanh (~1 giây thay vì 4-6 giây), tránh lỗi 503 quá tải
        const candidateModels = [
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest"
        ];

        let text = "";
        let lastError: any = null;

        for (const modelName of candidateModels) {
            try {
                const model = ai.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        maxOutputTokens: 800, // Giới hạn token hợp lý để AI trả lời nhanh, không lan man
                        temperature: 0.3,     // Hạ nhiệt độ để câu trả lời súc tích và sinh token nhanh hơn
                        topP: 0.8
                    }
                });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();
                if (text) break;
            } catch (err: any) {
                lastError = err;
                console.warn(`Model ${modelName} gặp lỗi/quá tải, đang chuyển sang model tiếp theo...`);
            }
        }

        if (!text) {
            throw lastError || new Error("Không nhận được phản hồi từ AI");
        }

        // 3. Lưu vào RAM cache
        if (aiCache.size > 200) {
            const oldestKey = aiCache.keys().next().value;
            if (oldestKey) aiCache.delete(oldestKey);
        }
        aiCache.set(cacheKey, { data: text, timestamp: Date.now() });

        res.status(200).json({ success: true, data: text });
    } catch (error: any) {
        console.error("Chi tiết lỗi Google AI:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
