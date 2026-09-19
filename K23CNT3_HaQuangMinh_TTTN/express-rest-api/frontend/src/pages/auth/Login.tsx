import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('minh.hq@k23cnt3.edu.vn')
  const [password, setPassword] = useState('12345678')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillDemo = () => {
    setEmail('minh.hq@k23cnt3.edu.vn')
    setPassword('12345678')
    setError(null)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Đăng nhập hệ thống
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Truy cập trợ lý AI và không gian quản lý công việc của bạn
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick 1-click Demo Account button */}
      <div className="mb-5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-900">Tài khoản Sinh viên Demo</p>
            <p className="text-[11px] text-purple-700">minh.hq@k23cnt3.edu.vn</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-bold text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs hover:bg-purple-100/50 transition-colors"
        >
          Điền mẫu
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700">Mật khẩu</label>
            <Link
              to="/auth/forgot-password"
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all hover:shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            'Đang xử lý...'
          ) : (
            <>
              <span>Đăng nhập ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="font-bold text-indigo-600 hover:underline">
          Đăng ký tài khoản mới
        </Link>
      </p>
    </div>
  )
}
