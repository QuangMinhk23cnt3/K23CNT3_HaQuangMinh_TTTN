import React, { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import api from '../../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Token reset mật khẩu không hợp lệ. Vui lòng thử lại từ email.')
      return
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      })
      setIsSuccess(true)
      setTimeout(() => navigate('/auth/login'), 3000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Thành công
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-sm text-slate-600">
            Mật khẩu đã được cập nhật. Bạn sẽ được chuyển về trang đăng nhập...
          </p>
          <Link
            to="/auth/login"
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Không có token
  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Liên kết không hợp lệ
          </h2>
          <p className="text-sm text-slate-600">
            Không tìm thấy token trong URL. Vui lòng kiểm tra lại email hoặc yêu cầu reset mật khẩu mới.
          </p>
          <Link
            to="/auth/forgot-password"
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Gửi lại yêu cầu reset
          </Link>
        </div>
      </div>
    )
  }

  // Form đặt lại mật khẩu
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Đặt lại mật khẩu
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Mật khẩu mới
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ít nhất 8 ký tự"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all hover:shadow-md disabled:opacity-50"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Nhớ mật khẩu rồi?{' '}
        <Link to="/auth/login" className="font-bold text-indigo-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
