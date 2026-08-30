import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckSquare, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Alert from '../components/Alert'

function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Task<span className="text-primary-600">Flow</span></span>
          </Link>
          <h2 className="mb-1 text-3xl font-bold text-slate-900">Create your account</h2>
          <p className="mb-8 text-slate-500">Get started with TaskFlow in less than a minute</p>

          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="input"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
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
                  autoComplete="new-password"
                  className="input pr-12"
                  placeholder="At least 6 characters"
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
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right marketing panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-700 to-primary-600 p-12 lg:flex">
        <div />
        <div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
            Join thousands of teams that manage projects smarter.
          </h1>
          <p className="mb-8 max-w-md text-lg text-indigo-100">
            Create your free account and start organizing your next big project in minutes.
          </p>
          <div className="flex flex-col gap-3">
            {['Free to get started', 'Create unlimited projects', 'Manage tasks with kanban boards', 'Track progress automatically'].map((text) => (
              <div key={text} className="flex items-center gap-3 text-indigo-100">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">✓</span>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-indigo-200">© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Register
