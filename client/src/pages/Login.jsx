import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CheckSquare, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Alert from '../components/Alert'

function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await login({ email: form.email, password: form.password })
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left panel - marketing side */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary-600 to-indigo-700 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Task<span className="text-indigo-100">Flow</span></span>
        </Link>
        <div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
            Welcome back to your project workspace.
          </h1>
          <p className="mb-8 max-w-md text-lg text-indigo-100">
            Log in to manage your projects, collaborate with your team, and keep everything on track.
          </p>
          <div className="flex flex-col gap-3">
            {['Track project progress in real time', 'Collaborate with your team effortlessly', 'Stay on top of deadlines and priorities'].map((text) => (
              <div key={text} className="flex items-center gap-3 text-indigo-100">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">✓</span>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-indigo-200">© {new Date().getFullYear()} TaskFlow</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">Task<span className="text-primary-600">Flow</span></span>
            </Link>
          </div>
          <h2 className="mb-1 text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mb-8 text-slate-500">Enter your credentials to access your account</p>

          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Demo accounts</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm({ email: 'sarah@taskflow.app', password: 'password123', })}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-primary-50"
              >
                sarah@taskflow.app
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: 'jordan@taskflow.app', password: 'password123' })}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-primary-50"
              >
                jordan@taskflow.app
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
