import { useState } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit2,
  Sparkles,
  Timer,
  Tag
} from 'lucide-react'
import type { Task, TaskPriority, TaskCategory, TaskStatus } from '../../types/task'
import { useTasks } from '../../contexts/TaskContext'
import { useNavigate } from 'react-router-dom'

interface TaskCardProps {
  task: Task
}

const PRIORITY_STYLES: Record<TaskPriority, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: 'Khẩn cấp', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  high: { label: 'Ưu tiên cao', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  medium: { label: 'Trung bình', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  low: { label: 'Thấp', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
}

const CATEGORY_NAMES: Record<TaskCategory, { label: string; color: string }> = {
  thesis: { label: 'Đồ Án TTTN', color: 'bg-purple-100 text-purple-800' },
  study: { label: 'Học Tập', color: 'bg-indigo-100 text-indigo-800' },
  work: { label: 'Công Việc', color: 'bg-sky-100 text-sky-800' },
  personal: { label: 'Cá Nhân', color: 'bg-emerald-100 text-emerald-800' },
  other: { label: 'Khác', color: 'bg-gray-100 text-gray-800' },
}

export default function TaskCard({ task }: TaskCardProps) {
  const { changeTaskStatus, deleteTask, openEditModal, toggleSubtask, selectPomodoroTask, startPomodoro } = useTasks()
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const priorityInfo = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
  const categoryInfo = CATEGORY_NAMES[task.category] || CATEGORY_NAMES.other

  const completedSubtasks = task.subtasks.filter(s => s.completed).length
  const totalSubtasks = task.subtasks.length
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  const isDone = task.status === 'done'
  const isOverdue = !isDone && new Date(task.dueDate) < new Date(new Date().toDateString())

  const handleStartPomodoro = () => {
    selectPomodoroTask(task.id)
    startPomodoro()
    navigate('/pomodoro')
  }

  const nextStatusMap: Record<TaskStatus, TaskStatus> = {
    todo: 'in_progress',
    in_progress: 'review',
    review: 'done',
    done: 'todo'
  }

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-4.5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${
        isDone ? 'opacity-70 bg-slate-50/70' : 'bg-white'
      } ${task.priority === 'urgent' && !isDone ? 'border-l-4 border-l-rose-500' : ''}`}
    >
      {/* Top Header: Category, Priority, Options Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryInfo.color}`}>
            {categoryInfo.label}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityInfo.bg} ${priorityInfo.text} ${priorityInfo.border}`}
          >
            {priorityInfo.label}
          </span>
          {task.aiGenerated && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
              <Sparkles className="w-2.5 h-2.5 text-purple-500" />
              AI
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-200/50 text-xs"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setShowMenu(false)
                  openEditModal(task)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  handleStartPomodoro()
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-purple-600"
              >
                <Timer className="w-3.5 h-3.5" />
                Bật Pomodoro
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  changeTaskStatus(task.id, nextStatusMap[task.status])
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Chuyển bước kế
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setShowMenu(false)
                  deleteTask(task.id)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa công việc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Title & Status Toggle */}
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => changeTaskStatus(task.id, isDone ? 'todo' : 'done')}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1">
          <h3
            onClick={() => openEditModal(task)}
            className={`font-semibold text-sm leading-snug cursor-pointer hover:text-indigo-600 transition-colors ${
              isDone ? 'line-through text-slate-400' : 'text-slate-800'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Subtasks Checklist (If any) */}
      {totalSubtasks > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Việc con ({completedSubtasks}/{totalSubtasks})</span>
            <span className="font-semibold text-slate-600">{subtaskProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>

          <div className="space-y-1">
            {task.subtasks.slice(0, 3).map((sub) => (
              <label
                key={sub.id}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => toggleSubtask(task.id, sub.id)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span className={`truncate ${sub.completed ? 'line-through text-slate-400' : ''}`}>
                  {sub.title}
                </span>
              </label>
            ))}
            {totalSubtasks > 3 && (
              <p
                onClick={() => openEditModal(task)}
                className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                + {totalSubtasks - 3} bước nữa...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <Tag className="w-3 h-3 text-slate-300" />
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Footer: Due Date & Time & Quick Pomodoro Action */}
      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span
            className={`flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? 'text-rose-600 font-bold' : ''
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate}
            {isOverdue && ' (Quá hạn)'}
          </span>
          {task.dueTime && (
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {task.dueTime}
            </span>
          )}
        </div>

        <button
          onClick={handleStartPomodoro}
          title="Bắt đầu Pomodoro cho task này"
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-indigo-50 transition-colors"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Tập trung</span>
        </button>
      </div>
    </div>
  )
}
