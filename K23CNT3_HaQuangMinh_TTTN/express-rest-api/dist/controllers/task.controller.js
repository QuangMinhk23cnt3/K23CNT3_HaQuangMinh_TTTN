"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const task_model_1 = __importDefault(require("../model/task.model"));
/**
 * Controller: Lấy danh sách tất cả các công việc (Task) của người dùng đang đăng nhập
 * Được bảo vệ bởi authMiddleware nên chắc chắn req.user.sub (ID của user) đã tồn tại.
 */
const getTasks = async (req, res, next) => {
    try {
        // Tìm trong Database tất cả các task thuộc về User hiện tại, sắp xếp mới nhất lên đầu
        const tasks = await task_model_1.default.find({ user: req.user.sub }).sort({ createdAt: -1 });
        // Transform (Biến đổi) _id của MongoDB thành id chuẩn cho Frontend dễ đọc
        const formattedTasks = tasks.map(task => {
            const obj = task.toObject(); // Chuyển Document Mongoose thành plain JavaScript Object
            obj.id = obj._id.toString(); // Map _id thành id
            delete obj._id; // Xóa _id cũ
            delete obj.__v; // Xóa version key __v của Mongoose
            // Biến đổi tương tự cho mảng subtasks (việc con)
            obj.subtasks = obj.subtasks.map(sub => {
                sub.id = sub._id.toString();
                delete sub._id;
                return sub;
            });
            return obj;
        });
        res.status(200).json({
            success: true,
            data: formattedTasks,
        });
    }
    catch (error) {
        next(error); // Chuyển lỗi xuống Global Error Handler
    }
};
exports.getTasks = getTasks;
/**
 * Controller: Tạo một công việc (Task) mới
 */
const createTask = async (req, res, next) => {
    try {
        // Gắn thêm ID của người dùng đang đăng nhập vào dữ liệu người dùng gửi lên
        const taskData = { ...req.body, user: req.user.sub };
        // Lưu vào MongoDB thông qua Model
        const task = await task_model_1.default.create(taskData);
        // Transform dữ liệu trả về giống như hàm getTasks
        const obj = task.toObject();
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
        if (obj.subtasks) {
            obj.subtasks = obj.subtasks.map(sub => {
                sub.id = sub._id.toString();
                delete sub._id;
                return sub;
            });
        }
        // HTTP 201: Trạng thái Tạo thành công (Created)
        res.status(201).json({
            success: true,
            data: obj,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
/**
 * Controller: Cập nhật thông tin một công việc (Ví dụ: Đổi trạng thái, Đổi tên)
 */
const updateTask = async (req, res, next) => {
    try {
        // req.params.id lấy từ URL (ví dụ: PUT /api/tasks/12345 thì id là 12345)
        let task = await task_model_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found (Không tìm thấy công việc)' });
        }
        // Bảo mật: Kiểm tra xem người dùng hiện tại có phải là CHỦ của công việc này không
        if (task.user.toString() !== req.user.sub) {
            return res.status(403).json({ success: false, message: 'Not authorized (Bạn không có quyền sửa công việc của người khác)' });
        }
        // Thực hiện cập nhật vào Database
        task = await task_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về object mới nhất SAU khi đã update
            runValidators: true, // Chạy lại các quy tắc kiểm tra Schema
        });
        // Transform dữ liệu trả về cho Frontend
        const obj = task.toObject();
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
        if (obj.subtasks) {
            obj.subtasks = obj.subtasks.map(sub => {
                sub.id = sub._id.toString();
                delete sub._id;
                return sub;
            });
        }
        res.status(200).json({
            success: true,
            data: obj,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
/**
 * Controller: Xoá một công việc
 */
const deleteTask = async (req, res, next) => {
    try {
        const task = await task_model_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        // Bảo mật: Tương tự hàm update, chỉ chủ nhân mới được xóa
        if (task.user.toString() !== req.user.sub) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await task.deleteOne();
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
