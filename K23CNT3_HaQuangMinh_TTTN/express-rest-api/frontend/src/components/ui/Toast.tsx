import { CheckCircle } from 'lucide-react'
import { useTasks } from '../../contexts/TaskContext'

export default function Toast() {
  const { toastMessage } = useTasks()

  if (!toastMessage) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all">
      <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-slate-800 text-xs font-medium max-w-sm">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="leading-snug">{toastMessage}</span>
      </div>
    </div>
  )
}
