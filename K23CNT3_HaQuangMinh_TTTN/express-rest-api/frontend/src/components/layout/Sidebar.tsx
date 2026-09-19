import { NavLink } from 'react-router-dom'
import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  Timer,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  BrainCircuit
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTasks } from '../../contexts/TaskContext'

interface NavItem {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
  badge?: string
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { stats, pomodoro } = useTasks()

  const navItems: NavItem[] = [
    { label: 'Tổng quan', path: '/', icon: LayoutDashboard },
    { label: 'Quản lý công việc', path: '/tasks', icon: CheckSquare, badge: stats.inProgressTasks > 0 ? `${stats.inProgressTasks}` : undefined },
    { label: 'Trợ lý AI TaskAI', path: '/ai-assistant', icon: Sparkles, badge: 'AI' },
    { label: 'Lịch biểu', path: '/calendar', icon: Calendar },
    { label: 'Tập trung Pomodoro', path: '/pomodoro', icon: Timer, badge: pomodoro.isRunning ? 'Running' : undefined },
    { label: 'Thống kê năng suất', path: '/analytics', icon: BarChart3 },
    { label: 'Cài đặt hệ thống', path: '/settings', icon: Settings },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                TaskAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Trợ Lý AI Cá Nhân</p>
          </div>
        </NavLink>
      </div>

      {/* Daily Progress Widget Mini */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/70">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span className="flex items-center gap-1 text-indigo-700">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Tiến độ hôm nay
          </span>
          <span className="text-indigo-600">{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500">
          Đã xong {stats.completedTasks}/{stats.totalTasks} việc • {Math.round(pomodoro.totalFocusSeconds / 60)}p tập trung
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Chức năng chính
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge === 'AI'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'QM'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.name || 'Hà Quang Minh'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.email || 'minh.hq@k23cnt3.edu.vn'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Đăng xuất"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-center text-slate-400 font-medium">
          Đề tài TTTN - K23CNT3 © 2026
        </p>
      </div>
    </aside>
  )
}
