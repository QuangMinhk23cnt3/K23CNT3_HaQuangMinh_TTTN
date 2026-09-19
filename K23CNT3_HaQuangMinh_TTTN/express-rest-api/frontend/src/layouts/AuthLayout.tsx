import { Outlet, Link } from 'react-router-dom'
import { BrainCircuit, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left: Branding & Value Proposition */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                TaskAI
              </span>
            </Link>

            <div className="mt-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đề tài TTTN - K23CNT3</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-white">
                Trợ lý AI Quản lý Công việc Cá nhân
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tối ưu hóa năng suất, phân rã mục tiêu tự động và theo dõi tiến độ đồ án tốt nghiệp với sức mạnh trí tuệ nhân tạo.
              </p>
            </div>

            <div className="mt-8 space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bóc tách công việc từ ngôn ngữ tự nhiên thông minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tự động sinh checklist thực hiện (AI Task Breakdown)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Không gian tập trung Pomodoro & Phân tích ma trận</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-indigo-800/60 mt-8">
            <p className="text-xs text-slate-400">
              Sinh viên thực hiện: <span className="font-semibold text-white">Hà Quang Minh</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Lớp K23CNT3 • Khoa Công nghệ Thông tin
            </p>
          </div>
        </div>

        {/* Right: Auth Content Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
