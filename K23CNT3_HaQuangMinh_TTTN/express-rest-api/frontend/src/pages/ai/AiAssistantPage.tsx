import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Plus,
  BrainCircuit
} from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'
import { useAuth } from '../../contexts/AuthContext'
import type { AiChatMessage, Task } from '../../types/task'
import { getAiChatResponseAsync } from '../../services/aiService'

export default function AiAssistantPage() {
  const { tasks, addTask } = useTasks()
  const { user } = useAuth()
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Xin chào ${user?.name || 'bạn'}! Tôi là **TaskAI Copilot** - Trợ lý AI Quản lý Công việc Cá nhân của bạn. 🤖✨\n\nTôi có thể giúp bạn:\n• **Lập kế hoạch công việc** theo tuần hoặc ngày\n• **Phân rã mục tiêu lớn** (như Báo cáo thực tập tốt nghiệp K23CNT3) thành các bước nhỏ dễ làm\n• **Phân tích ma trận Eisenhower** để xác định việc khẩn cấp & quan trọng\n• **Tạo task nhanh** trực tiếp từ câu lệnh bằng ngôn ngữ tự nhiên.\n\nHôm nay bạn muốn tôi đồng hành xử lý vấn đề gì?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: '🚀 Lập kế hoạch tuần này', prompt: 'Lập kế hoạch tuần này cho đồ án tốt nghiệp' },
        { label: '📊 Phân tích ma trận Eisenhower', prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại' },
        { label: '🎓 Gợi ý các bước hoàn thành đồ án TTTN', prompt: 'Gợi ý các bước hoàn thành đề tài tốt nghiệp' }
      ]
    }
  ])
  const [inputPrompt, setInputPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim()
    if (!query) return

    const userMsg: AiChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputPrompt('')
    setIsTyping(true)

    try {
      // Call real Gemini API
      const response = await getAiChatResponseAsync(query, tasks)
      const aiMsg: AiChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedTasks: response.suggestedTasks,
        actions: response.actions
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error: any) {
      const errorMsg: AiChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `❌ Không thể kết nối Gemini API: ${error?.message || 'Lỗi không xác định'}\n\nVui lòng kiểm tra lại kết nối mạng hoặc API key.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleAddSuggestedTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      await addTask({
        ...taskData,
        aiGenerated: true
      })
    } catch (error: any) {
      console.error(error)
      alert(`Có lỗi xảy ra khi thêm công việc đề xuất! Chi tiết: ${error?.response?.data?.message || error?.message || 'Không rõ nguyên nhân'}`)
    }
  }

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
      {/* AI Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                TaskAI Copilot
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sẵn sàng
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Trợ lý thông minh hỗ trợ phân tích năng suất và lập kế hoạch cá nhân
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Model: Gemini Flash Lite (Ultra-fast)</span>
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg) => {
          const isAi = msg.role === 'assistant'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                  isAi
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className="space-y-2 max-w-xl">
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                    isAi
                      ? 'bg-white border border-slate-200/80 text-slate-800'
                      : 'bg-indigo-600 text-white font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Suggested Tasks by AI (Click to import) */}
                {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      Công việc do AI đề xuất:
                    </p>
                    {msg.suggestedTasks.map((t, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-purple-200/80 bg-purple-50/60 p-3 flex items-center justify-between gap-3 shadow-2xs hover:bg-purple-50 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800">{t.title}</h4>
                          <p className="text-[11px] text-slate-500">{t.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-purple-700 font-medium pt-1">
                            <span>Hạn: {t.dueDate}</span>
                            <span>•</span>
                            <span>{t.subtasks.length} bước con</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddSuggestedTask(t)}
                          className="shrink-0 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm vào Task</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Prompt Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(act.prompt)}
                        className="rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700 px-3 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`text-[10px] text-slate-400 block ${
                    isAi ? 'text-left pl-1' : 'text-right pr-1'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl bg-white border border-slate-200/80 px-4 py-3 text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-medium text-slate-400">Trợ lý AI đang suy nghĩ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <div className="border-t border-slate-100 p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Nhập câu hỏi hoặc câu lệnh tự nhiên (VD: 'Hãy lên lịch ôn tập cho tôi')..."
              className="w-full rounded-2xl border border-slate-200 pl-4 pr-10 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <Sparkles className="absolute right-3.5 top-3.5 h-4 w-4 text-purple-400 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-2 text-[10px] text-center text-slate-400">
          Trợ lý AI TaskAI được hỗ trợ bởi Google Gemini Flash Lite — Tối ưu tốc độ cao và phản hồi tức thì
        </p>
      </div>
    </div>
  )
}
