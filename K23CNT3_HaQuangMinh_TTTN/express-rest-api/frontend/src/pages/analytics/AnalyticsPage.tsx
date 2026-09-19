import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Flame,
  BrainCircuit,
  Sparkles
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'

export default function AnalyticsPage() {
  const { tasks, stats, pomodoro } = useTasks()

  // Categories metrics
  const categories = [
    { name: 'Đồ Án TTTN', count: tasks.filter(t => t.category === 'thesis').length, color: 'bg-purple-500' },
    { name: 'Học Tập', count: tasks.filter(t => t.category === 'study').length, color: 'bg-indigo-500' },
    { name: 'Công Việc', count: tasks.filter(t => t.category === 'work').length, color: 'bg-sky-500' },
    { name: 'Cá Nhân', count: tasks.filter(t => t.category === 'personal').length, color: 'bg-emerald-500' },
  ]

  // Mock weekly productivity distribution (Hours/day)
  const weeklyTrend = [
    { day: 'Thứ 2', hours: 4.5, tasksDone: 3 },
    { day: 'Thứ 3', hours: 6.0, tasksDone: 5 },
    { day: 'Thứ 4', hours: 5.2, tasksDone: 4 },
    { day: 'Thứ 5', hours: 7.0, tasksDone: 6 },
    { day: 'Thứ 6', hours: 5.8, tasksDone: 4 },
    { day: 'Thứ 7', hours: 3.5, tasksDone: 2 },
    { day: 'CN', hours: 2.0, tasksDone: 1 },
  ]

  const maxHours = Math.max(...weeklyTrend.map(d => d.hours))

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Báo Cáo & Thống Kê Hiệu Suất
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Phân tích chuyên sâu về năng suất, tỷ lệ hoàn thành mục tiêu và thói quen làm việc cá nhân
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tỷ lệ hoàn thành</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.completionRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">So với tuần trước</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Công việc đã xong</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.completedTasks}</span>
            <span className="text-xs text-slate-400">/ {stats.totalTasks} việc</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Đạt chỉ tiêu tuần</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tổng giờ tập trung</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {(pomodoro.totalFocusSeconds / 3600).toFixed(1)}h
            </span>
            <span className="text-xs font-semibold text-purple-600">Pomodoro</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tập trung chuyên sâu</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Điểm kỷ luật (Streak)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">5 ngày</span>
            <span className="text-xs font-semibold text-amber-500 flex items-center">
              <Flame className="w-3.5 h-3.5 mr-0.5 fill-amber-500" /> Liên tục
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Duy trì thói quen tốt</p>
        </div>
      </div>

      {/* Grid: Charts & AI Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Productivity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Xu hướng tập trung trong tuần (Giờ làm việc)
              </h3>
              <p className="text-xs text-slate-500">Biểu đồ số giờ thực hiện tác vụ mỗi ngày</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
              Tuần này
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {weeklyTrend.map((item, idx) => {
              const heightPct = Math.round((item.hours / maxHours) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Share (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Phân bổ theo danh mục</h3>
            <p className="text-xs text-slate-500">Tỷ lệ công việc phân chia theo lĩnh vực</p>
          </div>

          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const pct = stats.totalTasks > 0 ? Math.round((cat.count / stats.totalTasks) * 100) : 0
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>{cat.name}</span>
                    <span className="text-slate-500">{cat.count} việc ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Performance Evaluation Report */}
      <div className="rounded-3xl border border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/70 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Đánh Giá Toàn Diện Từ Trợ Lý AI TaskAI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Điểm mạnh
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Bạn duy trì tốt nhịp độ hoàn thành các task Đồ Án TTTN với tỷ lệ đúng hạn đạt trên 85%. Kỹ thuật Pomodoro được ứng dụng hiệu quả.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-amber-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              Điểm cần lưu ý
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Các đầu việc cá nhân và thư giãn còn bị dồn vào cuối ngày. Cần phân bổ đều để tránh cảm giác kiệt sức (burnout).
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
            <h4 className="font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Khuyến nghị tuần tới
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Ưu tiên hoàn thiện Báo cáo Chương 3 trong các khung giờ sáng (8h - 10h) khi khả năng tư duy logic và tập trung cao nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
