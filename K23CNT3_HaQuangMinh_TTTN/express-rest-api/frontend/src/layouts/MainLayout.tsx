import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import TaskModal from '../components/tasks/TaskModal'
import Toast from '../components/ui/Toast'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Task Modal */}
      <TaskModal />

      {/* Global Toast Alert */}
      <Toast />
    </div>
  )
}