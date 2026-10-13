import { useEffect, useState } from 'react'
import { wsService } from '../../services/wsService'

const disasterTitles = {
  1: 'Watch',
  2: 'Alert',
  3: 'Emergency',
  4: 'Critical',
  5: 'Catastrophic'
}

let nextToastId = 1

export function RealtimeToasts() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    wsService.connect()

    function pushToast(tone, message) {
      const id = nextToastId++
      setToasts((current) => [...current, { id, tone, message }])
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 6000)
    }

    const unsubscribeConflict = wsService.subscribe('conflict_notification', (data) => {
      pushToast('critical', `Conflict: multiple requests are targeting resource #${data.resource_id} in the same quarter.`)
    })

    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', (data) => {
      pushToast('warning', `Disaster level changed to ${data.level} — ${disasterTitles[data.level] || ''}.`)
    })

    return () => {
      unsubscribeConflict()
      unsubscribeLevel()
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="realtime-toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`realtime-toast realtime-toast--${toast.tone}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
