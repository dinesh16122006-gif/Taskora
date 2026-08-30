import React from 'react'
import { Loader2 } from 'lucide-react'

export const Spinner = ({ size = 6, color = 'text-primary-600' }) => (
  <Loader2 className={`h-${size} w-${size} animate-spin ${color}`} />
)

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24">
    <Spinner size={8} />
    <span className="text-sm text-slate-500">{message}</span>
  </div>
)

export const ButtonLoader = () => <Spinner size={4} color="text-white" />

export default Spinner
