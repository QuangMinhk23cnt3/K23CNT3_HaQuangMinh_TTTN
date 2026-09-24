"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token không được cung cấp hoặc không hợp lệ",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (decoded.type !== "access") {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
        });
    }
};
exports.default = authMiddleware;
