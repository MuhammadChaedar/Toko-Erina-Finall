import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

export interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getAuthPayload = (data: any) => data?.data || data || {}

const getAuthToken = (data: any) =>
  data?.token ||
  data?.access_token ||
  data?.auth_token ||
  data?.plainTextToken ||
  data?.bearer_token

const getAuthUser = (data: any, email: string): User => {
  const userData = data?.user || data?.admin || {}

  return {
    id: String(userData.id || 'admin'),
    email: userData.email || email,
    full_name:
      userData.full_name || userData.name || userData.username || 'Admin Toko Erina',
    role: userData.role || 'admin',
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authAPI.login(email, password)
      const payload = getAuthPayload(response.data)
      const newToken = getAuthToken(payload)

      if (!newToken) {
        throw new Error('Token autentikasi tidak ditemukan dari backend')
      }

      const userData = getAuthUser(payload, email)

      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      setToken(newToken)
      setUser(userData)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      setToken(null)
      setUser(null)
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
