import React, { createContext, useState, useContext, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const toastStyles = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    border: 'border-red-200',
    bg: 'bg-red-50',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), duration)
    },
    [removeToast]
  )

  const success = useCallback((m) => showToast(m, 'success'), [showToast])
  const error = useCallback((m) => showToast(m, 'error', 5000), [showToast])
  const info = useCallback((m) => showToast(m, 'info'), [showToast])
  const warning = useCallback((m) => showToast(m, 'warning'), [showToast])

  return (
    <ToastContext.Provider value={{ toast: showToast, success, error, info, warning }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${style.border} ${style.bg} p-4 shadow-lg animate-slide-up`}
            >
              <div className="mt-0.5 shrink-0">{style.icon}</div>
              <p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
