"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubTaskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
});
const TaskSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'review', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['urgent', 'high', 'medium', 'low'],
        default: 'medium',
    },
    category: {
        type: String,
        enum: ['thesis', 'study', 'work', 'personal', 'other'],
        default: 'other',
    },
    dueDate: {
        type: String,
    },
    dueTime: {
        type: String,
    },
    subtasks: {
        type: [SubTaskSchema],
        default: [],
    },
    estimatedMinutes: {
        type: Number,
    },
    tags: {
        type: [String],
        default: [],
    },
    aiGenerated: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Task', TaskSchema);
