import { authService } from './authService'

const API_URL = '/api'

async function apiRequest(path, { method = 'GET', body } = {}) {
  const token = authService.getToken()
  const headers = { Authorization: `Bearer ${token}` }
  if (body) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = data && data.detail
    const message = typeof detail === 'string' ? detail : detail && detail.message
    const error = new Error(message || 'Request failed.')
    error.status = response.status
    throw error
  }

  return data
}

export const transferService = {
  listTransfers() {
    return apiRequest('/transfers')
  },

  createTransfer(payload) {
    return apiRequest('/transfers', { method: 'POST', body: payload })
  },

  approveTransfer(transferId) {
    return apiRequest(`/transfers/${transferId}/approve`, { method: 'POST' })
  },

  rejectTransfer(transferId) {
    return apiRequest(`/transfers/${transferId}/reject`, { method: 'POST' })
  }
}
