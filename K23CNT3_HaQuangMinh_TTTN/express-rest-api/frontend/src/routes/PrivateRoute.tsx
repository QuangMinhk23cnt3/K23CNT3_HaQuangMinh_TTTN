import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
}

/**
 * Component bảo vệ route — redirect về login nếu chưa đăng nhập.
 * Lưu lại đường dẫn hiện tại để sau khi login xong redirect về đúng trang.
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Đang tải trạng thái auth → hiện loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang xác thực...</p>
        </div>
      </div>
    )
  }

  // Chưa đăng nhập → redirect về login, lưu lại path hiện tại
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
