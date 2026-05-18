/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react'
import type { AuthUser, AuthState } from '../types/auth'
import { API_CONFIG } from '../constants/api'

interface AuthContextType extends AuthState {
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
    const userJson = localStorage.getItem('auth_user')
    let user = null
    if (userJson && userJson !== 'undefined') {
      try {
        user = JSON.parse(userJson)
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
    return {
      user,
      token,
      isAuthenticated: !!token && !!user,
    }
  })

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    setState({
      user,
      token,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
    localStorage.removeItem('auth_user')
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
