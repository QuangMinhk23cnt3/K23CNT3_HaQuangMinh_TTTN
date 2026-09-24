import mongoose from "mongoose";

const SubTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('Task', TaskSchema);
