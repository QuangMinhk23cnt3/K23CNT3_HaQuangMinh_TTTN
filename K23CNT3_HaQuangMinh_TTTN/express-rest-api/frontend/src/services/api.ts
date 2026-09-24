import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3011/api"

const TOKEN_KEY = "taskai_token"
const REFRESH_TOKEN_KEY = "taskai_refresh_token"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request Interceptor: Attach access token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 with refresh token rotation
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu request đang ở endpoint refresh-token → logout luôn (tránh loop)
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        forceLogout()
        return Promise.reject(error)
      }

      // Nếu đang refresh → đợi trong queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (!refreshToken) {
        isRefreshing = false
        forceLogout()
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        })

        const newAccessToken = res.data?.data?.accessToken
        const newRefreshToken = res.data?.data?.refreshToken

        if (newAccessToken) {
          localStorage.setItem(TOKEN_KEY, newAccessToken)
          if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
          processQueue(null, newAccessToken)

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } else {
          processQueue(error, null)
          forceLogout()
          return Promise.reject(error)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function forceLogout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem("taskai_user")

  // Redirect to login if not already there
  if (!window.location.pathname.startsWith("/auth")) {
    window.location.href = "/auth/login"
  }
}

export default api