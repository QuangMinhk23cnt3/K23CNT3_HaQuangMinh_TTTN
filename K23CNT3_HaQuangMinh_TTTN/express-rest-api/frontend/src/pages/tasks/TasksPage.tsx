import { useState } from 'react'
import {
  Kanban,
  List as ListIcon,
  Plus,
  Search,
  CheckCircle2,
  CircleDot
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'
import type { TaskCategory, TaskPriority, TaskStatus } from '../../types/task'
import TaskCard from '../../components/tasks/TaskCard'

const STATUS_COLUMNS: { id: TaskStatus; title: string; color: string; badgeBg: string }[] = [
  { id: 'todo', title: 'Cần làm', color: 'border-slate-300 text-slate-700', badgeBg: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', title: 'Đang làm', color: 'border-indigo-400 text-indigo-700', badgeBg: 'bg-indigo-50 text-indigo-700' },
  { id: 'review', title: 'Đang xem xét', color: 'border-amber-400 text-amber-700', badgeBg: 'bg-amber-50 text-amber-700' },
  { id: 'done', title: 'Hoàn thành', color: 'border-emerald-400 text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700' },
]

export default function TasksPage() {
  const {
    filteredTasks,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    openCreateModal
  } = useTasks()

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  const categories: { id: TaskCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'thesis', label: '🎓 Đồ Án TTTN' },
    { id: 'study', label: '📚 Học Tập' },
    { id: 'work', label: '💼 Công Việc' },
    { id: 'personal', label: '🌱 Cá Nhân' },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Không Gian Quản Lý Công Việc
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi, phân loại và cập nhật tiến độ công việc theo mô hình Kanban & Danh sách
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm việc</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority Filter & Status Filter & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên/tag..."
              className="w-36 sm:w-44 pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả ưu tiên</option>
            <option value="urgent">🔥 Khẩn cấp</option>
            <option value="high">⚡ Ưu tiên cao</option>
            <option value="medium">🔷 Trung bình</option>
            <option value="low">☕ Thấp</option>
          </select>

          {viewMode === 'list' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="todo">Cần làm</option>
              <option value="in_progress">Đang làm</option>
              <option value="review">Đang xem xét</option>
              <option value="done">Hoàn thành</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Content: Kanban or List */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id)
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-slate-100/70 border border-slate-200/70 p-3.5 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`w-3.5 h-3.5 ${col.color}`} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {col.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards in Column */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300/80 p-6 text-center text-slate-400 text-xs">
                      Không có công việc nào
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>

                {/* Quick Add Button in column */}
                <button
                  onClick={() => openCreateModal()}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-white/80 rounded-xl transition-all border border-transparent hover:border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm việc vào cột</span>
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Không tìm thấy công việc phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc tạo công việc mới</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
