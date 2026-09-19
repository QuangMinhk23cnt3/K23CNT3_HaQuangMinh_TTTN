import type { Task, ProductivityStats } from '../types/task'

const STORAGE_KEY = 'taskai_tasks'
const FOCUS_STATS_KEY = 'taskai_focus_stats'

// Dữ liệu mẫu khởi tạo chuẩn đề tài TTTN & quản lý cá nhân
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Xây dựng giao diện Frontend Trợ lý AI Quản lý công việc cá nhân',
    description: 'Thiết kế giao diện hiện đại React 19 + Tailwind CSS, tích hợp Kanban, AI Chat và Pomodoro',
    status: 'in_progress',
    priority: 'urgent',
    category: 'thesis',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    estimatedMinutes: 120,
    tags: ['TTTN', 'Frontend', 'React', 'AI'],
    aiGenerated: true,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Thiết kế Dashboard thống kê & AI Insights', completed: true },
      { id: 'sub-2', title: 'Hoàn thiện bảng Kanban kéo thả công việc', completed: true },
      { id: 'sub-3', title: 'Tích hợp Trợ lý AI Chat và Smart Quick-Add', completed: false },
      { id: 'sub-4', title: 'Tích hợp Pomodoro Focus Timer', completed: false },
    ]
  },
  {
    id: 'task-2',
    title: 'Viết Chương 3 Báo cáo thực tập tốt nghiệp (Thiết kế hệ thống)',
    description: 'Mô tả kiến trúc REST API Express, cơ sở dữ liệu MongoDB và các chức năng AI trợ lý',
    status: 'todo',
    priority: 'high',
    category: 'thesis',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '21:00',
    estimatedMinutes: 180,
    tags: ['Báo Cáo', 'Đồ Án', 'MongoDB'],
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-2-1', title: 'Vẽ sơ đồ luồng dữ liệu (DFD) & Use Case', completed: true },
      { id: 'sub-2-2', title: 'Thiết kế Schema User và Task trong MongoDB', completed: false },
      { id: 'sub-2-3', title: 'Viết tài liệu các API endpoints', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Họp với Giảng viên hướng dẫn để duyệt đề cương và báo cáo tuần',
    description: 'Báo cáo tiến độ hoàn thành các module chức năng và xin ý kiến định hướng chấm điểm',
    status: 'todo',
    priority: 'high',
    category: 'study',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '09:00',
    estimatedMinutes: 60,
    tags: ['Họp', 'Giáo Viên', 'K23CNT3'],
    aiGenerated: true,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-3-1', title: 'Chuẩn bị slide thuyết trình demo sản phẩm', completed: false },
      { id: 'sub-3-2', title: 'Ghi chú các câu hỏi về thuật toán AI', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Kiểm thử kết nối API xác thực người dùng (Auth API)',
    description: 'Kiểm tra luồng Đăng ký, Đăng nhập, JWT Token và bảo mật mật khẩu bcrypt',
    status: 'done',
    priority: 'medium',
    category: 'work',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '15:30',
    estimatedMinutes: 45,
    tags: ['Backend', 'Auth', 'JWT'],
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-4-1', title: 'Test API Signin qua Postman', completed: true },
      { id: 'sub-4-2', title: 'Xử lý lưu JWT token vào LocalStorage an toàn', completed: true }
    ]
  },
  {
    id: 'task-5',
    title: 'Tập thể dục 30 phút buổi chiều để nạp lại năng lượng',
    description: 'Chạy bộ nhẹ hoặc tập cardio để duy trì sức khỏe thể chất trong mùa làm đồ án',
    status: 'todo',
    priority: 'low',
    category: 'personal',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:30',
    estimatedMinutes: 30,
    tags: ['Sức Khỏe', 'Cá Nhân'],
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    subtasks: []
  }
]

export const taskService = {
  getTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS))
      return INITIAL_TASKS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_TASKS
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasks()
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newTask, ...tasks]
    this.saveTasks(updated)
    return newTask
  },

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks()
    const updated = tasks.map(t => (t.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : t))
    this.saveTasks(updated)
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks()
    const updated = tasks.filter(t => t.id !== id)
    this.saveTasks(updated)
  },

  toggleSubtask(taskId: string, subtaskId: string): void {
    const tasks = this.getTasks()
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        const subtasks = task.subtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        )
        return { ...task, subtasks }
      }
      return task
    })
    this.saveTasks(updated)
  },

  getFocusStats(): { focusMinutesToday: number; pomodoroSessionsToday: number } {
    const todayStr = new Date().toISOString().split('T')[0]
    const raw = localStorage.getItem(FOCUS_STATS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.date === todayStr) {
          return {
            focusMinutesToday: parsed.focusMinutesToday || 0,
            pomodoroSessionsToday: parsed.pomodoroSessionsToday || 0
          }
        }
      } catch {
        // ignore
      }
    }
    return { focusMinutesToday: 50, pomodoroSessionsToday: 2 } // Mock ban đầu sinh động
  },

  recordFocusSession(minutes: number): void {
    const todayStr = new Date().toISOString().split('T')[0]
    const current = this.getFocusStats()
    const updated = {
      date: todayStr,
      focusMinutesToday: current.focusMinutesToday + minutes,
      pomodoroSessionsToday: current.pomodoroSessionsToday + 1
    }
    localStorage.setItem(FOCUS_STATS_KEY, JSON.stringify(updated))
  },

  calculateStats(tasks: Task[]): ProductivityStats {
    const todayStr = new Date().toISOString().split('T')[0]
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const overdueTasks = tasks.filter(t => t.dueDate < todayStr && t.status !== 'done').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const focus = this.getFocusStats()

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      focusMinutesToday: focus.focusMinutesToday,
      pomodoroSessionsToday: focus.pomodoroSessionsToday
    }
  }
}
