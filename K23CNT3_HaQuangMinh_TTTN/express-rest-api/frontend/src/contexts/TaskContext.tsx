import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Task, TaskCategory, TaskPriority, TaskStatus, ProductivityStats, PomodoroState } from '../types/task'
import { taskService } from '../services/taskService'
import { parseNaturalLanguageTask } from '../services/aiService'

interface TaskContextType {
  tasks: Task[]
  filteredTasks: Task[]
  stats: ProductivityStats
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterCategory: TaskCategory | 'all'
  setFilterCategory: (cat: TaskCategory | 'all') => void
  filterPriority: TaskPriority | 'all'
  setFilterPriority: (priority: TaskPriority | 'all') => void
  filterStatus: TaskStatus | 'all'
  setFilterStatus: (status: TaskStatus | 'all') => void
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  changeTaskStatus: (id: string, newStatus: TaskStatus) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  addAiTaskFromText: (prompt: string) => Task
  // Modal state
  isTaskModalOpen: boolean
  editingTask: Task | null
  openCreateModal: (defaultCategory?: TaskCategory) => void
  openEditModal: (task: Task) => void
  closeTaskModal: () => void
  // Pomodoro
  pomodoro: PomodoroState
  startPomodoro: () => void
  pausePomodoro: () => void
  resetPomodoro: () => void
  switchPomodoroMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void
  selectPomodoroTask: (taskId: string | null) => void
  // Toast Alert
  toastMessage: string | null
  showToast: (msg: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const POMODORO_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Pomodoro Timer State
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    mode: 'work',
    timeLeft: POMODORO_TIMES.work,
    isRunning: false,
    currentTaskId: null,
    completedSessions: 2,
    totalFocusSeconds: 50 * 60
  })

  // Load initial tasks
  useEffect(() => {
    const loaded = taskService.getTasks()
    setTasks(loaded)
    const focus = taskService.getFocusStats()
    setPomodoro(prev => ({
      ...prev,
      completedSessions: focus.pomodoroSessionsToday,
      totalFocusSeconds: focus.focusMinutesToday * 60
    }))
  }, [])

  // Timer Tick Effect
  useEffect(() => {
    let interval: any = null
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          totalFocusSeconds: prev.mode === 'work' ? prev.totalFocusSeconds + 1 : prev.totalFocusSeconds
        }))
      }, 1000)
    } else if (pomodoro.timeLeft === 0 && pomodoro.isRunning) {
      // Completed session
      if (pomodoro.mode === 'work') {
        taskService.recordFocusSession(25)
        setPomodoro(prev => ({
          ...prev,
          isRunning: false,
          mode: 'shortBreak',
          timeLeft: POMODORO_TIMES.shortBreak,
          completedSessions: prev.completedSessions + 1
        }))
        showToast('🎉 Chúc mừng bạn đã hoàn thành 1 phiên Pomodoro tập trung!')
      } else {
        setPomodoro(prev => ({
          ...prev,
          isRunning: false,
          mode: 'work',
          timeLeft: POMODORO_TIMES.work
        }))
        showToast('⏰ Hết giờ nghỉ ngơi, hãy bắt đầu phiên làm việc mới nhé!')
      }
    }
    return () => clearInterval(interval)
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask = taskService.addTask(taskData)
    setTasks(prev => [newTask, ...prev])
    showToast(`Đã tạo công việc: "${newTask.title.slice(0, 30)}..."`)
    return newTask
  }

  const updateTask = (updated: Task) => {
    taskService.updateTask(updated)
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    showToast('Đã cập nhật công việc thành công')
  }

  const deleteTask = (id: string) => {
    taskService.deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    showToast('Đã xóa công việc')
  }

  const changeTaskStatus = (id: string, newStatus: TaskStatus) => {
    const target = tasks.find(t => t.id === id)
    if (!target) return
    const updated = { ...target, status: newStatus }
    updateTask(updated)
    if (newStatus === 'done') {
      showToast(`🏆 Tuyệt vời! Bạn vừa hoàn thành: "${target.title.slice(0, 25)}..."`)
    }
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    taskService.toggleSubtask(taskId, subtaskId)
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const subtasks = task.subtasks.map(sub =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
          return { ...task, subtasks }
        }
        return task
      })
    )
  }

  const addAiTaskFromText = (prompt: string): Task => {
    const parsed = parseNaturalLanguageTask(prompt)
    const subtasks = (parsed.suggestedSubtasks || []).map((title, idx) => ({
      id: `ai-sub-${Date.now()}-${idx}`,
      title,
      completed: false
    }))

    const newTask = addTask({
      title: parsed.title,
      description: `Được tạo tự động bởi Trợ lý AI từ câu lệnh: "${prompt}"`,
      status: 'todo',
      priority: parsed.priority,
      category: parsed.category,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime,
      subtasks,
      tags: parsed.tags,
      aiGenerated: true
    })

    showToast(`✨ Trợ lý AI đã tạo công việc: "${newTask.title}" với ${subtasks.length} bước gợi ý!`)
    return newTask
  }

  // Modal handlers
  const openCreateModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const closeTaskModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }

  // Pomodoro handlers
  const startPomodoro = () => setPomodoro(prev => ({ ...prev,指示: true, isRunning: true }))
  const pausePomodoro = () => setPomodoro(prev => ({ ...prev, isRunning: false }))
  const resetPomodoro = () =>
    setPomodoro(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: POMODORO_TIMES[prev.mode]
    }))

  const switchPomodoroMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
    setPomodoro(prev => ({
      ...prev,
      mode,
      isRunning: false,
      timeLeft: POMODORO_TIMES[mode]
    }))
  }

  const selectPomodoroTask = (taskId: string | null) => {
    setPomodoro(prev => ({ ...prev, currentTaskId: taskId }))
  }

  // Filtered Tasks Memo
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = task.title.toLowerCase().includes(q)
        const matchDesc = task.description?.toLowerCase().includes(q) || false
        const matchTag = task.tags.some(tag => tag.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchTag) return false
      }
      // Category
      if (filterCategory !== 'all' && task.category !== filterCategory) return false
      // Priority
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      // Status
      if (filterStatus !== 'all' && task.status !== filterStatus) return false

      return true
    })
  }, [tasks, searchQuery, filterCategory, filterPriority, filterStatus])

  // Calculated Stats Memo
  const stats = useMemo(() => {
    return taskService.calculateStats(tasks)
  }, [tasks])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        stats,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        filterPriority,
        setFilterPriority,
        filterStatus,
        setFilterStatus,
        addTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        toggleSubtask,
        addAiTaskFromText,
        isTaskModalOpen,
        editingTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        pomodoro,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        switchPomodoroMode,
        selectPomodoroTask,
        toastMessage,
        showToast
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
