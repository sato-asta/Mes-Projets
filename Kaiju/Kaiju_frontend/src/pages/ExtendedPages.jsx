import { CheckCircle2, ShieldAlert, AlertTriangle, BellRing, UserCog, Route } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { transferService } from '../services/transferService'
import { authService } from '../services/authService'
import { wsService } from '../services/wsService'
import { districtService } from '../services/districtService'
import { resourceService } from '../services/resourceService'

function canActOnTransfer(currentUser, transfer) {
  if (!currentUser) return false
  if (currentUser.roleCode !== 'QC' && currentUser.roleCode !== 'CD') return false
  if (currentUser.roleCode === 'CD') return true

  const relevantDistrictId = transfer.status === 'pending'
    ? transfer.source_district_id
    : transfer.transit_district_id

  return (currentUser.districtIds || []).includes(relevantDistrictId)
}

function Field({ label, children }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function NewResourceRequestPage() {
  const navigate = useNavigate()

  const [districts, setDistricts] = useState([])
  const [resources, setResources] = useState([])
  const [sourceDistrictId, setSourceDistrictId] = useState('')
  const [destinationDistrictId, setDestinationDistrictId] = useState('')
  const [resourceId, setResourceId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/districts')
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data)
        if (data.length > 0) {
          setSourceDistrictId(data[0].id)
          setDestinationDistrictId(data[1]?.id ?? data[0].id)
        }
      })
      .catch(() => setDistricts([]))

    fetch('/api/resources')
      .then((response) => response.json())
      .then((data) => {
        setResources(data)
        if (data.length > 0) setResourceId(data[0].id)
      })
      .catch(() => setResources([]))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await transferService.createTransfer({
        source_district_id: Number(sourceDistrictId),
        destination_district_id: Number(destinationDistrictId),
        resource_id: Number(resourceId),
        quantity: Number(quantity)
      })
      navigate('/transfers')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <Card title="New Resource Request" subtitle="Create a new resource movement request" className="card--full">
        <form className="stacked-form" onSubmit={handleSubmit}>
          <div className="field-row field-row--three">
            <Field label="Source quarter">
              <select value={sourceDistrictId} onChange={(event) => setSourceDistrictId(event.target.value)}>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Destination quarter">
              <select value={destinationDistrictId} onChange={(event) => setDestinationDistrictId(event.target.value)}>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Resource type">
              <select value={resourceId} onChange={(event) => setResourceId(event.target.value)}>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="field-row field-row--three">
            <Field label="Quantity">
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(event) => setQuantity(event.target.value)}
              />
            </Field>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="note-box">
            <ShieldAlert size={17} />
            <span>Adjacent districts only. Quantities must respect minimum retention and current catastrophe rules.</span>
          </div>

          <div className="field-row field-row--two">
            <div className="info-box">
              <strong>Route conditions</strong>
              <ul>
                <li>The route (direct, transit, or maritime) is determined automatically from quarter adjacency.</li>
                <li>Requested quantity must not exceed transferable surplus.</li>
                <li>Approval is required from the destination quarter's coordinator.</li>
              </ul>
            </div>
            <div className="info-box">
              <strong>Current posture</strong>
              <ul>
                <li>Permission rules are displayed on the permissions page.</li>
                <li>Rejected requests will state the exact reason (route, retention, or permission).</li>
              </ul>
            </div>
          </div>

          <div className="action-row action-row--right">
            <Link to="/transfers" className="action-button action-button--danger">Cancel</Link>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Validate and submit'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

const statusBadgeVariant = {
  approved: 'stable',
  pending: 'warning',
  pending_transit: 'warning',
  rejected: 'default'
}

export function TransferRequestsPage() {
  const currentUser = authService.getCurrentUser()
  const [transfers, setTransfers] = useState([])
  const [districts, setDistricts] = useState([])
  const [resources, setResources] = useState([])
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  function loadTransfers() {
    transferService.listTransfers()
      .then(setTransfers)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    fetch('/api/districts').then((response) => response.json()).then(setDistricts).catch(() => setDistricts([]))
    fetch('/api/resources').then((response) => response.json()).then(setResources).catch(() => setResources([]))
    loadTransfers()

    wsService.connect()
    const unsubscribeCreated = wsService.subscribe('transfer_created', () => loadTransfers())
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', () => loadTransfers())
    return () => {
      unsubscribeCreated()
      unsubscribeStatus()
    }
  }, [])

  function getDistrictName(districtId) {
    return districts.find((district) => district.id === districtId)?.name || `#${districtId}`
  }

  function getResourceName(resourceId) {
    return resources.find((resource) => resource.id === resourceId)?.name || `#${resourceId}`
  }

  async function handleApprove(transferId) {
    setSavingId(transferId)
    setError('')
    try {
      await transferService.approveTransfer(transferId)
      loadTransfers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  async function handleReject(transferId) {
    setSavingId(transferId)
    setError('')
    try {
      await transferService.rejectTransfer(transferId)
      loadTransfers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="page-stack">
      <Card title="Transfer Requests" subtitle="Current transfer requests and approvals" action={<Link to="/new-resource-request" className="action-button action-button--primary">Create request</Link>} className="card--full">
        {error && <p className="form-error">{error}</p>}

        <div className="table-block">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Resource</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Route type</th>
                <th>Requester</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((request) => (
                <tr key={request.id}>
                  <td>TR-{request.id}</td>
                  <td>{getResourceName(request.ressource_id)}</td>
                  <td>{getDistrictName(request.source_district_id)}</td>
                  <td>{getDistrictName(request.destination_district_id)}</td>
                  <td>{request.quantity}</td>
                  <td>{request.route_type}</td>
                  <td>#{request.requester_id}</td>
                  <td><Badge variant={statusBadgeVariant[request.status] || 'default'}>{request.status}</Badge></td>
                  <td className="table-actions">
                    <Link to={`/transfers/${request.id}`} className="inline-link">View</Link>
                    {(request.status === 'pending' || request.status === 'pending_transit') && canActOnTransfer(currentUser, request) && (
                      <>
                        <button
                          type="button"
                          className="action-button action-button--primary"
                          disabled={savingId === request.id}
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="action-button action-button--danger"
                          disabled={savingId === request.id}
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
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

export function TransferDetailsPage() {
  const { transferId } = useParams()
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()

  const [transfer, setTransfer] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [districts, setDistricts] = useState([])
  const [resources, setResources] = useState([])
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function loadTransfer() {
    transferService.listTransfers()
      .then((all) => {
        setTransfer(all.find((item) => String(item.id) === transferId) || null)
        setLoaded(true)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    fetch('/api/districts').then((response) => response.json()).then(setDistricts).catch(() => setDistricts([]))
    fetch('/api/resources').then((response) => response.json()).then(setResources).catch(() => setResources([]))
    loadTransfer()

    wsService.connect()
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', () => loadTransfer())
    return unsubscribeStatus
  }, [transferId])

  function districtName(id) {
    return districts.find((district) => district.id === id)?.name || `#${id}`
  }

  function resourceName(id) {
    return resources.find((resource) => resource.id === id)?.name || `#${id}`
  }

  async function handleApprove() {
    setIsSaving(true)
    setError('')
    try {
      await transferService.approveTransfer(transfer.id)
      loadTransfer()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleReject() {
    setIsSaving(true)
    setError('')
    try {
      await transferService.rejectTransfer(transfer.id)
      loadTransfer()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (loaded && !transfer) {
    return (
      <Card title="Transfer not found" subtitle="No matching transfer for this ID">
        <Link to="/transfers" className="inline-link">Return to transfer requests</Link>
      </Card>
    )
  }

  if (!transfer) return null

  const isActionable = (transfer.status === 'pending' || transfer.status === 'pending_transit') && canActOnTransfer(currentUser, transfer)

  return (
    <div className="page-stack">
      <Card title="Transfer Details" subtitle="Operational transfer overview" className="card--full">
        {error && <p className="form-error">{error}</p>}

        <div className="request-detail-grid">
          <div className="detail-panel">
            <div className="detail-row"><span>ID</span><strong>TR-{transfer.id}</strong></div>
            <div className="detail-row"><span>Resource</span><strong>{resourceName(transfer.ressource_id)}</strong></div>
            <div className="detail-row"><span>Quantity</span><strong>{transfer.quantity}</strong></div>
            <div className="detail-row"><span>Source</span><strong>{districtName(transfer.source_district_id)}</strong></div>
            <div className="detail-row"><span>Destination</span><strong>{districtName(transfer.destination_district_id)}</strong></div>
            <div className="detail-row"><span>Route</span><strong>{transfer.route_type}</strong></div>
          </div>

          <div className="detail-panel">
            <div className="detail-row"><span>Requester</span><strong>#{transfer.requester_id}</strong></div>
            <div className="detail-row"><span>Status</span><Badge variant={transfer.status === 'approved' ? 'stable' : transfer.status === 'rejected' ? 'critical' : 'warning'}>{transfer.status}</Badge></div>
            <div className="detail-row"><span>Transit quarter</span><strong>{transfer.transit_district_id ? districtName(transfer.transit_district_id) : '—'}</strong></div>
            <div className="detail-row"><span>Source approved by</span><strong>{transfer.approved_id ? `#${transfer.approved_id}` : '—'}</strong></div>
            <div className="detail-row"><span>Transit approved by</span><strong>{transfer.transit_approved_id ? `#${transfer.transit_approved_id}` : '—'}</strong></div>
          </div>
        </div>

        <div className="action-row action-row--right action-row--spaced">
          <button type="button" className="action-button" onClick={() => navigate('/transfers')}>Back to list</button>
          {isActionable && (
            <>
              <button type="button" className="action-button action-button--danger" disabled={isSaving} onClick={handleReject}>Reject</button>
              <button type="button" className="primary-button" disabled={isSaving} onClick={handleApprove}>
                {transfer.status === 'pending_transit' ? 'Approve (transit)' : 'Approve'}
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

function formatSlotTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })
}

export function OperationalCalendarPage() {
  const [resources, setResources] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedResourceId, setSelectedResourceId] = useState('all')
  const [calendarData, setCalendarData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/resources').then((response) => response.json()).then(setResources).catch(() => setResources([]))
    fetch('/api/districts').then((response) => response.json()).then(setDistricts).catch(() => setDistricts([]))
  }, [])

  function loadCalendar() {
    if (!selectedResourceId || resources.length === 0) return

    if (selectedResourceId === 'all') {
      Promise.all(
        resources.map((resource) =>
          fetch(`/api/calendar/resources/${resource.id}`)
            .then((response) => response.json())
            .then((data) => data.booked.map((slot) => ({ ...slot, resource_name: resource.name })))
        )
      )
        .then((bookedLists) => {
          const booked = bookedLists.flat().sort((a, b) => new Date(a.scheduled_start) - new Date(b.scheduled_start))
          setCalendarData({ booked, free: [] })
        })
        .catch((err) => setError(err.message))
      return
    }

    fetch(`/api/calendar/resources/${selectedResourceId}`)
      .then((response) => response.json())
      .then(setCalendarData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadCalendar()

    wsService.connect()
    const unsubscribeCreated = wsService.subscribe('transfer_created', () => loadCalendar())
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', () => loadCalendar())
    return () => {
      unsubscribeCreated()
      unsubscribeStatus()
    }
  }, [selectedResourceId, resources])

  function getDistrictName(districtId) {
    return districts.find((district) => district.id === districtId)?.name || `#${districtId}`
  }

  return (
    <div className="page-stack">
      <Card
        title="Operational Calendar"
        subtitle="Booked and free windows for the selected resource over the next 7 days"
        action={
          <select value={selectedResourceId} onChange={(event) => setSelectedResourceId(event.target.value)}>
            <option value="all">All resources</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.name}</option>
            ))}
          </select>
        }
        className="card--full"
      >
        {error && <p className="form-error">{error}</p>}

        <div className="event-list">
          {calendarData && calendarData.booked.length === 0 && (
            <p className="muted-text">No booked transfers in the coming week.</p>
          )}
          {calendarData && calendarData.booked.map((slot) => (
            <div className="event-row" key={slot.transfer_id}>
              <div>
                <strong>TR-{slot.transfer_id}{slot.resource_name ? ` · ${slot.resource_name}` : ''} · {slot.route_type}</strong>
                <small>{getDistrictName(slot.source_district_id)} → {getDistrictName(slot.destination_district_id)}</small>
              </div>
              <Badge variant="warning">{formatSlotTime(slot.scheduled_start)} – {formatSlotTime(slot.scheduled_end)}</Badge>
            </div>
          ))}
        </div>

        {calendarData && calendarData.free.length > 0 && (
          <div className="note-box">
            <span>{calendarData.free.length} free window(s) available for new bookings this week.</span>
          </div>
        )}
      </Card>
    </div>
  )
}

let notificationIdCounter = 1

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [districts, setDistricts] = useState([])
  const [resources, setResources] = useState([])

  useEffect(() => {
    fetch('/api/districts').then((response) => response.json()).then(setDistricts).catch(() => setDistricts([]))
    fetch('/api/resources').then((response) => response.json()).then(setResources).catch(() => setResources([]))
  }, [])

  function districtName(id) {
    return districts.find((district) => district.id === id)?.name || `#${id}`
  }

  function resourceName(id) {
    return resources.find((resource) => resource.id === id)?.name || `#${id}`
  }

  useEffect(() => {
    if (districts.length === 0 || resources.length === 0) return

    transferService.listTransfers().then((transfers) => {
      const seeded = [...transfers]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8)
        .map((item) => ({
          id: notificationIdCounter++,
          type: 'Transfer',
          title: `Transfer TR-${item.id} · ${item.status}`,
          description: `${resourceName(item.ressource_id)} · ${districtName(item.source_district_id)} → ${districtName(item.destination_district_id)}`,
          time: formatTime(new Date()),
          unread: false
        }))
      setNotifications(seeded)
    }).catch(() => {})
  }, [districts, resources])

  useEffect(() => {
    wsService.connect()

    function push(type, title, description) {
      setNotifications((current) => [
        { id: notificationIdCounter++, type, title, description, time: formatTime(new Date()), unread: true },
        ...current
      ])
    }

    const unsubscribeCreated = wsService.subscribe('transfer_created', (data) => {
      push('Transfer', `New transfer TR-${data.id}`, `${districtName(data.source_district_id)} → ${districtName(data.destination_district_id)}`)
    })
    const unsubscribeStatus = wsService.subscribe('transfer_status_changed', (data) => {
      push('Transfer', `Transfer TR-${data.id} · ${data.status}`, 'Status updated in real time.')
    })
    const unsubscribeConflict = wsService.subscribe('conflict_notification', (data) => {
      push('Warning', 'Resource conflict', `Multiple requests target resource #${data.resource_id} in ${districtName(data.district_id)}.`)
    })
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', (data) => {
      push('Status', `Disaster level changed to ${data.level}`, 'City-wide catastrophe level was updated.')
    })

    return () => {
      unsubscribeCreated()
      unsubscribeStatus()
      unsubscribeConflict()
      unsubscribeLevel()
    }
  }, [districts, resources])

  return (
    <div className="page-stack">
      <Card title="Notifications" subtitle="Operational updates and action requests" className="card--full">
        <div className="notification-list">
          {notifications.length === 0 && <p className="muted-text">No notifications yet.</p>}
          {notifications.map((item) => (
            <div key={item.id} className={`notification-item ${item.unread ? 'notification-item--unread' : ''}`}>
              <div className="notification-icon">
                {item.type === 'Warning' ? <AlertTriangle size={16} /> : item.type === 'Permission' ? <UserCog size={16} /> : item.type === 'Transfer' ? <Route size={16} /> : <BellRing size={16} />}
              </div>
              <div className="notification-copy">
                <div className="notification-meta">
                  <span>{item.type}</span>
                  <small>{item.time}</small>
                </div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <div className="notification-status">
                {item.unread ? <Badge variant="default">Unread</Badge> : <Badge variant="stable">Read</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function LcDashboardPage() {
  const currentUser = authService.getCurrentUser()
  const myDistrictIds = currentUser?.districtIds || []

  const [districts, setDistricts] = useState([])
  const [transfers, setTransfers] = useState([])
  const [resources, setResources] = useState([])

  function loadData() {
    districtService.loadOverview().then(setDistricts).catch(() => {})
    transferService.listTransfers().then(setTransfers).catch(() => setTransfers([]))
    resourceService.loadCitywideResources().then(setResources).catch(() => {})
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
  }, [])

  function getDistrictName(districtId) {
    return districts.find((district) => district.id === districtId)?.name || `#${districtId}`
  }

  const myDistricts = myDistrictIds.length > 0
    ? districts.filter((district) => myDistrictIds.includes(district.id))
    : districts

  const myDistrictIdSet = new Set(myDistricts.map((district) => district.id))
  const myTransfers = myDistrictIdSet.size > 0
    ? transfers.filter((item) => myDistrictIdSet.has(item.source_district_id) || myDistrictIdSet.has(item.destination_district_id))
    : transfers

  const activeCount = myTransfers.filter((item) => item.status === 'approved').length
  const waitingCount = myTransfers.filter((item) => item.status === 'pending' || item.status === 'pending_transit').length
  const transitCount = myTransfers.filter((item) => item.route_type === 'transit').length
  const criticalResourceCount = resources.filter((item) => item.status === 'Critical').length

  return (
    <div className="page-stack">
      <div className="summary-grid">
        <Card title="LC Dashboard" subtitle="Logistics coordination overview" className="card--wide">
          <div className="kpi-grid">
            <div className="kpi-item"><span>Active transfers</span><strong>{activeCount}</strong></div>
            <div className="kpi-item"><span>Waiting approval</span><strong>{waitingCount}</strong></div>
            <div className="kpi-item"><span>Transit chains</span><strong>{transitCount}</strong></div>
            <div className="kpi-item"><span>Critical resources</span><strong>{criticalResourceCount}</strong></div>
          </div>
        </Card>

        <Card title="Quarter focus" subtitle="Resource pressure" className="card--wide">
          <div className="stack-list">
            {myDistricts.length === 0 && <p className="muted-text">No quarters in scope.</p>}
            {myDistricts.map((district) => (
              <div className="metric-line" key={district.id}>
                <span>{district.name}</span>
                <strong>{district.threatLevel} · {district.resourcesLabel}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Transfer operations" subtitle="Current logistical flow" className="card--full">
        <div className="table-block">
          <table>
            <thead>
              <tr>
                <th>Transfer</th>
                <th>Route</th>
                <th>Resource</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myTransfers.length === 0 && (
                <tr><td colSpan={5} className="muted-text">No transfer activity in scope.</td></tr>
              )}
              {[...myTransfers].sort((a, b) => b.id - a.id).slice(0, 10).map((item) => (
                <tr key={item.id}>
                  <td>TR-{item.id}</td>
                  <td>{getDistrictName(item.source_district_id)} → {getDistrictName(item.destination_district_id)}</td>
                  <td>#{item.ressource_id}</td>
                  <td><Badge variant={item.status === 'approved' ? 'stable' : item.status === 'rejected' ? 'critical' : 'warning'}>{item.status}</Badge></td>
                  <td><Link to={`/transfers/${item.id}`} className="inline-link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function CdDashboardPage() {
  const [districts, setDistricts] = useState([])
  const [transfers, setTransfers] = useState([])
  const [resources, setResources] = useState([])
  const [disasterLevel, setDisasterLevel] = useState(1)

  function loadData() {
    districtService.loadOverview().then(setDistricts).catch(() => {})
    transferService.listTransfers().then(setTransfers).catch(() => setTransfers([]))
    resourceService.loadCitywideResources().then(setResources).catch(() => {})
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

  const totalCapacity = resources.reduce((sum, item) => sum + item.total, 0)
  const availableCapacity = resources.reduce((sum, item) => sum + item.available, 0)
  const globalCapacityPercent = totalCapacity > 0 ? Math.round((availableCapacity / totalCapacity) * 100) : 0
  const activeTransfers = transfers.filter((item) => item.status === 'approved' || item.status === 'pending' || item.status === 'pending_transit').length
  const interventions = transfers.filter((item) => item.status === 'pending' || item.status === 'pending_transit').length

  return (
    <div className="page-stack">
      <div className="summary-grid">
        <Card title="City Director overview" subtitle="Municipal response posture" className="card--wide">
          <div className="kpi-grid">
            <div className="kpi-item"><span>Catastrophe level</span><strong>Level {disasterLevel}</strong></div>
            <div className="kpi-item"><span>Global capacity</span><strong>{globalCapacityPercent}%</strong></div>
            <div className="kpi-item"><span>Transfers active</span><strong>{activeTransfers}</strong></div>
            <div className="kpi-item"><span>Interventions</span><strong>{interventions}</strong></div>
          </div>
        </Card>

        <Card title="Director action" subtitle="High-level decisions" className="card--wide">
          <div className="stack-list">
            <Link to="/permissions" className="list-button">Review current permissions</Link>
            <Link to="/catastrophe" className="list-button">Review catastrophe level</Link>
            <Link to="/team" className="list-button">Manage team</Link>
          </div>
        </Card>
      </div>

      <Card title="City status" subtitle="Quarter and operational posture" className="card--full">
        <div className="quarter-grid">
          {districts.map((district) => (
            <div key={district.id} className="quarter-card">
              <div className="quarter-card__header">
                <div>
                  <h4>{district.name}</h4>
                  <small>{district.code}</small>
                </div>
                <Badge variant={district.severity === 'Critical' ? 'critical' : district.severity === 'Watch' ? 'warning' : 'stable'}>{district.severity}</Badge>
              </div>
              <div className="quarter-card__body">
                <p><strong>Threat:</strong> {district.threatLevel}</p>
                <p><strong>Resources:</strong> {district.resourcesLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const actionLabels = {
  view: 'View resources',
  reserve_own_quarter: 'Reserve within own quarter',
  request_adjacent_transfer: 'Request adjacent transfer',
  organize_transit: 'Organize transit',
  requisition: 'Requisition',
  lower_retention_threshold: 'Lower retention threshold'
}

const actionOrder = ['view', 'reserve_own_quarter', 'request_adjacent_transfer', 'organize_transit', 'requisition', 'lower_retention_threshold']

export function CurrentPermissionsPage() {
  const [permissionsData, setPermissionsData] = useState(null)
  const [error, setError] = useState('')

  function loadData() {
    const token = authService.getToken()
    fetch('/api/permissions/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then(setPermissionsData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
    wsService.connect()
    const unsubscribe = wsService.subscribe('disaster_level_changed', () => loadData())
    return unsubscribe
  }, [])

  const allowedSet = new Set(permissionsData?.allowed_actions || [])

  return (
    <div className="page-stack">
      <Card
        title="Current Permissions"
        subtitle={permissionsData ? `${permissionsData.role} at disaster level ${permissionsData.level}` : 'Current authorizations and restrictions'}
        className="card--full"
      >
        {error && <p className="form-error">{error}</p>}
        <div className="permission-list">
          {actionOrder.map((action) => {
            const isAllowed = allowedSet.has(action)
            return (
              <div key={action} className="permission-row">
                <div>
                  <strong>{actionLabels[action]}</strong>
                  <span>{isAllowed ? 'Authorized for your role at this level' : 'Not permitted for your role at this level'}</span>
                </div>
                <Badge variant={isAllowed ? 'stable' : 'critical'}>{isAllowed ? 'Allowed' : 'Blocked'}</Badge>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

const disasterLevels = [
  { level: 1, title: 'Watch', description: 'Monitoring phase. No reservation allowed. Resources stay in place.' },
  { level: 2, title: 'Alert', description: 'Reservations within own quarter only. No inter-quarter transfers.' },
  { level: 3, title: 'Emergency', description: 'Transfers between adjacent quarters authorized. QC approval required.' },
  { level: 4, title: 'Critical', description: 'Extended transfers (adjacent + transit). LC can initiate transfer chains. CD can requisition.' },
  { level: 5, title: 'Catastrophic', description: 'All transfers unlocked. CD can reduce retention threshold to 15%. Maritime route prioritized.' }
]

export function CatastropheStatusPage() {
  const currentUser = authService.getCurrentUser()
  const isCD = currentUser?.roleCode === 'CD'

  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [retentionLowered, setRetentionLowered] = useState(false)
  const [isLoweringRetention, setIsLoweringRetention] = useState(false)

  function loadLevel() {
    fetch('/api/disaster-level')
      .then((response) => response.json())
      .then((data) => {
        setCurrentLevel(data.level)
        setSelectedLevel(data.level)
      })
      .catch(() => {})
  }

  function loadRetentionSettings() {
    fetch('/api/disaster-level/retention-settings')
      .then((response) => response.json())
      .then((data) => setRetentionLowered(data.retention_lowered))
      .catch(() => {})
  }

  useEffect(() => {
    loadLevel()
    loadRetentionSettings()
    wsService.connect()
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', (data) => {
      setCurrentLevel(data.level)
      setSelectedLevel(data.level)
      loadRetentionSettings()
    })
    const unsubscribeRetention = wsService.subscribe('retention_threshold_lowered', () => {
      setRetentionLowered(true)
    })
    return () => {
      unsubscribeLevel()
      unsubscribeRetention()
    }
  }, [])

  async function handleLowerRetention() {
    setError('')
    setIsLoweringRetention(true)
    try {
      const token = authService.getToken()
      const response = await fetch('/api/disaster-level/lower-retention', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = data && data.detail
        throw new Error(typeof detail === 'string' ? detail : detail?.message || 'Request failed.')
      }
      setRetentionLowered(data.retention_lowered)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoweringRetention(false)
    }
  }

  async function handleApply() {
    setError('')
    setIsSaving(true)
    try {
      const token = authService.getToken()
      const response = await fetch('/api/disaster-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ level: selectedLevel })
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = data && data.detail
        throw new Error(typeof detail === 'string' ? detail : detail?.message || 'Request failed.')
      }
      setCurrentLevel(data.level)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <Card title="Catastrophe Status" subtitle="Current citywide response posture" className="card--full">
        {isCD && (
          <div className="toolbar">
            <select value={selectedLevel} onChange={(event) => setSelectedLevel(Number(event.target.value))}>
              {disasterLevels.map((entry) => (
                <option key={entry.level} value={entry.level}>Level {entry.level} — {entry.title}</option>
              ))}
            </select>
            <button
              type="button"
              className="primary-button"
              disabled={isSaving || selectedLevel === currentLevel}
              onClick={handleApply}
            >
              {isSaving ? 'Applying…' : 'Apply level'}
            </button>
          </div>
        )}

        {isCD && currentLevel === 5 && (
          <div className="note-box">
            <span>
              Minimum retention threshold: <strong>{retentionLowered ? '15% (lowered)' : '30% (standard)'}</strong>
            </span>
            {!retentionLowered && (
              <button
                type="button"
                className="action-button action-button--danger"
                disabled={isLoweringRetention}
                onClick={handleLowerRetention}
              >
                {isLoweringRetention ? 'Applying…' : 'Lower retention to 15%'}
              </button>
            )}
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="status-stack">
          {disasterLevels.map((entry) => (
            <div key={entry.level} className={`status-tier ${entry.level === currentLevel ? 'status-tier--active' : ''}`}>
              <div>
                <span>Level {entry.level}</span>
                <strong>{entry.title}</strong>
              </div>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function AdjacencyViolationPage() {
  return (
    <div className="page-stack">
      <Card title="Adjacency violation" subtitle="Direct transfer not permitted" className="card--full">
        <div className="status-page">
          <div className="status-icon status-icon--warning"><AlertTriangle size={26} /></div>
          <h3>Transfer blocked</h3>
          <p><strong>Source:</strong> Apex</p>
          <p><strong>Destination:</strong> Zion</p>
          <p>These quarters are not adjacent. Direct transfer is not permitted under current operational rules.</p>
          <div className="action-row">
            <button type="button" className="action-button">Return</button>
            <Link to="/transfers" className="primary-button action-button--link">Adjust request</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function RetentionViolationPage() {
  return (
    <div className="page-stack">
      <Card title="Retention violation" subtitle="Minimum stock requirement not satisfied" className="card--full">
        <div className="status-page">
          <div className="status-icon status-icon--warning"><ShieldAlert size={26} /></div>
          <h3>Operation blocked</h3>
          <p><strong>Resource:</strong> Food &amp; Water Supplies</p>
          <p><strong>Requested quantity:</strong> 120</p>
          <p><strong>Minimum required:</strong> 183</p>
          <p><strong>Transferable quantity:</strong> 48</p>
          <p>This request would place the source quarter below the minimum retention threshold and cannot be approved.</p>
          <div className="action-row">
            <button type="button" className="action-button">Return</button>
            <Link to="/resources" className="primary-button action-button--link">Review resources</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function PermissionDeniedPage() {
  return (
    <div className="page-stack">
      <Card title="Permission denied" subtitle="Current role cannot approve the action" className="card--full">
        <div className="status-page">
          <div className="status-icon status-icon--warning"><UserCog size={26} /></div>
          <h3>Action not authorized</h3>
          <p><strong>Action:</strong> Approve critical transfer</p>
          <p><strong>Current role:</strong> Quarter Coordinator</p>
          <p><strong>Required permission:</strong> City Director override</p>
          <p>Your role does not have the required permission to complete this operation.</p>
          <div className="action-row">
            <button type="button" className="action-button">Return</button>
            <Link to="/permissions" className="primary-button action-button--link">Open permissions</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function SuccessConfirmationPage() {
  return (
    <div className="page-stack">
      <Card title="Success confirmation" subtitle="Operation completed successfully" className="card--full">
        <div className="status-page">
          <div className="status-icon status-icon--success"><CheckCircle2 size={26} /></div>
          <h3>Request processed</h3>
          <p>The transfer was validated successfully and is now awaiting final dispatch coordination.</p>
          <div className="info-box info-box--compact">
            <strong>Summary</strong>
            <ul>
              <li>Request: TR-2042</li>
              <li>Resource: Food &amp; Water Supplies</li>
              <li>Route: Apex → Echo</li>
              <li>Quantity: 42</li>
            </ul>
          </div>
          <div className="action-row">
            <Link to="/dashboard" className="primary-button action-button--link">Return to dashboard</Link>
            <Link to="/transfers" className="action-button">View details</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
