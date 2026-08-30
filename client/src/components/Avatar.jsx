import React from 'react'
import { getInitials, avatarColor } from '../utils/format'

const Avatar = ({ user, size = 'md', showName = false, showTooltip = false }) => {
  const name = user?.name || user?.email?.split('@')[0] || 'User'
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-16 w-16 text-xl',
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${avatarColor(
          name
        )} ${sizes[size] || sizes.md}`}
        title={showTooltip ? name : undefined}
      >
        {getInitials(name)}
      </div>
      {showName && <span className="text-sm font-medium text-slate-700">{name}</span>}
    </div>
  )
}

export default Avatar
