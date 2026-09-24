import api from './api'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth'

const USER_STORAGE_KEY = 'taskai_user'
const TOKEN_STORAGE_KEY = 'taskai_token'
const REFRESH_TOKEN_KEY = 'taskai_refresh_token'

// Kiểm tra có bật chế độ demo không (khi backend chưa sẵn sàng)
const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Tài khoản demo mặc định cho sinh viên Hà Quang Minh - K23CNT3
const DEMO_USER: User = {
  id: 'user-demo-1',
  name: 'Hà Quang Minh',
  email: 'minh.hq@k23cnt3.edu.vn',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: new Date().toISOString()
}

export const authService = {
  async signin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Thử gọi API thật trước
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/auth/signin', credentials)
        if (response.data?.data?.user && response.data?.data?.accessToken) {
          const user = response.data.data.user
          const token = response.data.data.accessToken
          const refreshToken = response.data.data.refreshToken
          this.saveSession(user, token, refreshToken)
          return { user, token }
        }
      } catch (err: any) {
        // Nếu không phải demo mode → throw lỗi thật
        throw err
      }
    }

    // Demo mode: cho phép đăng nhập demo mượt mà cho đồ án tốt nghiệp
    const user: User = {
      ...DEMO_USER,
      email: credentials.email || DEMO_USER.email,
      name: credentials.email.includes('minh') ? 'Hà Quang Minh' : 'Người dùng TaskAI'
    }
    const token = 'demo_jwt_token_' + Date.now()
    this.saveSession(user, token)
    return { user, token }
  },

  async signup(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/auth/signup', credentials)
        if (response.data?.data) {
          const data = response.data.data
          const user: User = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: 'user',
            createdAt: new Date().toISOString()
          }
          // Signup thường yêu cầu verify email trước, không có token
          return { user, token: '' }
        }
      } catch (err: any) {
        throw err
      }
    }

    // Demo mode fallback
    const user: User = {
      id: 'user-' + Date.now(),
      name: credentials.name,
      email: credentials.email,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    const token = 'jwt_token_' + Date.now()
    this.saveSession(user, token)
    return { user, token }
  },

  saveSession(user: User, token: string, refreshToken?: string): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) {
      // Chỉ tự động tạo demo session nếu đang ở demo mode
      if (IS_DEMO_MODE) {
        this.saveSession(DEMO_USER, 'demo_token_init')
        return DEMO_USER
      }
      return null
    }
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  async signout(): Promise<void> {
    // Gọi API signout để invalidate refresh token ở server
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (token && !token.startsWith('demo_')) {
        await api.post('/auth/signout')
      }
    } catch {
      // Ignore errors — vẫn cleanup local dù API fail
      console.warn('Không thể gọi API signout, cleanup local session.')
    }

    // Cleanup local storage
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}
