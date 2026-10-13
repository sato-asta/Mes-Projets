const listenersByEvent = new Map()
let socket = null
let reconnectTimer = null
let reconnectDelay = 1000

function getSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/api/ws`
}

function notify(eventType, data) {
  const listeners = listenersByEvent.get(eventType)
  if (listeners) {
    listeners.forEach((callback) => callback(data))
  }

  const wildcardListeners = listenersByEvent.get('*')
  if (wildcardListeners) {
    wildcardListeners.forEach((callback) => callback(eventType, data))
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connect()
  }, reconnectDelay)
  reconnectDelay = Math.min(reconnectDelay * 2, 15000)
}

function connect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return
  }

  try {
    socket = new WebSocket(getSocketUrl())
  } catch {
    scheduleReconnect()
    return
  }

  socket.onopen = () => {
    reconnectDelay = 1000
  }

  socket.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data)
      if (parsed && parsed.event) {
        notify(parsed.event, parsed.data)
      }
    } catch {
      // ignore malformed messages
    }
  }

  socket.onclose = () => {
    scheduleReconnect()
  }

  socket.onerror = () => {
    socket.close()
  }
}

export const wsService = {
  connect,

  subscribe(eventType, callback) {
    if (!listenersByEvent.has(eventType)) {
      listenersByEvent.set(eventType, new Set())
    }
    listenersByEvent.get(eventType).add(callback)

    return () => {
      const listeners = listenersByEvent.get(eventType)
      if (listeners) listeners.delete(callback)
    }
  }
}
