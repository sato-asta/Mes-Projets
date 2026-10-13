import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { resourceService } from '../services/resourceService'
import { wsService } from '../services/wsService'

export function ResourceDetailsPage() {
  const { resourceId } = useParams()
  const [resources, setResources] = useState([])
  const [loaded, setLoaded] = useState(false)

  function loadData() {
    resourceService.loadCitywideResources().then((data) => {
      setResources(data)
      setLoaded(true)
    })
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

  const resource = resources.find((item) => String(item.id) === resourceId)

  if (loaded && !resource) {
    return (
      <Card title="Resource not found" subtitle="No matching record was found for this selection.">
        <Link to="/resources" className="inline-link">Return to resources</Link>
      </Card>
    )
  }

  if (!resource) return null

  const quarterEntries = Object.entries(resource.quarterBreakdown)
  const transferable = resource.available

  return (
    <div className="resource-details">
      <div className="summary-grid">
        <Card title={resource.name} subtitle={resource.description} className="card--wide">
          <div className="stats-grid">
            <div className="kpi-item"><span>Total</span><strong>{resource.total}</strong></div>
            <div className="kpi-item"><span>Available</span><strong>{resource.available}</strong></div>
            <div className="kpi-item"><span>Reserved</span><strong>{resource.reserved}</strong></div>
            <div className="kpi-item"><span>Min retention</span><strong>{resource.minimumRetention}</strong></div>
            <div className="kpi-item"><span>Transferable</span><strong>{transferable}</strong></div>
            <div className="kpi-item"><span>Status</span><strong><Badge variant={resource.status === 'Critical' ? 'critical' : resource.status === 'Warning' ? 'warning' : 'stable'}>{resource.status}</Badge></strong></div>
          </div>
        </Card>

        <Card title="Retention visualization" subtitle="Current stock versus protected reserve" className="card--wide">
          <div className="retention-chart">
            <div className="retention-meter retention-meter--bg">
              <span style={{ width: `${resource.total > 0 ? Math.min((resource.available / resource.total) * 100, 100) : 0}%` }} />
            </div>
            <div className="legend-row">
              <span><i className="swatch swatch--current" /> Current supply</span>
              <span><i className="swatch swatch--reserve" /> Minimum retention</span>
              <span><i className="swatch swatch--transfer" /> Transferable</span>
            </div>
            <div className="retention-values">
              <p>Current: {resource.available}</p>
              <p>Threshold: {resource.minimumRetention}</p>
              <p>Transferable: {transferable}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Quarter distribution" subtitle="Breakdown across Tokyork sectors" className="card--full">
        <div className="distribution-table">
          <table>
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Qty</th>
                <th>Min retention</th>
                <th>Available to transfer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quarterEntries.map(([code, values]) => (
                <tr key={code}>
                  <td>{values.districtName} ({code})</td>
                  <td>{values.total}</td>
                  <td>{values.minRetention}</td>
                  <td>{values.transferable}</td>
                  <td>
                    <Badge variant={values.total < values.minRetention ? 'critical' : values.transferable > 0 ? 'stable' : 'warning'}>
                      {values.transferable > 0 ? 'Available' : 'Protected'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
