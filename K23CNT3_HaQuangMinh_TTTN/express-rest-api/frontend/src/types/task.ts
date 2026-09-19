export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export type TaskCategory = 'thesis' | 'study' | 'work' | 'personal' | 'other'

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate: string // YYYY-MM-DD
  dueTime?: string // HH:mm
  subtasks: SubTask[]
  estimatedMinutes?: number
  tags: string[]
  aiGenerated?: boolean
  createdAt: string
  updatedAt?: string
}

export interface AiChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  suggestedTasks?: Array<Omit<Task, 'id' | 'createdAt'>>
  actions?: Array<{
    label: string
    prompt: string
  }>
}

export interface PomodoroState {
  mode: 'work' | 'shortBreak' | 'longBreak'
  timeLeft: number // in seconds
  isRunning: boolean
  currentTaskId: string | null
  completedSessions: number
  totalFocusSeconds: number
}

export interface ProductivityStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  completionRate: number
  focusMinutesToday: number
  pomodoroSessionsToday: number
}
