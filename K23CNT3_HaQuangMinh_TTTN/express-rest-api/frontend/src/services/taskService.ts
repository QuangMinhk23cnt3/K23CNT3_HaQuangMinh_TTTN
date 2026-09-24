import api from './api'
import type { Task, ProductivityStats } from '../types/task'

const FOCUS_STATS_KEY = 'taskai_focus_stats'

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await api.get('/tasks')
      return res.data.data
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      return []
    }
  },

  async addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const res = await api.post('/tasks', taskData)
    return res.data.data
  },

  async updateTask(updatedTask: Task): Promise<void> {
    await api.put(`/tasks/${updatedTask.id}`, updatedTask)
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },

  async toggleSubtask(_taskId: string, subtaskId: string, task: Task): Promise<void> {
    const subtasks = task.subtasks.map(sub =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    )
    const updated = { ...task, subtasks }
    await this.updateTask(updated)
  },

  // Pomodoro stats can remain in local storage for simplicity, 
  // or they could also be moved to backend if a User/Stats schema exists.
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
    return { focusMinutesToday: 0, pomodoroSessionsToday: 0 }
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
