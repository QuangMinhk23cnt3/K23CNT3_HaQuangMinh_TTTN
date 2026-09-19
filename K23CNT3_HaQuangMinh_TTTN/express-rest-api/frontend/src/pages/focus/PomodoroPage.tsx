import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Flame,
  Coffee
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'

export default function PomodoroPage() {
  const {
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    switchPomodoroMode,
    selectPomodoroTask,
    tasks
  } = useTasks()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Active task for this session
  const activeTask = tasks.find(t => t.id === pomodoro.currentTaskId)
  const pendingTasks = tasks.filter(t => t.status !== 'done')

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Timer className="w-6 h-6 text-rose-600" />
          Không Gian Tập Trung Pomodoro
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Duy trì sự tập trung tối đa trong 25 phút, nghỉ ngơi 5 phút để bảo vệ năng lượng não bộ
        </p>
      </div>

      {/* Main Pomodoro Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selectors */}
        <div className="inline-flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl mb-8 relative z-10">
          <button
            onClick={() => switchPomodoroMode('work')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoro.mode === 'work'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Làm việc (25m)
          </button>
          <button
            onClick={() => switchPomodoroMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoro.mode === 'shortBreak'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nghỉ ngắn (5m)
          </button>
          <button
            onClick={() => switchPomodoroMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoro.mode === 'longBreak'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nghỉ dài (15m)
          </button>
        </div>

        {/* Huge Digital Clock Display */}
        <div className="relative z-10 my-4">
          <div className="text-7xl md:text-8xl font-black tracking-tight text-slate-900 font-mono select-none drop-shadow-xs">
            {formatTime(pomodoro.timeLeft)}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {pomodoro.mode === 'work'
              ? '🔥 Đang trong phiên làm việc tập trung'
              : '☕ Giờ nghỉ ngơi, hãy thư giãn mắt và uống nước'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
          <button
            onClick={resetPomodoro}
            title="Đặt lại đồng hồ"
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {pomodoro.isRunning ? (
            <button
              onClick={pausePomodoro}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-200 transition-all hover:scale-102"
            >
              <Pause className="w-5 h-5" />
              <span>Tạm dừng</span>
            </button>
          ) : (
            <button
              onClick={startPomodoro}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all hover:scale-102"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu tập trung</span>
            </button>
          )}
        </div>

        {/* Associate with a Task */}
        <div className="mt-10 pt-6 border-t border-slate-100 max-w-md mx-auto text-left relative z-10">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            🎯 Gán phiên này cho công việc:
          </label>
          <select
            value={pomodoro.currentTaskId || ''}
            onChange={(e) => selectPomodoroTask(e.target.value || null)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Không chọn (Tập trung chung) --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.category.toUpperCase()}] {t.title}
              </option>
            ))}
          </select>

          {activeTask && (
            <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-900 truncate">
                Mục tiêu hiện tại: {activeTask.title}
              </span>
              <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.5 rounded bg-white shrink-0">
                {activeTask.priority.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Focus Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <Flame className="w-5 h-5 text-rose-500 mx-auto mb-1 fill-rose-100" />
          <p className="text-2xl font-extrabold text-slate-900">{pomodoro.completedSessions}</p>
          <p className="text-xs text-slate-500">Phiên hoàn thành hôm nay</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <Timer className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <p className="text-2xl font-extrabold text-slate-900">
            {Math.round(pomodoro.totalFocusSeconds / 60)} phút
          </p>
          <p className="text-xs text-slate-500">Tổng thời gian tập trung sâu</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
          <Coffee className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-extrabold text-slate-900">
            {pomodoro.completedSessions * 5} phút
          </p>
          <p className="text-xs text-slate-500">Thời gian thư giãn hợp lý</p>
        </div>
      </div>
    </div>
  )
}
