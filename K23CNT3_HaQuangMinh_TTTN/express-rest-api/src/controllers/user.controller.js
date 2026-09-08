const User = require("../model/user.model");


// ─── Helper: kiểm tra ObjectId hợp lệ ───────────────────────────────────────
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// ─── Helper: validate email format ───────────────────────────────────────────
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


// ─── GET ALL USERS ────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {

    try {

        const users = await User.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách users: " + error.message
        });

    }
};


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

        const user = await User.findById(id);

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

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin user: " + error.message
        });

    }
};


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

        const newUser = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age
        });

        res.status(201).json({
            success: true,
            message: "Tạo user thành công.",
            data: newUser
        });

    } catch (error) {

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
        if (name !== undefined) updateData.name = name.trim();
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (age !== undefined) updateData.age = age;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

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

    } catch (error) {

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

        const deletedUser = await User.findByIdAndDelete(id);

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

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa user: " + error.message
        });

    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};