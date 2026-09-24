import api from './api'
import type { Task, TaskPriority, TaskCategory } from '../types/task'

// ─── Interfaces ─────────────────────────────────────────────
export interface ParsedTaskResult {
  title: string
  description?: string
  priority: TaskPriority
  category: TaskCategory
  dueDate: string
  dueTime?: string
  tags: string[]
  suggestedSubtasks?: string[]
}

export interface AiChatResponseResult {
  reply: string
  suggestedTasks?: Array<Omit<Task, 'id' | 'createdAt'>>
  actions?: Array<{ label: string; prompt: string }>
}

// ─── SYSTEM PROMPT ──────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là "TaskAI Copilot" — Trợ lý AI thông minh hỗ trợ sinh viên Việt Nam quản lý công việc cá nhân, lập kế hoạch đồ án tốt nghiệp, và tối ưu năng suất học tập.

Quy tắc:
1. Luôn trả lời bằng tiếng Việt.
2. Sử dụng markdown để định dạng câu trả lời (bold, bullet points, emoji).
3. Đưa ra lời khuyên cụ thể, thực tế và có thể hành động ngay.
4. Khi người dùng hỏi về lập kế hoạch, hãy chia thành các bước rõ ràng theo ngày.
5. Khi phân tích ma trận Eisenhower, hãy phân loại rõ 4 ô: Làm ngay / Lên lịch / Giao việc / Loại bỏ.
6. Luôn khuyến khích và động viên người dùng.
7. Giữ câu trả lời súc tích nhưng đầy đủ (không quá 300 từ).

Ngữ cảnh: Bạn đang hỗ trợ sinh viên K23CNT thực hiện đồ án thực tập tốt nghiệp.`

// ─── AI Chat via Backend API ────────────────────────────────
export async function getAiChatResponseAsync(
  userMessage: string,
  currentTasks: Task[]
): Promise<AiChatResponseResult> {
  try {
    // Build task context
    const pendingTasks = currentTasks.filter(t => t.status !== 'done')
    let taskContext = ''
    if (pendingTasks.length > 0) {
      taskContext = `\n\nDanh sách công việc hiện tại của người dùng (${pendingTasks.length} việc chưa hoàn thành):\n`
      pendingTasks.forEach((t, i) => {
        taskContext += `${i + 1}. "${t.title}" - Ưu tiên: ${t.priority} - Trạng thái: ${t.status} - Hạn: ${t.dueDate}\n`
      })
    }

    const fullPrompt = `${SYSTEM_PROMPT}${taskContext}\n\nNgười dùng hỏi: ${userMessage}`

    // Gọi backend API thay vì gọi Gemini trực tiếp từ browser
    const response = await api.post('/ai/suggest', { prompt: fullPrompt }, { timeout: 30000 })
    const reply = response.data?.data || 'Không nhận được phản hồi từ AI.'

    // Generate contextual action suggestions
    const actions = generateSmartActions(userMessage)

    return { reply, actions }
  } catch (error: any) {
    console.error('AI API Error:', error?.response?.data || error.message)
    // Fallback to offline response
    return getOfflineChatResponse(userMessage, currentTasks)
  }
}

// ─── Smart action suggestions based on context ─────────────
function generateSmartActions(
  userMessage: string
): Array<{ label: string; prompt: string }> {
  const lower = userMessage.toLowerCase()
  const actions: Array<{ label: string; prompt: string }> = []

  if (lower.includes('kế hoạch') || lower.includes('tuần')) {
    actions.push({
      label: '📊 Phân tích Eisenhower',
      prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại'
    })
    actions.push({
      label: '🎯 Chia nhỏ mục tiêu',
      prompt: 'Hãy chia nhỏ mục tiêu lớn nhất thành các bước cụ thể'
    })
  } else if (lower.includes('eisenhower') || lower.includes('ma trận')) {
    actions.push({
      label: '🚀 Lập kế hoạch tuần',
      prompt: 'Lập kế hoạch tuần này cho đồ án tốt nghiệp'
    })
  } else if (lower.includes('đồ án') || lower.includes('tốt nghiệp')) {
    actions.push({
      label: '📋 Gợi ý các bước hoàn thành',
      prompt: 'Gợi ý các bước hoàn thành đồ án tốt nghiệp'
    })
    actions.push({
      label: '🗓️ Lập timeline',
      prompt: 'Lập timeline chi tiết cho đồ án tốt nghiệp trong 2 tháng tới'
    })
  } else {
    actions.push({
      label: '🚀 Lập kế hoạch tuần',
      prompt: 'Lập kế hoạch tuần này cho đồ án tốt nghiệp'
    })
    actions.push({
      label: '📊 Phân tích Eisenhower',
      prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại'
    })
  }

  return actions
}

// ─── Offline fallback ───────────────────────────────────────
function getOfflineChatResponse(
  userMessage: string,
  currentTasks: Task[]
): AiChatResponseResult {
  const lower = userMessage.toLowerCase()
  const pendingTasks = currentTasks.filter(t => t.status !== 'done')
  const pendingCount = pendingTasks.length

  if (lower.includes('lập kế hoạch tuần') || lower.includes('tuần này')) {
    return {
      reply: `⚠️ *Đang ở chế độ offline — không thể kết nối Gemini API.*\n\nDưới đây là gợi ý cơ bản cho kế hoạch tuần:\n\n- **Thứ 2 - Thứ 3:** Hoàn thành khảo sát và thu thập tài liệu.\n- **Thứ 4 - Thứ 5:** Xây dựng khung báo cáo và viết Chương 1.\n- **Thứ 6:** Họp nhóm hoặc review lại tiến độ với GVHD.\n- **Cuối tuần:** Chỉnh sửa và nghỉ ngơi.`,
      suggestedTasks: [
        {
          title: 'Thu thập tài liệu tham khảo',
          description: 'Tìm kiếm 5-10 tài liệu liên quan đến đề tài',
          priority: 'high',
          category: 'thesis',
          status: 'todo',
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: '18:00',
          tags: ['Tài liệu', 'Khảo sát'],
          subtasks: [
            { id: '1', title: 'Tìm trên Google Scholar', completed: false },
            { id: '2', title: 'Đọc tóm tắt và đánh giá', completed: false }
          ],
          aiGenerated: true
        }
      ],
      actions: [
        {
          label: '📊 Phân tích Eisenhower',
          prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại'
        }
      ]
    }
  }

  if (lower.includes('eisenhower') || lower.includes('ma trận')) {
    const urgentHigh = pendingTasks.filter(
      t => t.priority === 'urgent' || t.priority === 'high'
    ).length
    const low = pendingTasks.filter(t => t.priority === 'low').length

    return {
      reply: `⚠️ *Chế độ offline*\n\n**Phân tích Ma trận Eisenhower cho ${pendingCount} công việc hiện tại:**\n\n🔴 **Quan trọng & Khẩn cấp (Làm ngay):** ${urgentHigh} việc.\n🔵 **Quan trọng nhưng Không khẩn cấp (Lên lịch):** Cần phân bổ thời gian hợp lý.\n🟡 **Khẩn cấp nhưng Không quan trọng (Giao việc):** Cố gắng tự động hóa.\n🟢 **Không quan trọng & Không khẩn cấp:** ${low > 0 ? `${low} việc, hãy cân nhắc bỏ qua.` : 'Rất tốt!'}`,
      actions: [
        {
          label: '🚀 Lập kế hoạch tuần',
          prompt: 'Lập kế hoạch tuần này cho đồ án tốt nghiệp'
        }
      ]
    }
  }

  return {
    reply: `⚠️ *Không kết nối được Gemini API. Đang dùng chế độ offline.*\n\nHiện tại bạn có ${pendingCount} việc chưa hoàn thành. Hãy kiểm tra lại API key và thử lại!`,
    actions: [
      {
        label: '🚀 Lập kế hoạch tuần',
        prompt: 'Lập kế hoạch tuần này cho đồ án tốt nghiệp'
      },
      {
        label: '📊 Phân tích Eisenhower',
        prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại'
      }
    ]
  }
}

// ─── Natural Language Task Parser via Backend AI ────────────
export async function parseNaturalLanguageTaskAsync(
  input: string
): Promise<ParsedTaskResult> {
  try {
    const prompt = `Bạn là AI phân tích câu lệnh tự nhiên thành task. Phân tích câu sau và trả về JSON (KHÔNG bọc trong markdown code block):
{
  "title": "tiêu đề task",
  "description": "mô tả chi tiết (nếu có)",
  "priority": "urgent|high|medium|low",
  "category": "thesis|study|work|personal|other",
  "dueDate": "YYYY-MM-DD",
  "dueTime": "HH:mm",
  "tags": ["tag1", "tag2"],
  "suggestedSubtasks": ["bước 1", "bước 2"]
}

Ngày hôm nay: ${new Date().toISOString().split('T')[0]}
Câu lệnh: "${input}"

Trả về CHỈ JSON, không có gì khác.`

    const response = await api.post('/ai/suggest', { prompt })
    const text = (response.data?.data || '').trim()

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || input,
        description: parsed.description,
        priority: parsed.priority || 'medium',
        category: parsed.category || 'other',
        dueDate: parsed.dueDate || new Date().toISOString().split('T')[0],
        dueTime: parsed.dueTime || '17:00',
        tags: parsed.tags || ['AI Auto'],
        suggestedSubtasks: parsed.suggestedSubtasks
      }
    }
    throw new Error('Cannot parse JSON from response')
  } catch {
    // Fallback to local parsing
    return parseNaturalLanguageTask(input)
  }
}

// ─── Local fallback parser ──────────────────────────────────
export function parseNaturalLanguageTask(input: string): ParsedTaskResult {
  const text = input.trim()
  const lower = text.toLowerCase()

  let priority: TaskPriority = 'medium'
  if (
    lower.includes('gấp') ||
    lower.includes('khẩn') ||
    lower.includes('ngay lập tức')
  )
    priority = 'urgent'
  else if (lower.includes('quan trọng') || lower.includes('cao'))
    priority = 'high'
  else if (lower.includes('rảnh') || lower.includes('thấp')) priority = 'low'

  let category: TaskCategory = 'other'
  if (lower.includes('đồ án') || lower.includes('báo cáo')) category = 'thesis'
  else if (lower.includes('học') || lower.includes('thi')) category = 'study'

  const today = new Date()
  const targetDate = new Date(today)

  if (lower.includes('ngày mai') || lower.includes('mai')) {
    targetDate.setDate(today.getDate() + 1)
  }

  return {
    title: text.replace(/^(hãy |tạo |thêm )/i, ''),
    priority,
    category,
    dueDate: targetDate.toISOString().split('T')[0],
    dueTime: '17:00',
    tags: ['AI Auto'],
    suggestedSubtasks: generateSuggestedSubtasks(text)
  }
}

// ─── Local subtask generator ────────────────────────────────
export function generateSuggestedSubtasks(taskTitle: string): string[] {
  const lower = taskTitle.toLowerCase()
  if (lower.includes('báo cáo') || lower.includes('đồ án')) {
    return [
      'Viết đề cương',
      'Làm chương 1',
      'Nộp cho giảng viên kiểm tra'
    ]
  }
  return [
    'Phân tích yêu cầu',
    'Bắt đầu triển khai',
    'Kiểm tra lại kết quả'
  ]
}

// ─── Legacy sync wrapper (for backwards compatibility) ──────
export function getAiChatResponse(
  userMessage: string,
  currentTasks: Task[]
): AiChatResponseResult {
  return getOfflineChatResponse(userMessage, currentTasks)
}
