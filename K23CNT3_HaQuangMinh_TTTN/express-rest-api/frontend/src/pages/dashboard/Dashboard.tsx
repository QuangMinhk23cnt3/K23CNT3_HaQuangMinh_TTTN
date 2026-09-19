import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Plus,
  BookOpen,
  GraduationCap,
  Calendar,
  Timer
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'
import { useAuth } from '../../contexts/AuthContext'
import TaskCard from '../../components/tasks/TaskCard'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { tasks, stats, openCreateModal } = useTasks()
  const { user } = useAuth()
  const navigate = useNavigate()

  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.status === 'in_progress')
  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')

  // Categories count
  const thesisCount = tasks.filter(t => t.category === 'thesis').length
  const studyCount = tasks.filter(t => t.category === 'study').length
  const workCount = tasks.filter(t => t.category === 'work').length
  const personalCount = tasks.filter(t => t.category === 'personal').length

  return (
    <div className="space-y-6 pb-12">
      {/* 1. AI Daily Intelligence Briefing Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 md:p-8 text-white shadow-xl shadow-indigo-950/10">
        {/* Background ambient lighting */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI Daily Briefing • Đề tài TTTN - K23CNT3</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Chào bạn, {user?.name || 'Hà Quang Minh'}! Hôm nay bạn có {todayTasks.length} việc cần chú ý.
            </h2>

            <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed">
              {urgentTasks.length > 0
                ? `⚡ Trợ lý AI phát hiện bạn có ${urgentTasks.length} việc khẩn cấp (Ưu tiên: "${urgentTasks[0]?.title}"). Hãy chia phiên Pomodoro 25 phút để giải quyết dứt điểm trong sáng nay!`
                : '🎉 Tiến độ hôm nay rất tuyệt vời! Các đầu việc quan trọng đều trong tầm kiểm soát. Hãy tiếp tục duy trì đà tập trung nhé!'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/ai-assistant')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Hỏi Trợ lý AI</span>
            </button>
            <button
              onClick={() => navigate('/pomodoro')}
              className="flex items-center gap-2 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 border border-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all"
            >
              <Timer className="w-4 h-4" />
              <span>Bật Focus Timer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Productivity Metric Cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng công việc</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalTasks}</span>
            <span className="text-xs text-slate-400 font-medium">nhiệm vụ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Đang làm: <strong className="text-indigo-600">{stats.inProgressTasks}</strong></span>
            <span>•</span>
            <span>Chờ xử lý: <strong>{stats.totalTasks - stats.completedTasks - stats.inProgressTasks}</strong></span>
          </div>
        </div>

        {/* Card 2: Completed Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỷ lệ hoàn thành</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.completionRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {stats.completedTasks} đã xong
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Urgent / Overdue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Việc khẩn cấp & Quá hạn</span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{urgentTasks.length}</span>
            <span className="text-xs text-rose-600 font-semibold">
              {stats.overdueTasks > 0 ? `(${stats.overdueTasks} quá hạn)` : 'Đúng hạn'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Cần giải quyết trước theo ma trận Eisenhower
          </p>
        </div>

        {/* Card 4: Focus Time */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tập trung Pomodoro</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Flame className="w-4 h-4 text-purple-600 fill-purple-100" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.focusMinutesToday}</span>
            <span className="text-xs text-purple-600 font-medium">phút hôm nay</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Đã hoàn tất <strong className="text-purple-700">{stats.pomodoroSessionsToday}</strong> phiên tập trung
          </p>
        </div>
      </div>

      {/* 3. Main Dashboard Grid: Today's Tasks & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Priority Agenda */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Công việc trọng tâm hôm nay
              </h3>
              <p className="text-xs text-slate-500">
                Các đầu việc đến hạn hoặc đang trong tiến trình thực hiện
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openCreateModal()}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm việc</span>
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-800">Không có việc tồn đọng hôm nay!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bạn đã hoàn thành các nhiệm vụ quan trọng hoặc chưa lên lịch cho hôm nay.
              </p>
              <button
                onClick={() => openCreateModal()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo công việc mới</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Category Distribution & AI Suggestions Widget */}
        <div className="space-y-6">
          {/* Category Distribution Widget */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              Phân loại danh mục
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Đồ Án TTTN
                  </span>
                  <span>{thesisCount} việc</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${stats.totalTasks ? (thesisCount / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    Học Tập
                  </span>
                  <span>{studyCount} việc</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${stats.totalTasks ? (studyCount / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    Công Việc
                  </span>
                  <span>{workCount} việc</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${stats.totalTasks ? (workCount / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Cá Nhân
                  </span>
                  <span>{personalCount} việc</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${stats.totalTasks ? (personalCount / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Pro-Tips Widget */}
          <div className="rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-purple-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Gợi ý năng suất từ AI</span>
            </div>
            <p className="text-xs text-purple-800/90 leading-relaxed">
              "Hãy áp dụng quy tắc 2 phút: Nếu một việc mất dưới 2 phút để hoàn thành (như gửi email báo cáo hay kiểm tra link), hãy làm ngay thay vì ghi vào danh sách hoãn lại."
            </p>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="mt-3 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1"
            >
              <span>Xem thêm tư vấn từ AI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}