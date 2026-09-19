export interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
  createdAt?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data?: {
    user: User
    accessToken: string
    refreshToken?: string
  }
  token?: string
  user?: User
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password?: string
  confirmPassword?: string
}
