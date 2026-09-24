import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { TaskProvider } from '../contexts/TaskContext'

// Route Guards
import PrivateRoute from './PrivateRoute'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Pages
import Dashboard from '../pages/dashboard/Dashboard'
import TasksPage from '../pages/tasks/TasksPage'
import AiAssistantPage from '../pages/ai/AiAssistantPage'
import CalendarPage from '../pages/calendar/CalendarPage'
import PomodoroPage from '../pages/focus/PomodoroPage'
import AnalyticsPage from '../pages/analytics/AnalyticsPage'
import SettingsPage from '../pages/settings/SettingsPage'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'
import ResetPassword from '../pages/auth/ResetPassword'

export default function AppRoutes() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Protected App Workspace Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="ai-assistant" element={<AiAssistantPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="pomodoro" element={<PomodoroPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Public Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* Legacy URL support — redirect /verify-email?token=... to /auth/verify-email */}
            <Route path="/verify-email" element={<Navigate to="/auth/verify-email" replace />} />
            <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}