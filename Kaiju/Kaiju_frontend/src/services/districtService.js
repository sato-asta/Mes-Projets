import { authService } from './authService'

const API_URL = '/api'

async function fetchJSON(path) {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error('Request failed.')
  return response.json()
}

const DISASTER_THREAT_BASELINE = { 1: 'Low', 2: 'Moderate', 3: 'Moderate', 4: 'Elevated', 5: 'High' }

function computeResourceHealth(inventory) {
  if (inventory.length === 0) {
    return { severity: 'Stable', resourcesLabel: 'Unknown', neededResources: [] }
  }

  const critical = inventory.filter((item) => item.available_to_transfer === 0)
  const low = inventory.filter(
    (item) => item.quantity > 0 && item.available_to_transfer / item.quantity < 0.25
  )

  const neededResources = (critical.length > 0 ? critical : low).map((item) => item.resource_name)

  if (critical.length > 0) return { severity: 'Critical', resourcesLabel: 'At risk', neededResources }
  if (low.length >= 2) return { severity: 'Watch', resourcesLabel: 'Limited', neededResources }
  return { severity: 'Stable', resourcesLabel: 'Healthy', neededResources: [] }
}

function computeThreatLevel(disasterLevel, resourceSeverity) {
  if (resourceSeverity === 'Critical') return 'High'
  if (resourceSeverity === 'Watch') return disasterLevel >= 3 ? 'Elevated' : 'Moderate'
  return DISASTER_THREAT_BASELINE[disasterLevel] || 'Moderate'
}

export const districtService = {
  getDistricts() {
    return fetchJSON('/districts')
  },

  getInventory(districtId) {
    return fetchJSON(`/districts/${districtId}/inventory`)
  },

  async updateReservation(districtId, resourceId, reservedQuantity) {
    const token = authService.getToken()
    const response = await fetch(`${API_URL}/districts/${districtId}/inventory/${resourceId}/reservation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reserved_quantity: reservedQuantity })
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      const detail = data && data.detail
      throw new Error(typeof detail === 'string' ? detail : detail?.message || 'Request failed.')
    }
    return data
  },

  async loadOverview() {
    const [districts, disasterStatus] = await Promise.all([
      fetchJSON('/districts'),
      fetchJSON('/disaster-level')
    ])

    return Promise.all(
      districts.map(async (district) => {
        const inventory = await fetchJSON(`/districts/${district.id}/inventory`)
        const { severity, resourcesLabel, neededResources } = computeResourceHealth(inventory)
        const threatLevel = computeThreatLevel(disasterStatus.level, severity)
        return { ...district, inventory, severity, threatLevel, resourcesLabel, neededResources }
      })
    )
  }
}
