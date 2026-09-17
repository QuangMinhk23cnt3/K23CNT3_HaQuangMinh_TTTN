import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Tổng quan',          path: '/dashboard', icon: '📊' },
  { label: 'Người dùng',         path: '/users',     icon: '👤' },
  { label: 'Học sinh',           path: '/students',  icon: '🎓' },
  { label: 'Giáo viên',          path: '/teachers',  icon: '👨‍🏫' },
  { label: 'Khóa học',           path: '/courses',   icon: '📚' },
  { label: 'Lớp học',            path: '/classes',   icon: '🏫' },
  { label: 'Thanh toán',         path: '/payments',  icon: '💳' },
  { label: 'Leads',              path: '/leads',     icon: '📋' },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-blue-600">DeepCode</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-4">
        <p className="text-xs text-gray-400">© 2026 DeepCode</p>
      </div>
    </aside>
  )
}
