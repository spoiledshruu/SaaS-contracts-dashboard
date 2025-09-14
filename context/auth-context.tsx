"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { username: string } | null
  token: string | null
  login: (token: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("auth-token")
    const storedUsername = localStorage.getItem("auth-username")

    if (storedToken && storedUsername) {
      setToken(storedToken)
      setUser({ username: storedUsername })
      setIsAuthenticated(true)
    }
  }, [])

  const login = (newToken: string, username: string) => {
    localStorage.setItem("auth-token", newToken)
    localStorage.setItem("auth-username", username)
    setToken(newToken)
    setUser({ username })
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("auth-username")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
