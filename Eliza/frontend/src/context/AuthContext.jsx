import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('username')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    let res
    try {
      res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
    } catch {
      throw new Error('Server is not reachable. Please try again later.')
    }
    if (!res.ok) {
      const text = await res.text()
      try { throw new Error(JSON.parse(text).detail) } catch (e) { if (e.message) throw e; throw new Error('Login failed') }
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    setToken(data.token)
    setUser(data.username)
  }

  const register = async (username, password) => {
    let res
    try {
      res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
    } catch {
      throw new Error('Server is not reachable. Please try again later.')
    }
    if (!res.ok) {
      const text = await res.text()
      try { throw new Error(JSON.parse(text).detail) } catch (e) { if (e.message) throw e; throw new Error('Registration failed') }
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    setToken(data.token)
    setUser(data.username)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
