import { useState, useEffect } from 'react'
import { X, Sparkles, Plus, Trash2 } from 'lucide-react'
import type { TaskPriority, TaskCategory, TaskStatus, SubTask } from '../../types/task'
import { useTasks } from '../../contexts/TaskContext'
import { generateSuggestedSubtasks } from '../../services/aiService'

export default function TaskModal() {
  const { isTaskModalOpen, editingTask, closeTaskModal, addTask, updateTask } = useTasks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState<TaskCategory>('thesis')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('18:00')
  const [tagsInput, setTagsInput] = useState('')
  const [subtasks, setSubtasks] = useState<SubTask[]>([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
      setPriority(editingTask.priority)
      setCategory(editingTask.category)
      setStatus(editingTask.status)
      setDueDate(editingTask.dueDate)
      setDueTime(editingTask.dueTime || '18:00')
      setTagsInput(editingTask.tags ? editingTask.tags.join(', ') : '')
      setSubtasks(editingTask.subtasks || [])
    } else {
      // Default new task
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategory('thesis')
      setStatus('todo')
      const today = new Date().toISOString().split('T')[0]
      setDueDate(today)
      setDueTime('18:00')
      setTagsInput('TTTN, AI')
      setSubtasks([])
    }
  }, [editingTask, isTaskModalOpen])

  if (!isTaskModalOpen) return null

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return
    const newSub: SubTask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false
    }
    setSubtasks([...subtasks, newSub])
    setNewSubtaskTitle('')
  }

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id))
  }

  // Tính năng AI Magic: Tự động phân tích tiêu đề và gợi ý subtasks
  const handleAiBreakdown = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tiêu đề công việc trước để AI có thể phân rã!')
      return
    }
    setIsAiGenerating(true)
    setTimeout(() => {
      const generated = generateSuggestedSubtasks(title)
      const newItems: SubTask[] = generated.map((t, idx) => ({
        id: `ai-gen-${Date.now()}-${idx}`,
        title: t,
        completed: false
      }))
      setSubtasks(prev => [...prev, ...newItems])
      setIsAiGenerating(false)
    }, 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    try {
      if (editingTask) {
        await updateTask({
          ...editingTask,
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          status,
          dueDate,
          dueTime,
          tags: parsedTags,
          subtasks
        })
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          status,
          dueDate,
          dueTime,
          tags: parsedTags,
          subtasks,
          aiGenerated: isAiGenerating || subtasks.some(s => s.id.startsWith('ai-'))
        })
      }
      closeTaskModal()
    } catch (error: any) {
      console.error(error)
      alert(`Có lỗi xảy ra khi lưu công việc. Vui lòng thử lại! Chi tiết: ${error?.response?.data?.message || error?.message || 'Không rõ nguyên nhân'}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
            </h2>
          </div>
          <button
            onClick={closeTaskModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề công việc <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Viết chương 3 đồ án tốt nghiệp..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mô tả chi tiết / Ghi chú
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu, yêu cầu hoặc đường link tài liệu liên quan..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Danh mục phân loại
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="thesis">🎓 Đồ án TTTN</option>
                <option value="study">📚 Học tập</option>
                <option value="work">💼 Công việc</option>
                <option value="personal">🌱 Cá nhân</option>
                <option value="other">📌 Khác</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="urgent">🔥 Khẩn cấp (Gấp)</option>
                <option value="high">⚡ Ưu tiên cao</option>
                <option value="medium">🔷 Trung bình</option>
                <option value="low">☕ Thấp (Khi rảnh)</option>
              </select>
            </div>
          </div>

          {/* Status & Deadline Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="todo">Cần làm (To Do)</option>
                <option value="in_progress">Đang làm</option>
                <option value="review">Đang xem xét</option>
                <option value="done">Hoàn thành</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hạn chót (Deadline)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Giờ hết hạn
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Thẻ tags (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: TTTN, Frontend, Báo cáo"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* AI Subtasks Generator Section */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-800">
                  Danh sách việc con (Checklist)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={isAiGenerating || !title.trim()}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-100/60 border border-purple-200 px-2.5 py-1 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                {isAiGenerating ? 'AI đang phân rã...' : 'AI Gợi ý các bước'}
              </button>
            </div>

            {/* List of subtasks */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs"
                >
                  <label className="flex items-center gap-2 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => {
                        setSubtasks(
                          subtasks.map((s) =>
                            s.id === sub.id ? { ...s, completed: !s.completed } : s
                          )
                        )
                      }}
                      className="rounded text-indigo-600 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className={`text-xs ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {sub.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubtask()
                  }
                }}
                placeholder="Nhập bước thực hiện thủ công..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeTaskModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
            >
              {editingTask ? 'Lưu thay đổi' : 'Tạo công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
