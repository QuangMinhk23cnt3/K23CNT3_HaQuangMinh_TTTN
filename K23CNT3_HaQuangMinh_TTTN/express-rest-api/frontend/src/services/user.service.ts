import api from './api'
import type { User } from '../types/auth'

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const res = await api.get('/users')
      return res.data?.data || []
    } catch {
      return []
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const res = await api.get(`/users/${id}`)
      return res.data?.data || null
    } catch {
      return null
    }
  }
}

export default userService
