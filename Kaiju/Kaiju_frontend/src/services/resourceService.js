const API_URL = '/api'

async function fetchJSON(path) {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error('Request failed.')
  return response.json()
}

function computeStatus(totalQuantity, totalAvailable) {
  if (totalAvailable === 0) return 'Critical'
  if (totalQuantity > 0 && totalAvailable / totalQuantity < 0.25) return 'Warning'
  return 'Stable'
}

export const resourceService = {
  async loadCitywideResources() {
    const [resources, districts] = await Promise.all([fetchJSON('/resources'), fetchJSON('/districts')])

    const inventoriesByDistrict = await Promise.all(
      districts.map((district) =>
        fetchJSON(`/districts/${district.id}/inventory`).then((inventory) => ({ district, inventory }))
      )
    )

    return resources.map((resource) => {
      let total = 0
      let available = 0
      let reserved = 0
      let minRetention = 0
      const quarterBreakdown = {}

      inventoriesByDistrict.forEach(({ district, inventory }) => {
        const item = inventory.find((entry) => entry.resource_id === resource.id)
        if (!item) return

        total += item.quantity
        available += item.available_to_transfer
        reserved += item.reserved_quantity
        minRetention += item.min_retention

        quarterBreakdown[district.code] = {
          districtId: district.id,
          districtName: district.name,
          total: item.quantity,
          available: item.available_to_transfer,
          reserved: item.reserved_quantity,
          minRetention: item.min_retention,
          transferable: item.available_to_transfer
        }
      })

      return {
        id: resource.id,
        name: resource.name,
        total,
        available,
        reserved,
        minimumRetention: minRetention,
        status: computeStatus(total, available),
        description: `Citywide pool of ${resource.name.toLowerCase()} across Tokyork's five quarters.`,
        quarterBreakdown
      }
    })
  },

  getFilteredResources(resources, { searchTerm, quarter, status }) {
    const normalizedSearch = String(searchTerm || '').trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesSearch = !normalizedSearch || resource.name.toLowerCase().includes(normalizedSearch)
      const matchesQuarter = !quarter || quarter === 'All quarters' || Boolean(resource.quarterBreakdown[quarter])
      const matchesStatus = !status || status === 'All statuses' || resource.status === status

      return matchesSearch && matchesQuarter && matchesStatus
    })
  }
}
