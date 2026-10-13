import { useEffect, useState } from 'react'
import { ArrowUpRight, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { authService } from '../services/authService'
import { districtService } from '../services/districtService'
import { transferService } from '../services/transferService'
import { wsService } from '../services/wsService'

export function QcDashboardPage() {
  const currentUser = authService.getCurrentUser()
  const myDistrictId = currentUser?.districtIds?.[0]

  const [district, setDistrict] = useState(null)
  const [inventory, setInventory] = useState([])
  const [transfers, setTransfers] = useState([])
  const [districts, setDistricts] = useState([])
  const [draftReservations, setDraftReservations] = useState({})
  const [savingResourceId, setSavingResourceId] = useState(null)
  const [reservationError, setReservationError] = useState('')

  function loadData() {
    if (!myDistrictId) return
    districtService.loadOverview().then((all) => {
      setDistricts(all)
      setDistrict(all.find((item) => item.id === myDistrictId) || null)
    })
    districtService.getInventory(myDistrictId).then(setInventory).catch(() => setInventory([]))
    transferService.listTransfers().then(setTransfers).catch(() => setTransfers([]))
  }

  useEffect(() => {
    loadData()
    wsService.connect()
    const unsubscribeResource = wsService.subscribe('resource_status_update', () => loadData())
    const unsubscribeTransfer = wsService.subscribe('transfer_created', () => loadData())
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', () => loadData())
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', () => loadData())
    const unsubscribeRetention = wsService.subscribe('retention_threshold_lowered', () => loadData())
    return () => {
      unsubscribeResource()
      unsubscribeTransfer()
      unsubscribeStatus()
      unsubscribeLevel()
      unsubscribeRetention()
    }
  }, [myDistrictId])

  if (!myDistrictId) {
    return (
      <Card title="No quarter assigned" subtitle="Ask a City Director to assign you to a quarter">
        <p>Once a City Director assigns you to a quarter from the Team page, your local dashboard will appear here.</p>
      </Card>
    )
  }

  function getDistrictName(districtId) {
    return districts.find((item) => item.id === districtId)?.name || `#${districtId}`
  }

  const myRequests = transfers.filter(
    (item) => item.source_district_id === myDistrictId || item.destination_district_id === myDistrictId
  )

  function getDraftValue(item) {
    return draftReservations[item.resource_id] ?? item.reserved_quantity
  }

  async function handleSaveReservation(item) {
    const value = Number(getDraftValue(item))
    setSavingResourceId(item.resource_id)
    setReservationError('')
    try {
      await districtService.updateReservation(myDistrictId, item.resource_id, value)
      loadData()
    } catch (err) {
      setReservationError(err.message)
    } finally {
      setSavingResourceId(null)
    }
  }

  return (
    <div className="dashboard-grid">
      <Card title="Local Resources" subtitle={`${district?.name || ''} retention and transferability`} className="card--full">
        {reservationError && <p className="form-error">{reservationError}</p>}
        <div className="resource-table">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Current</th>
                <th>Min retention</th>
                <th>Reserved</th>
                <th>Transferable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const ratio = item.quantity > 0 ? Math.max((item.available_to_transfer / item.quantity) * 100, 0) : 0
                const status = item.available_to_transfer === 0 ? 'Critical' : ratio < 25 ? 'Warning' : 'Stable'
                const isDirty = Number(getDraftValue(item)) !== item.reserved_quantity

                return (
                  <tr key={item.resource_id}>
                    <td>{item.resource_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.min_retention}</td>
                    <td>
                      <div className="reservation-editor">
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={getDraftValue(item)}
                          disabled={savingResourceId === item.resource_id}
                          onChange={(event) => setDraftReservations((current) => ({ ...current, [item.resource_id]: event.target.value }))}
                        />
                        {isDirty && (
                          <button
                            type="button"
                            className="action-button action-button--primary"
                            disabled={savingResourceId === item.resource_id}
                            onClick={() => handleSaveReservation(item)}
                          >
                            {savingResourceId === item.resource_id ? 'Saving…' : 'Save'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{item.available_to_transfer}</td>
                    <td>
                      <div className="resource-status">
                        <Badge variant={status === 'Critical' ? 'critical' : status === 'Warning' ? 'warning' : 'stable'}>{status}</Badge>
                        <div className="retention-meter" aria-label={`${item.resource_name} retention bar`}>
                          <span style={{ width: `${Math.min(ratio, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="split-row">
        <Card title="Incoming / Outgoing Requests" subtitle="Operational movement requests" className="card--wide">
          <div className="request-list">
            {myRequests.length === 0 && <p className="muted-text">No transfer requests involving this quarter.</p>}
            {myRequests.map((request) => {
              const isOutgoing = request.source_district_id === myDistrictId
              return (
                <div className="request-item" key={request.id}>
                  <div>
                    <strong>TR-{request.id}</strong>
                    <p>Resource #{request.ressource_id}</p>
                  </div>
                  <div>
                    <small>{isOutgoing ? 'Outgoing' : 'Incoming'}</small>
                    <p>{isOutgoing ? getDistrictName(request.destination_district_id) : getDistrictName(request.source_district_id)}</p>
                  </div>
                  <div>
                    <small>Qty</small>
                    <p>{request.quantity}</p>
                  </div>
                  <Badge variant={request.status === 'approved' ? 'stable' : request.status === 'rejected' ? 'critical' : 'warning'}>{request.status}</Badge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="QC Actions" subtitle="Approved workflow access" className="card--wide">
          <div className="qc-actions">
            <Link to="/resources" className="action-button action-button--primary"><ArrowUpRight size={16} /> Review resources</Link>
            <Link to="/transfers" className="action-button"><ArrowUpRight size={16} /> Go to transfer requests</Link>
          </div>
          <div className="note-box">
            <ShieldAlert size={16} />
            <span>Minimum retention rule: 30% of initial quarter inventory must remain in {district?.name || 'this quarter'}.</span>
          </div>
        </Card>
      </div>

      <Card title="Quarter Health" subtitle={`${district?.name || ''} resilience snapshot`} className="card--full">
        <div className="quarter-health">
          <div className="mini-stat">
            <span className="mini-label">Threat</span>
            <strong>{district?.threatLevel || '—'}</strong>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Current posture</span>
            <strong>{district?.severity || '—'}</strong>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Sea access</span>
            <strong>{district?.sea_access ? 'Yes' : 'No'}</strong>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Central hub</span>
            <strong>{district?.is_hub ? 'Yes' : 'No'}</strong>
          </div>
        </div>
      </Card>
    </div>
  )
}
