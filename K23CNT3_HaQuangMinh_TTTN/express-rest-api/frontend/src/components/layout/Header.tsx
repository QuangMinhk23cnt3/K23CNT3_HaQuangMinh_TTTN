import { useState } from 'react'
import type { FormEvent } from 'react'
import { Sparkles, Plus, Search, Timer, Bell, Calendar as CalendarIcon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTasks } from '../../contexts/TaskContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user } = useAuth()
  const { addAiTaskFromText, openCreateModal, pomodoro, searchQuery, setSearchQuery } = useTasks()
  const [aiInput, setAiInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const navigate = useNavigate()

  const handleAiSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return

    setIsAiLoading(true)
    setTimeout(() => {
      addAiTaskFromText(aiInput.trim())
      setAiInput('')
      setIsAiLoading(false)
    }, 400)
  }

  // Format today date in Vietnamese
  const todayFormatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(new Date())

  // Format Pomodoro MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6">
      {/* Left: Greeting & Date */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800">
              Xin chào, {user?.name || 'Hà Quang Minh'}
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
              Online
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 capitalize">
            <CalendarIcon className="w-3 h-3 text-slate-400" />
            {todayFormatted}
          </p>
        </div>
      </div>

      {/* Center: AI Quick-Add Natural Language Bar */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <form onSubmit={handleAiSubmit} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Sparkles className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="AI Quick Add: Nhập 'Mai 14h họp đồ án với thầy, việc gấp'..."
            className="w-full pl-9 pr-24 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none placeholder:text-slate-400 text-slate-800 font-medium"
          />
          <button
            type="submit"
            disabled={isAiLoading || !aiInput.trim()}
            className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
          >
            {isAiLoading ? 'Đang tạo...' : 'AI Tạo Task'}
          </button>
        </form>
      </div>

      {/* Right: Search, Pomodoro status, Action button */}
      <div className="flex items-center gap-3">
        {/* Search Input for Mobile/Tablet */}
        <div className="relative md:w-44 lg:w-48 hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm việc..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none"
          />
        </div>

        {/* Pomodoro Indicator */}
        <button
          onClick={() => navigate('/pomodoro')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            pomodoro.isRunning
              ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title="Mở đồng hồ Pomodoro"
        >
          <Timer className={`w-3.5 h-3.5 ${pomodoro.isRunning ? 'text-rose-600' : 'text-slate-500'}`} />
          <span>{formatTime(pomodoro.timeLeft)}</span>
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          title="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* New Task Button */}
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm việc</span>
        </button>
      </div>
    </header>
  )
}
