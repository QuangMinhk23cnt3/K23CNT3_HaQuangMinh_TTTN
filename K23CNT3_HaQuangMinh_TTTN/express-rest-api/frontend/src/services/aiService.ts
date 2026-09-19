import type { Task, TaskPriority, TaskCategory } from '../types/task'

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

/**
 * Trợ lý AI: Bóc tách ngôn ngữ tự nhiên thành công việc có cấu trúc
 */
export function parseNaturalLanguageTask(input: string): ParsedTaskResult {
  const text = input.trim()
  const lower = text.toLowerCase()

  // 1. Phân tích Mức độ ưu tiên (Priority)
  let priority: TaskPriority = 'medium'
  if (lower.includes('gấp') || lower.includes('khẩn') || lower.includes('ngay lập tức') || lower.includes('asap') || lower.includes('hỏa tốc')) {
    priority = 'urgent'
  } else if (lower.includes('quan trọng') || lower.includes('ưu tiên cao') || lower.includes('high') || lower.includes('chú ý')) {
    priority = 'high'
  } else if (lower.includes('khi nào rảnh') || lower.includes('thấp') || lower.includes('low') || lower.includes('không vội')) {
    priority = 'low'
  }

  // 2. Phân tích Danh mục (Category)
  let category: TaskCategory = 'other'
  if (lower.includes('đồ án') || lower.includes('khóa luận') || lower.includes('báo cáo') || lower.includes('thực tập') || lower.includes('tttn')) {
    category = 'thesis'
  } else if (lower.includes('học') || lower.includes('ôn thi') || lower.includes('bài tập') || lower.includes('giảng viên') || lower.includes('thầy')) {
    category = 'study'
  } else if (lower.includes('công ty') || lower.includes('dự án') || lower.includes('khách') || lower.includes('meeting') || lower.includes('deadline')) {
    category = 'work'
  } else if (lower.includes('mua') || lower.includes('gia đình') || lower.includes('cá nhân') || lower.includes('tập thể dục') || lower.includes('chạy bộ')) {
    category = 'personal'
  }

  // 3. Phân tích Ngày đến hạn (Due Date)
  const today = new Date()
  let targetDate = new Date(today)
  let dueTime = '17:00'

  if (lower.includes('hôm nay') || lower.includes('today') || lower.includes('tối nay') || lower.includes('chiều nay')) {
    targetDate = new Date(today)
    if (lower.includes('tối nay')) dueTime = '21:00'
    if (lower.includes('chiều nay')) dueTime = '16:00'
  } else if (lower.includes('ngày mai') || lower.includes('mai') || lower.includes('tomorrow')) {
    targetDate.setDate(today.getDate() + 1)
  } else if (lower.includes('ngày kia') || lower.includes('mốt')) {
    targetDate.setDate(today.getDate() + 2)
  } else if (lower.includes('tuần tới') || lower.includes('tuần sau')) {
    targetDate.setDate(today.getDate() + 7)
  } else {
    // Thử trích xuất ngày dạng DD/MM hoặc DD-MM
    const dateMatch = text.match(/(\d{1,2})[/-](\d{1,2})/)
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10)
      const month = parseInt(dateMatch[2], 10) - 1
      targetDate = new Date(today.getFullYear(), month, day)
      if (targetDate < today) {
        targetDate.setFullYear(today.getFullYear() + 1)
      }
    } else {
      // Mặc định 2 ngày nữa nếu không chỉ định
      targetDate.setDate(today.getDate() + 2)
    }
  }

  // Trích xuất giờ (VD: 9h, 9h30, 14:00, 15h)
  const timeMatch = text.match(/(\d{1,2})(?:h|:)(\d{2})?/)
  if (timeMatch) {
    const hour = timeMatch[1].padStart(2, '0')
    const minute = timeMatch[2] || '00'
    dueTime = `${hour}:${minute}`
  }

  const dueDate = targetDate.toISOString().split('T')[0]

  // 4. Tags
  const tags: string[] = []
  if (category === 'thesis') tags.push('Đồ Án TTTN')
  if (category === 'study') tags.push('Học Tập')
  if (category === 'work') tags.push('Công Việc')
  if (priority === 'urgent') tags.push('Khẩn Cấp')
  if (lower.includes('meeting') || lower.includes('họp')) tags.push('Cuộc Họp')

  // 5. Gợi ý subtasks cơ bản
  const suggestedSubtasks = generateSuggestedSubtasks(text)

  return {
    title: text.replace(/^(hãy |tạo |thêm |nhắc |lên lịch )/i, ''),
    priority,
    category,
    dueDate,
    dueTime,
    tags,
    suggestedSubtasks
  }
}

/**
 * Trợ lý AI: Phân rã công việc phức tạp thành các bước checklist con (Subtasks)
 */
export function generateSuggestedSubtasks(taskTitle: string): string[] {
  const lower = taskTitle.toLowerCase()

  if (lower.includes('báo cáo') || lower.includes('thực tập') || lower.includes('đồ án')) {
    return [
      'Xây dựng đề cương chi tiết và danh mục mục lục',
      'Viết chương 1: Giới thiệu đề tài & khảo sát bài toán',
      'Viết chương 2: Cơ sở lý thuyết & công nghệ sử dụng',
      'Viết chương 3: Thiết kế cơ sở dữ liệu & kiến trúc hệ thống',
      'Viết chương 4: Cài đặt demo & đánh giá kết quả',
      'Gặp giảng viên hướng dẫn để xin nhận xét sửa đổi'
    ]
  }

  if (lower.includes('họp') || lower.includes('meeting')) {
    return [
      'Chuẩn bị slide trình chiếu nội dung',
      'Liệt kê danh sách các khó khăn cần giải đáp',
      'Ghi chép biên bản cuộc họp (Meeting Notes)',
      'Gửi email tổng kết hành động (Follow-up)'
    ]
  }

  if (lower.includes('frontend') || lower.includes('giao diện') || lower.includes('ui')) {
    return [
      'Thiết kế wireframe và mockup các màn hình chính',
      'Xây dựng các component dùng chung (Buttons, Cards, Modals)',
      'Tích hợp State Management và kết nối API backend',
      'Kiểm thử giao diện responsive trên desktop & mobile'
    ]
  }

  if (lower.includes('backend') || lower.includes('api') || lower.includes('database')) {
    return [
      'Thiết kế Schema Database (MongoDB / SQL)',
      'Viết các Route và Controller xử lý nghiệp vụ',
      'Viết Middleware xác thực JWT Authentication',
      'Viết tài liệu Swagger API documentation và test Postman'
    ]
  }

  if (lower.includes('ôn thi') || lower.includes('học')) {
    return [
      'Đọc lại giáo trình và slide bài giảng',
      'Làm bộ câu hỏi trắc nghiệm & đề thi các năm trước',
      'Ghi chú các công thức và khái niệm cốt lõi (Flashcards)',
      'Tổng kết lại phần kiến thức còn chưa vững'
    ]
  }

  // Mẫu mặc định chuẩn logic quản trị cá nhân
  return [
    'Xác định rõ kết quả đầu ra (Deliverables)',
    'Chuẩn bị dữ liệu và công cụ cần thiết',
    'Thực hiện giai đoạn 1: Triển khai khung sườn',
    'Rà soát, kiểm tra chất lượng trước khi hoàn thành'
  ]
}

/**
 * Trợ lý AI: Xử lý tin nhắn trò chuyện và đưa ra phản hồi thông minh
 */
export function getAiChatResponse(userMessage: string, currentTasks: Task[]): {
  reply: string
  suggestedTasks?: Array<Omit<Task, 'id' | 'createdAt'>>
  actions?: Array<{ label: string; prompt: string }>
} {
  const lower = userMessage.toLowerCase()

  // 1. Phân tích tổng quan / Lập kế hoạch tuần
  if (lower.includes('kế hoạch') || lower.includes('lập lịch') || lower.includes('tuần')) {
    const urgentCount = currentTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length
    const pendingCount = currentTasks.filter(t => t.status !== 'done').length

    return {
      reply: `Chào bạn! Tôi là Trợ lý AI TaskAI của bạn. 🎯\n\nHiện tại bạn đang có **${pendingCount} công việc chưa hoàn thành**, trong đó có **${urgentCount} việc khẩn cấp** cần ưu tiên xử lý ngay.\n\n💡 **Chiến lược tối ưu cho tuần này:**\n1. Áp dụng kỹ thuật **Time Boxing**: Dành 2 tiếng đầu buổi sáng (khung giờ vàng tập trung) cho các task Đồ án TTTN.\n2. Bật chế độ **Pomodoro** (25 phút tập trung / 5 phút nghỉ) để tránh mệt mỏi và duy trì nhịp độ liên tục.\n3. Chia nhỏ các báo cáo lớn thành các phần mục lục để giải quyết từng ngày.`,
      actions: [
        { label: '🔥 Xem việc khẩn cấp', prompt: 'Những việc khẩn cấp nhất của tôi là gì?' },
        { label: '📊 Phân tích ma trận Eisenhower', prompt: 'Phân tích ma trận Eisenhower cho các task hiện tại' },
        { label: '✨ Tạo lịch học đồ án', prompt: 'Gợi ý lịch học đồ án tốt nghiệp trong 3 ngày tới' }
      ]
    }
  }

  // 2. Phân tích ma trận Eisenhower
  if (lower.includes('eisenhower') || lower.includes('ma trận') || lower.includes('ưu tiên')) {
    const urgentImportant = currentTasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')
    const lowPriority = currentTasks.filter(t => t.priority === 'low' && t.status !== 'done')

    return {
      reply: `📊 **Phân tích Ma trận Eisenhower cho công việc của bạn:**\n\n` +
        `• **Góc I (Khẩn cấp & Quan trọng - Làm Ngay):** Có ${urgentImportant.length} công việc. Ví dụ: "${urgentImportant[0]?.title || 'Hoàn thành báo cáo TTTN'}" - Hãy giải quyết trước 12h trưa!\n` +
        `• **Góc II (Quan trọng nhưng Không khẩn cấp - Lên Lịch):** Các công việc dài hạn như ôn tập kiến thức, nghiên cứu tài liệu mới.\n` +
        `• **Góc III (Khẩn cấp nhưng Không quan trọng - Ủy quyền/Tối giản):** Các thông báo tin nhắn vặt hoặc việc phụ.\n` +
        `• **Góc IV (Không khẩn cấp & Không quan trọng - Loại bỏ):** Hiện có ${lowPriority.length} task độ ưu tiên thấp, bạn có thể hoãn lại sau.`,
      actions: [
        { label: '⚡ Bắt đầu Pomodoro ngay', prompt: 'Bắt đầu làm việc với Pomodoro' },
        { label: '➕ Gợi ý thêm việc cần làm', prompt: 'Tôi cần làm gì tiếp theo?' }
      ]
    }
  }

  // 3. Gợi ý đồ án tốt nghiệp
  if (lower.includes('đồ án') || lower.includes('tốt nghiệp') || lower.includes('thực tập')) {
    const today = new Date().toISOString().split('T')[0]
    return {
      reply: `🎓 Đối với đề tài **"XÂY DỰNG TRỢ LÝ AI QUẢN LÝ CÔNG VIỆC CÁ NHÂN"**, tôi đã tự động soạn thảo một lộ trình các đầu việc chuẩn để bạn đưa vào quản lý:`,
      suggestedTasks: [
        {
          title: 'Hoàn thiện giao diện Frontend React + Tailwind cho TaskAI',
          description: 'Xây dựng Dashboard, Kanban, Chat AI, và Pomodoro Timer',
          status: 'todo',
          priority: 'urgent',
          category: 'thesis',
          dueDate: today,
          dueTime: '18:00',
          subtasks: [
            { id: '1', title: 'Thiết kế Dashboard hiển thị thống kê', completed: true },
            { id: '2', title: 'Hoàn thiện Kanban kéo thả công việc', completed: false },
            { id: '3', title: 'Tích hợp Trợ lý AI và Pomodoro', completed: false }
          ],
          tags: ['Frontend', 'React', 'TaskAI']
        },
        {
          title: 'Soạn thảo Báo cáo thực tập Chương 3 & 4',
          description: 'Mô tả chi tiết kiến trúc công nghệ và kết quả thử nghiệm',
          status: 'todo',
          priority: 'high',
          category: 'thesis',
          dueDate: today,
          dueTime: '21:00',
          subtasks: [
            { id: '1', title: 'Vẽ sơ đồ kiến trúc hệ thống', completed: false },
            { id: '2', title: 'Chụp ảnh các màn hình chức năng', completed: false }
          ],
          tags: ['Báo Cáo', 'TTTN']
        }
      ]
    }
  }

  // Phản hồi mặc định thông minh
  return {
    reply: `Tôi đã ghi nhận yêu cầu của bạn! 🤖\n\nVới vai trò là **Trợ lý AI Quản lý công việc cá nhân**, tôi có thể giúp bạn:\n1. Tự động bóc tách ngôn ngữ tự nhiên thành công việc (Ví dụ nhập: *"Chiều mai 15h nộp slide báo cáo tốt nghiệp cho thầy, việc khẩn"*).\n2. Phân rã mục tiêu lớn thành các checklist nhỏ khả thi.\n3. Nhắc nhở deadline và tư vấn kỹ thuật tập trung Pomodoro.\n\nBạn muốn tôi hỗ trợ lập kế hoạch cho nội dung nào hôm nay?`,
    actions: [
      { label: '🚀 Lập kế hoạch hôm nay', prompt: 'Kế hoạch công việc hôm nay của tôi' },
      { label: '🎓 Gợi ý các bước làm đồ án TTTN', prompt: 'Gợi ý các bước hoàn thiện đề tài tốt nghiệp' },
      { label: '⏳ Cách tăng tập trung khi làm việc', prompt: 'Làm thế nào để duy trì sự tập trung cao độ?' }
    ]
  }
}
