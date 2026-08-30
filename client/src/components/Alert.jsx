import React from 'react'
import { AlertTriangle, XCircle, Info, X } from 'lucide-react'

const errorStyles = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <Info className="h-5 w-5 text-blue-500" /> },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <XCircle className="h-5 w-5 text-red-500" /> },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: <AlertTriangle className="h-5 w-5 text-amber-500" /> },
}

const Alert = ({ type = 'error', title, message, onClose }) => {
  const style = errorStyles[type] || errorStyles.error
  return (
    <div className={`flex items-start gap-3 rounded-lg border ${style.border} ${style.bg} p-4`}>
      <div className="mt-0.5 shrink-0">{style.icon}</div>
      <div className="flex-1">
        {title && <p className={`text-sm font-semibold ${style.text}`}>{title}</p>}
        {message && <p className={`text-sm ${style.text} ${title ? 'mt-0.5' : ''}`}>{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className={`shrink-0 rounded p-0.5 ${style.text} hover:opacity-70`}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
