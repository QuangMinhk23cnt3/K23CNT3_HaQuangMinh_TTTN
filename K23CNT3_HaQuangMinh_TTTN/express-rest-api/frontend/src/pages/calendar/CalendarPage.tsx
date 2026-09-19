import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'
import TaskCard from '../../components/tasks/TaskCard'

export default function CalendarPage() {
  const { tasks, openCreateModal } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // First day of month (0 = Sunday, 1 = Monday...)
  const firstDay = new Date(year, month, 1).getDay()
  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  // Filter tasks for selected date
  const selectedTasks = tasks.filter(t => t.dueDate === selectedDateStr)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Lịch Trình Công Việc
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem phân bổ thời hạn (deadline) của các đầu việc theo lịch biểu tháng
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm việc mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          {/* Calendar Month Nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {monthNames[month]} năm {year}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before month start */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 rounded-2xl bg-slate-50/50" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayTasks = tasks.filter(t => t.dueDate === dateStr)
              const isSelected = selectedDateStr === dateStr
              const isToday = new Date().toISOString().split('T')[0] === dateStr

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 rounded-2xl border p-2 flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-xs'
                      : isToday
                      ? 'border-purple-300 bg-purple-50/20'
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : isSelected
                          ? 'text-indigo-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Indicators / previews */}
                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 1).map(t => (
                      <div
                        key={t.id}
                        className="truncate text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/90 border border-slate-200/80 text-slate-700"
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 1 && (
                      <span className="text-[9px] text-slate-400 block pl-1">
                        +{dayTasks.length - 1} việc nữa
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Day Agenda (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lịch trình ngày
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {selectedDateStr}
            </h3>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600">Không có hạn chót trong ngày này</p>
              <button
                onClick={() => openCreateModal()}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm việc cho ngày này</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {selectedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
