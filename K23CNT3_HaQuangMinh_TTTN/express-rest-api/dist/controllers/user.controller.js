"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
// ─── Helper: kiểm tra ObjectId hợp lệ ───────────────────────────────────────
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
// ─── Helper: validate email format ───────────────────────────────────────────
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// ─── GET ALL USERS (with pagination, search, filter) ─────────────────────────
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", ageMin, ageMax, } = req.query;
        // Build filter query
        const filter = {};
        // Search by name or email
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        // Filter by age range
        if (ageMin !== undefined || ageMax !== undefined) {
            filter.age = {};
            if (ageMin !== undefined)
                filter.age.$gte = Number(ageMin);
            if (ageMax !== undefined)
                filter.age.$lte = Number(ageMax);
        }
        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        // Sort
        const allowedSortFields = ["name", "email", "age", "createdAt", "updatedAt"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };
        const [users, total] = await Promise.all([
            user_model_1.default.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            user_model_1.default.countDocuments(filter),
        ]);
        res.json({
            success: true,
            count: users.length,
            data: users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách users: " + error.message
        });
    }
};
exports.getUsers = getUsers;
// ─── GET USER BY ID ───────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID không hợp lệ. Vui lòng cung cấp MongoDB ObjectId đúng định dạng."
            });
        }
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user với ID: " + id
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin user: " + error.message
        });
    }
};
exports.getUserById = getUserById;
// ─── CREATE USER ──────────────────────────────────────────────────────────────
const createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        // Validate: name bắt buộc
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Trường 'name' là bắt buộc và không được để trống."
            });
        }
        // Validate: name độ dài
        if (name.trim().length < 2 || name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Trường 'name' phải có độ dài từ 2 đến 100 ký tự."
            });
        }
        // Validate: email bắt buộc
        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Trường 'email' là bắt buộc và không được để trống."
            });
        }
        // Validate: email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Định dạng email không hợp lệ."
            });
        }
        // Validate: age range
        if (age !== undefined && age !== null) {
            const ageNum = Number(age);
            if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
                return res.status(400).json({
                    success: false,
                    message: "Trường 'age' phải là số trong khoảng từ 0 đến 120."
                });
            }
        }
        const newUser = await user_model_1.default.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age
        });
        res.status(201).json({
            success: true,
            message: "Tạo user thành công.",
            data: newUser
        });
    }
    catch (error) {
        // Lỗi duplicate email (MongoDB error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email này đã được sử dụng. Vui lòng dùng email khác."
            });
        }
        res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo user: " + error.message
        });
    }
};
exports.createUser = createUser;
// ─── UPDATE USER ──────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID không hợp lệ. Vui lòng cung cấp MongoDB ObjectId đúng định dạng."
            });
        }
        const { name, email, age } = req.body;
        // Validate: name nếu được cung cấp
        if (name !== undefined) {
            if (name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Trường 'name' không được để trống."
                });
            }
            if (name.trim().length < 2 || name.trim().length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Trường 'name' phải có độ dài từ 2 đến 100 ký tự."
                });
            }
        }
        // Validate: email nếu được cung cấp
        if (email !== undefined) {
            if (email.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Trường 'email' không được để trống."
                });
            }
            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Định dạng email không hợp lệ."
                });
            }
        }
        // Validate: age nếu được cung cấp
        if (age !== undefined && age !== null) {
            const ageNum = Number(age);
            if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
                return res.status(400).json({
                    success: false,
                    message: "Trường 'age' phải là số trong khoảng từ 0 đến 120."
                });
            }
        }
        // Chuẩn bị dữ liệu update
        const updateData = {};
        if (name !== undefined)
            updateData.name = name.trim();
        if (email !== undefined)
            updateData.email = email.trim().toLowerCase();
        if (age !== undefined)
            updateData.age = age;
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user với ID: " + id
            });
        }
        res.json({
            success: true,
            message: "Cập nhật user thành công.",
            data: updatedUser
        });
    }
    catch (error) {
        // Lỗi duplicate email
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email này đã được sử dụng. Vui lòng dùng email khác."
            });
        }
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật user: " + error.message
        });
    }
};
exports.updateUser = updateUser;
// ─── DELETE USER ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID không hợp lệ. Vui lòng cung cấp MongoDB ObjectId đúng định dạng."
            });
        }
        const deletedUser = await user_model_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user với ID: " + id
            });
        }
        res.json({
            success: true,
            message: "Xóa user thành công.",
            data: {
                deletedId: id,
                deletedUser
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa user: " + error.message
        });
    }
};
exports.deleteUser = deleteUser;
