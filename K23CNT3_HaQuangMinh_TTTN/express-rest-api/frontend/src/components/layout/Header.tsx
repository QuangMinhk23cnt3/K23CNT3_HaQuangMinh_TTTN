import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/': 'Tổng quan',
  '/dashboard': 'Tổng quan',
  '/users': 'Quản lý người dùng',
  '/students': 'Quản lý học sinh',
  '/teachers': 'Quản lý giáo viên',
  '/courses': 'Quản lý khóa học',
  '/classes': 'Quản lý lớp học',
  '/payments': 'Quản lý thanh toán',
  '/leads': 'Quản lý leads',
}

export default function Header() {
  const location = useLocation()
  const title = routeTitles[location.pathname] ?? 'Trang quản lý'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Xin chào,</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          A
        </div>
      </div>
    </header>
  )
}
