import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}