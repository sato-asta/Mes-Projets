import { mockUser } from '../data/mockData'

const AUTH_KEY = 'kaiju-auth-user'
const API_URL = '/api'

const ROLE_LABELS = {
  QC: 'Quarter Coordinator',
  LC: 'Liaison Coordinator',
  CD: 'City Director'
}

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = data && data.detail
    const message = typeof detail === 'string' ? detail : detail && detail.message
    throw new Error(message || 'Request failed.')
  }

  return data
}

function saveUser(apiUser, token, assignedQuarter) {
  const user = {
    ...mockUser,
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    roleCode: apiUser.role,
    role: ROLE_LABELS[apiUser.role] || apiUser.role,
    assignedQuarter: assignedQuarter || mockUser.assignedQuarter,
    districtIds: apiUser.district_ids || [],
    token
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  return user
}

export const authService = {
  isAuthenticated() {
    return Boolean(localStorage.getItem(AUTH_KEY))
  },

  getCurrentUser() {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  },

  getToken() {
    const user = this.getCurrentUser()
    return user ? user.token : null
  },

  async login({ email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '').trim()

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.')
    }

    const { access_token: token } = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: normalizedEmail, password: normalizedPassword }
    })
    const apiUser = await apiRequest('/auth/me', { token })

    const user = saveUser(apiUser, token)
    return { success: true, user }
  },

  async register({ fullName, email, quarter, password }) {
    const trimmedName = String(fullName || '').trim()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const trimmedPassword = String(password || '').trim()

    if (!trimmedName || !normalizedEmail || !quarter || !trimmedPassword) {
      throw new Error('Please complete all registration fields.')
    }

    await apiRequest('/auth/register', {
      method: 'POST',
      body: { name: trimmedName, email: normalizedEmail, password: trimmedPassword, role: 'QC' }
    })

    const { access_token: token } = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: normalizedEmail, password: trimmedPassword }
    })
    const apiUser = await apiRequest('/auth/me', { token })

    const user = saveUser(apiUser, token, quarter)
    return { success: true, user }
  },

  logout() {
    localStorage.removeItem(AUTH_KEY)
  }
}
