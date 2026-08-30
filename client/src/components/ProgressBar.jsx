import React from 'react'

const ProgressBar = ({ progress = 0, size = 'md', showLabel = false, color = 'bg-primary-600' }) => {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const safeProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${heights[size] || heights.md}`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
