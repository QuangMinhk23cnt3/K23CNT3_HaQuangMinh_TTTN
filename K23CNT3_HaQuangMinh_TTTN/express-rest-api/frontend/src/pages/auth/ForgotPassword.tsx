import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitted(true)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại đăng nhập</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Nhập địa chỉ email của bạn để nhận mã hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-emerald-900">Email đã được gửi!</h3>
          <p className="mt-1 text-xs text-emerald-700">
            Vui lòng kiểm tra hòm thư <span className="font-semibold">{email}</span> để làm theo hướng dẫn đặt lại mật khẩu.
          </p>
          <Link
            to="/auth/login"
            className="mt-4 inline-block text-xs font-bold text-indigo-600 hover:underline"
          >
            Đăng nhập lại
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email tài khoản</label>
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

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all hover:shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi mã khôi phục</span>
          </button>
        </form>
      )}
    </div>
  )
}
