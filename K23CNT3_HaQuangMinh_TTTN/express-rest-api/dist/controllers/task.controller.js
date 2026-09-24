"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const task_model_1 = __importDefault(require("../model/task.model"));
// Get all tasks for the logged in user
const getTasks = async (req, res, next) => {
    try {
        const tasks = await task_model_1.default.find({ user: req.user.sub }).sort({ createdAt: -1 });
        // Transform _id to id for frontend compatibility
        const formattedTasks = tasks.map(task => {
            const obj = task.toObject();
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
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
        next(error);
    }
};
exports.getTasks = getTasks;
// Create a new task
const createTask = async (req, res, next) => {
    try {
        const taskData = { ...req.body, user: req.user.sub };
        const task = await task_model_1.default.create(taskData);
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
// Update a task
const updateTask = async (req, res, next) => {
    try {
        let task = await task_model_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        if (task.user.toString() !== req.user.sub) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }
        task = await task_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
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
// Delete a task
const deleteTask = async (req, res, next) => {
    try {
        const task = await task_model_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        if (task.user.toString() !== req.user.sub) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
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
