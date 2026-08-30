import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckSquare,
  LayoutDashboard,
  FolderKanban,
  Trello,
  Target,
  Users,
  BarChart3,
  Bell,
  CalendarClock,
  Shield,
  Zap,
  Check,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description:
      'Organize projects with clear structure, priorities, and phases so nothing slips through the cracks.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Trello,
    title: 'Kanban Boards',
    description:
      'Visualize work with drag-and-drop kanban boards. Move tasks from To Do to Completed effortlessly.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Assign tasks to team members and stay aligned. Everyone knows exactly what to work on next.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Target,
    title: 'Progress Tracking',
    description:
      'Track task completion with automatic project progress bars and percentage indicators.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: CalendarClock,
    title: 'Deadline Management',
    description:
      'Never miss a deadline. Get notified about upcoming and overdue tasks so the team stays on schedule.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Insights & Analytics',
    description:
      'Understand your workload with beautiful charts showing tasks by status, priority, and completion.',
    color: 'bg-rose-50 text-rose-600',
  },
]

const benefits = [
  {
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Streamline workflows and reduce time spent on project admin and status updates.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'JWT authentication with encrypted passwords keeps your project data safe.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Automated alerts for task assignments, deadlines, and project updates.',
  },
]

const stats = [
  { value: '24/7', label: 'Availability' },
  { value: '100%', label: 'Cloud Hosted' },
  { value: '4', label: 'Task Stages' },
  { value: '15+', label: 'Fields' },
]

function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Task<span className="text-primary-600">Flow</span>
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-slate-900">Benefits</a>
            <a href="#how" className="text-sm font-medium text-slate-600 hover:text-slate-900">How it works</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <button onClick={handleGetStarted} className="btn-primary">
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-slate-700 md:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <a href="#features" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Features</a>
              <a href="#benefits" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Benefits</a>
              <a href="#how" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">How it works</a>
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary">Login</Link>
                    <button onClick={handleGetStarted} className="btn-primary">Get Started</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute top-20 left-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                <LayoutDashboard className="h-3.5 w-3.5" />
                The modern way to manage projects
              </span>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Manage Projects{' '}
                <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Smarter
                </span>
              </h1>
              <p className="mb-8 max-w-xl text-lg text-slate-600">
                TaskFlow helps teams plan, track, and deliver projects on time. Create projects,
                assign tasks, set deadlines, and monitor progress — all in one beautiful workspace.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={handleGetStarted} className="btn-primary text-base px-6 py-3">
                  Get Started <ArrowRight className="h-5 w-5" />
                </button>
                <Link to="/login" className="btn-secondary text-base px-6 py-3">
                  Login
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-sm text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mock preview */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-fade-in">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-indigo-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Dashboard</p>
                      <p className="text-xs text-slate-400">Welcome back, Sarah</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-primary-50 p-3">
                    <p className="text-xs text-primary-600">Projects</p>
                    <p className="text-xl font-bold text-primary-700">12</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Tasks</p>
                    <p className="text-xl font-bold text-slate-700">48</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-600">Completed</p>
                    <p className="text-xl font-bold text-emerald-700">64%</p>
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-600">Mobile App Dev</p>
                      <span className="text-xs font-semibold text-primary-600">75%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100"><div className="h-full w-3/4 rounded-full bg-primary-500" /></div>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-600">Website Redesign</p>
                      <span className="text-xs font-semibold text-indigo-600">45%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100"><div className="h-full w-2/5 rounded-full bg-indigo-500" /></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <Trello className="h-5 w-5 text-slate-400" />
                  <p className="text-xs text-slate-500">3 projects in progress this week</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-slide-up">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Task completed!</p>
                    <p className="text-xs text-slate-400">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 text-sm font-semibold text-primary-600">Features</span>
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need to manage projects
            </h2>
            <p className="text-slate-600">
              TaskFlow brings together all the tools your team needs to plan, collaborate, and
              deliver successful projects.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 text-sm font-semibold text-primary-600">How it works</span>
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">Start in minutes</h2>
            <p className="text-slate-600">Three simple steps to get your team up and running.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Create your workspace', desc: 'Sign up and start creating projects. Add descriptions, deadlines, and priorities.' },
              { step: '02', title: 'Add tasks & assign', desc: 'Break projects into tasks, assign them to teammates, and set due dates.' },
              { step: '03', title: 'Track & deliver', desc: 'Move tasks across your kanban board and watch project progress update automatically.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-slate-200 p-6">
                <span className="mb-4 inline-flex text-4xl font-extrabold text-primary-100">{item.step}</span>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-gradient-to-br from-primary-600 to-indigo-600 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 text-sm font-semibold text-primary-200">Benefits</span>
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Why teams choose TaskFlow</h2>
            <p className="text-primary-100">Powerful features delivered with a clean, modern experience.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="text-sm text-primary-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to manage projects smarter?
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Join TaskFlow today and see how easy project management can be.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={handleGetStarted} className="btn-primary text-base px-8 py-3">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="btn-secondary text-base px-8 py-3">Login</Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-indigo-500">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Task<span className="text-primary-600">Flow</span></span>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
