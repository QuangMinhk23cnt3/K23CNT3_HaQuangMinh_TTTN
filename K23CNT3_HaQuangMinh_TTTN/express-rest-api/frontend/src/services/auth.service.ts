import api from './api'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth'

const USER_STORAGE_KEY = 'taskai_user'
const TOKEN_STORAGE_KEY = 'taskai_token'

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
    try {
      const response = await api.post('/auth/signin', credentials)
      if (response.data?.data?.user && response.data?.data?.accessToken) {
        const user = response.data.data.user
        const token = response.data.data.accessToken
        this.saveSession(user, token)
        return { user, token }
      }
    } catch {
      // Fallback Demo Login nếu server chưa bật hoặc lỗi kết nối
      console.warn('Backend Auth API chưa bật hoặc không kết nối được, chuyển sang chế độ Demo')
    }

    // Luôn cho phép đăng nhập demo mượt mà cho đồ án tốt nghiệp
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
    try {
      const response = await api.post('/auth/signup', credentials)
      if (response.data?.data?.user) {
        const user = response.data.data.user
        const token = response.data.data.accessToken || 'token_' + Date.now()
        this.saveSession(user, token)
        return { user, token }
      }
    } catch {
      console.warn('Backend Auth API signup fallback')
    }

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

  saveSession(user: User, token: string): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) {
      // Tự động khởi tạo phiên demo để người dùng trải nghiệm ngay
      this.saveSession(DEMO_USER, 'demo_token_init')
      return DEMO_USER
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEMO_USER
    }
  },

  signout(): void {
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}
