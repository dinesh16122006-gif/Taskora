import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { register as apiRegister, login as apiLogin, getMe } from '../services'

const AuthContext = createContext(null)

const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token'))

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('taskflow_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('taskflow_user')
      }
    }
    setLoading(false)
  }, [])

  // Validate token by fetching current user on mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        try {
          const res = await getMe()
          setUser(res.data.user)
          localStorage.setItem('taskflow_user', JSON.stringify(res.data.user))
        } catch {
          localStorage.removeItem('taskflow_token')
          localStorage.removeItem('taskflow_user')
          setToken(null)
          setUser(null)
        }
      }
    }
    validate()
  }, [token])

  const setAuthStorage = (token, user) => {
    localStorage.setItem('taskflow_token', token)
    localStorage.setItem('taskflow_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const register = useCallback(async (data) => {
    const res = await apiRegister(data)
    setAuthStorage(res.data.token, res.data.user)
    return res.data
  }, [])

  const login = useCallback(async (data) => {
    const res = await apiLogin(data)
    setAuthStorage(res.data.token, res.data.user)
    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token')
    localStorage.removeItem('taskflow_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem('taskflow_user', JSON.stringify(updated))
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = useAuthContext

export default AuthContext
