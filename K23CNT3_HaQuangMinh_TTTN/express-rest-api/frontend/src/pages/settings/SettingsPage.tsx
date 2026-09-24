import { useState } from 'react'
import {
  Settings,
  User,
  Sparkles,
  RotateCcw,
  Save
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTasks } from '../../contexts/TaskContext'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useTasks()

  const [name, setName] = useState(user?.name || 'Hà Quang Minh')
  const [email, setEmail] = useState(user?.email || 'minh.hq@k23cnt3.edu.vn')
  const [className, setClassName] = useState(user?.className || 'K23CNT3 - Khóa 23 Công Nghệ Thông Tin')
  const [thesisTitle, setThesisTitle] = useState(user?.thesisTitle || 'XÂY DỰNG TRỢ LÝ AI QUẢN LÝ CÔNG VIỆC CÁ NHÂN')
  
  const [aiPersona, setAiPersona] = useState('motivational')
  const [autoSubtasks, setAutoSubtasks] = useState(true)
  const [dailyBriefing, setDailyBriefing] = useState(true)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email, className, thesisTitle })
    showToast('Đã lưu thông tin hồ sơ cá nhân thành công!')
  }

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục lại dữ liệu mẫu ban đầu của đề tài tốt nghiệp?')) {
      localStorage.removeItem('taskai_tasks')
      localStorage.removeItem('taskai_focus_stats')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Cài Đặt Hệ Thống & Hồ Sơ Cá Nhân
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tùy chỉnh thông tin sinh viên, cài đặt hành vi Trợ lý AI và quản lý dữ liệu
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Thông tin cá nhân hóa</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lớp / Khóa
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="VD: K23CNT3"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên đề tài / Dự án
                </label>
                <input
                  type="text"
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  placeholder="Nhập tên dự án cá nhân của bạn"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-indigo-700 font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all shadow-indigo-200"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Assistant Personality Settings */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Cấu hình Trợ lý AI Copilot</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Phong cách phản hồi của AI
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setAiPersona('motivational')}
                  className={`rounded-2xl border p-3.5 cursor-pointer flex flex-col justify-between transition-all ${
                    aiPersona === 'motivational'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-slate-900">Thúc đẩy & Động lực ✨</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Cổ vũ, truyền cảm hứng tích cực và giúp bạn vượt qua sự trì hoãn.
                  </span>
                </label>

                <label
                  onClick={() => setAiPersona('professional')}
                  className={`rounded-2xl border p-3.5 cursor-pointer flex flex-col justify-between transition-all ${
                    aiPersona === 'professional'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-slate-900">Chuyên nghiệp & Ngắn gọn 💼</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Đi thẳng vào trọng tâm, phân tích ma trận logic và deadline chính xác.
                  </span>
                </label>

                <label
                  onClick={() => setAiPersona('strict')}
                  className={`rounded-2xl border p-3.5 cursor-pointer flex flex-col justify-between transition-all ${
                    aiPersona === 'strict'
                      ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-600/20 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-slate-900">Nghiêm khắc & Kỷ luật ⏱️</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Cảnh báo sát sao các deadline trễ, thúc giục thực hiện Pomodoro ngay.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">Tự động kích hoạt AI Subtask Breakdown</p>
                  <p className="text-[11px] text-slate-500">Tự động gợi ý các bước nhỏ khi nhập câu lệnh tự nhiên</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSubtasks}
                  onChange={(e) => setAutoSubtasks(e.target.checked)}
                  className="rounded text-indigo-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">AI Daily Briefing buổi sáng</p>
                  <p className="text-[11px] text-slate-500">Hiển thị thông báo tóm tắt các việc quan trọng đầu ngày</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyBriefing}
                  onChange={(e) => setDailyBriefing(e.target.checked)}
                  className="rounded text-indigo-600 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Data Management & Demo Reset */}
        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-rose-800">
            <RotateCcw className="w-4 h-4" />
            <h2 className="text-sm font-bold">Khôi phục dữ liệu mẫu Đề tài</h2>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed mb-4">
            Nếu bạn đã thay đổi hoặc xóa bớt các dữ liệu demo, bạn có thể thiết lập lại danh sách công việc chuẩn của Đề tài tốt nghiệp K23CNT3.
          </p>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100/50 transition-colors shadow-2xs"
          >
            Khôi phục dữ liệu mẫu ban đầu
          </button>
        </div>
      </div>
    </div>
  )
}
