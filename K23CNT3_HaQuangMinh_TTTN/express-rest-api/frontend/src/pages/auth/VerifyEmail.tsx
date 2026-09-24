import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'
import api from '../../services/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      setMessage('Không tìm thấy token xác thực trong URL.')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token })
        setStatus('success')
        setMessage(res.data?.message || 'Email đã được xác thực thành công!')
      } catch (err: any) {
        setStatus('error')
        setMessage(
          err?.response?.data?.message ||
          'Token xác thực không hợp lệ hoặc đã hết hạn.'
        )
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-600 font-medium">
            Đang xác thực email của bạn...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Xác thực thành công!
          </h2>
          <p className="text-sm text-slate-600">{message}</p>
          <Link
            to="/auth/login"
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {(status === 'error' || status === 'no-token') && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Xác thực thất bại
          </h2>
          <p className="text-sm text-slate-600">{message}</p>
          <div className="flex gap-3 mt-4">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Đăng ký lại
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
