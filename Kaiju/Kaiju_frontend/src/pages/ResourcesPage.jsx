import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { resourceService } from '../services/resourceService'
import { districtService } from '../services/districtService'
import { wsService } from '../services/wsService'

export function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [districts, setDistricts] = useState([])
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All statuses')
  const [selectedQuarter, setSelectedQuarter] = useState('All quarters')

  function loadData() {
    resourceService.loadCitywideResources().then(setResources).catch((err) => setError(err.message))
    districtService.getDistricts().then(setDistricts).catch(() => setDistricts([]))
  }

  useEffect(() => {
    loadData()
    wsService.connect()
    const unsubscribeResource = wsService.subscribe('resource_status_update', () => loadData())
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', () => loadData())
    const unsubscribeRetention = wsService.subscribe('retention_threshold_lowered', () => loadData())
    return () => {
      unsubscribeResource()
      unsubscribeLevel()
      unsubscribeRetention()
    }
  }, [])

  const filteredResources = useMemo(() => {
    return resourceService.getFilteredResources(resources, {
      searchTerm,
      status: selectedStatus,
      quarter: selectedQuarter
    })
  }, [resources, searchTerm, selectedStatus, selectedQuarter])

  const isSingleQuarter = selectedQuarter !== 'All quarters'

  function getDisplayValues(resource) {
    if (isSingleQuarter) {
      const quarterData = resource.quarterBreakdown[selectedQuarter]
      if (!quarterData) {
        return { total: 0, available: 0, reserved: 0, minRetention: 0, transferable: 0 }
      }
      return quarterData
    }

    return {
      total: resource.total,
      available: resource.available,
      reserved: resource.reserved,
      minRetention: resource.minimumRetention,
      transferable: resource.available
    }
  }

  return (
    <div className="resources-page">
      <Card
        title="Resources"
        subtitle={isSingleQuarter ? `Resource monitoring — ${selectedQuarter}` : 'Citywide resource monitoring'}
        className="card--full"
      >
        {error && <p className="form-error">{error}</p>}

        <div className="toolbar">
          <input
            type="search"
            value={searchTerm}
            placeholder="Search resource"
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select value={selectedQuarter} onChange={(event) => setSelectedQuarter(event.target.value)}>
            <option value="All quarters">All quarters</option>
            {districts.map((district) => (
              <option key={district.id} value={district.code}>{district.name}</option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="All statuses">All statuses</option>
            <option value="Stable">Stable</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="table-block">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Total</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Min retention</th>
                <th>Transferable</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => {
                const values = getDisplayValues(resource)

                return (
                <tr key={resource.id}>
                  <td>{resource.name}</td>
                  <td>{values.total}</td>
                  <td>{values.available}</td>
                  <td>{values.reserved}</td>
                  <td>{values.minRetention}</td>
                  <td>{values.transferable}</td>
                  <td>
                    <Badge variant={resource.status === 'Critical' ? 'critical' : resource.status === 'Warning' ? 'warning' : 'stable'}>{resource.status}</Badge>
                  </td>
                  <td>
                    <Link to={`/resources/${resource.id}`} className="inline-link">View Details</Link>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
