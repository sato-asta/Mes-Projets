import { useEffect, useState } from 'react'
import { ArrowRight, AlertTriangle, Boxes, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { CityMap } from '../components/ui/CityMap'
import { districtService } from '../services/districtService'
import { resourceService } from '../services/resourceService'
import { transferService } from '../services/transferService'
import { wsService } from '../services/wsService'

const disasterTitles = { 1: 'Watch', 2: 'Alert', 3: 'Emergency', 4: 'Critical', 5: 'Catastrophic' }

function statusTone(status) {
  if (status === 'Critical' || status === 'rejected') return 'critical'
  if (status === 'Warning' || status === 'pending' || status === 'pending_transit') return 'warning'
  if (status === 'approved' || status === 'Stable') return 'stable'
  return 'default'
}

export function MainDashboardPage() {
  const [districts, setDistricts] = useState([])
  const [resources, setResources] = useState([])
  const [transfers, setTransfers] = useState([])
  const [disasterLevel, setDisasterLevel] = useState(1)
  const [error, setError] = useState('')

  function loadData() {
    districtService.loadOverview().then(setDistricts).catch(() => {})
    resourceService.loadCitywideResources().then(setResources).catch(() => {})
    transferService.listTransfers().then(setTransfers).catch(() => setTransfers([]))
    fetch('/api/disaster-level').then((response) => response.json()).then((data) => setDisasterLevel(data.level)).catch(() => {})
  }

  useEffect(() => {
    loadData()
    wsService.connect()
    const unsubscribeResource = wsService.subscribe('resource_status_update', () => loadData())
    const unsubscribeTransfer = wsService.subscribe('transfer_created', () => loadData())
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', () => loadData())
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', (data) => {
      setDisasterLevel(data.level)
      loadData()
    })
    const unsubscribeRetention = wsService.subscribe('retention_threshold_lowered', () => loadData())
    return () => {
      unsubscribeResource()
      unsubscribeTransfer()
      unsubscribeStatus()
      unsubscribeLevel()
      unsubscribeRetention()
    }
  }, [])

  function getDistrictName(districtId) {
    return districts.find((district) => district.id === districtId)?.name || `#${districtId}`
  }

  function getResourceName(resourceId) {
    return resources.find((resource) => resource.id === resourceId)?.name || `#${resourceId}`
  }

  const resourceTotal = resources.reduce((sum, item) => sum + item.total, 0)
  const availableTotal = resources.reduce((sum, item) => sum + item.available, 0)
  const reservedTotal = resources.reduce((sum, item) => sum + item.reserved, 0)
  const warningResources = resources.filter((item) => item.status === 'Warning' || item.status === 'Critical').length
  const recentTransfers = [...transfers].sort((a, b) => b.id - a.id).slice(0, 6)

  return (
    <div className="dashboard-grid">
      {error && <p className="form-error">{error}</p>}

      <div className="top-row">
        <Card title="Crisis Level" subtitle="Current operational state" className="card--wide">
          <div className="crisis-card">
            <div>
              <p className="metric-label">Level {disasterLevel}</p>
              <h2>{disasterTitles[disasterLevel] || 'Unknown'}</h2>
            </div>
            <div className="crisis-actions">
              <Badge variant={disasterLevel >= 4 ? 'critical' : disasterLevel >= 3 ? 'warning' : 'stable'}>Operational</Badge>
              <Link to="/qc-dashboard" className="secondary-link">QC overview</Link>
            </div>
          </div>
          <p className="muted-text">Response posture reflects the current citywide disaster level in real time.</p>
        </Card>

        <Card title="Resource Summary" subtitle="Inventory snapshot" className="card--wide">
          <div className="kpi-grid">
            <div className="kpi-item">
              <span>Total resources</span>
              <strong>{resourceTotal}</strong>
            </div>
            <div className="kpi-item">
              <span>Available</span>
              <strong>{availableTotal}</strong>
            </div>
            <div className="kpi-item">
              <span>Reserved</span>
              <strong>{reservedTotal}</strong>
            </div>
            <div className="kpi-item">
              <span>Warning/Deficit</span>
              <strong>{warningResources}</strong>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Quarter Overview" subtitle="Status by district" className="card--full">
        <div className="quarter-grid">
          {districts.map((district) => (
            <div key={district.id} className="quarter-card">
              <div className="quarter-card__header">
                <div>
                  <h4>{district.name}</h4>
                  <small>{district.code}</small>
                </div>
                <Badge variant={district.severity === 'Critical' ? 'critical' : district.severity === 'Watch' ? 'warning' : 'stable'}>
                  {district.sea_access ? 'Sea access' : 'Land access'}
                </Badge>
              </div>
              <div className="quarter-card__body">
                <p><strong>Threat:</strong> {district.threatLevel}</p>
                <p><strong>Resources:</strong> {district.resourcesLabel}</p>
                {district.neededResources?.length > 0 && (
                  <p><strong>Needs:</strong> {district.neededResources.join(', ')}</p>
                )}
                <p><strong>Access:</strong> {district.sea_access ? 'Port access' : 'Landline only'}</p>
              </div>
              <Link to="/city-overview" className="inline-link">View <ArrowRight size={14} /></Link>
            </div>
          ))}
        </div>
      </Card>

      <div className="split-row">
        <Card title="Active Transfers" subtitle="Recent dispatch details" className="card--wide">
          <div className="table-block">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resource</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransfers.map((transferItem) => (
                  <tr key={transferItem.id}>
                    <td>TR-{transferItem.id}</td>
                    <td>{getResourceName(transferItem.ressource_id)}</td>
                    <td>{getDistrictName(transferItem.source_district_id)}</td>
                    <td>{getDistrictName(transferItem.destination_district_id)}</td>
                    <td>{transferItem.quantity}</td>
                    <td><Badge variant={statusTone(transferItem.status)}>{transferItem.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="City Topology Preview" subtitle="Transport and dependency network" className="card--wide">
          <CityMap districts={districts} />
        </Card>
      </div>

      <Card title="Recent Activity" subtitle="Latest transfer events" className="card--full">
        <div className="activity-list">
          {recentTransfers.length === 0 && <p className="muted-text">No transfer activity yet.</p>}
          {recentTransfers.map((transferItem) => (
            <div key={transferItem.id} className="activity-item">
              <div className="activity-icon">
                {transferItem.status === 'rejected' ? <ShieldAlert size={18} /> : transferItem.status === 'pending' ? <AlertTriangle size={18} /> : <Boxes size={18} />}
              </div>
              <div className="activity-copy">
                <strong>TR-{transferItem.id} · {getResourceName(transferItem.ressource_id)}</strong>
                <p>{getDistrictName(transferItem.source_district_id)} → {getDistrictName(transferItem.destination_district_id)} · {transferItem.quantity} units</p>
              </div>
              <div className="activity-side">
                <small>{transferItem.route_type}</small>
                <Badge variant={statusTone(transferItem.status)}>{transferItem.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
