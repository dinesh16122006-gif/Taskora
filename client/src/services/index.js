import api from './api'

// AUTH
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// PROJECTS
export const getProjects = (params) => api.get('/projects', { params })
export const getProject = (id) => api.get(`/projects/${id}`)
export const createProject = (data) => api.post('/projects', data)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)
export const getDashboard = () => api.get('/projects/dashboard')
export const getProjectAnalytics = (id) => api.get(`/projects/${id}/analytics`)

// TASKS
export const getTasks = (params) => api.get('/tasks', { params })
export const getTask = (id) => api.get(`/tasks/${id}`)
export const createTask = (data) => api.post('/tasks', data)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const updateTaskStatus = (id, status) => api.put(`/tasks/${id}/status`, { status })
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

// USERS
export const getUsers = (params) => api.get('/users', { params })
export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const changePassword = (id, data) => api.put(`/users/${id}/password`, data)

// NOTIFICATIONS
export const getNotifications = () => api.get('/notifications')
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => api.put('/notifications/read-all')
