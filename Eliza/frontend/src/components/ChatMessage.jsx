const INTENT_LABELS = {
  sport: 'Sport',
  weather: 'Weather',
  greeting: 'Greeting',
  help: 'Help',
  error: 'Error',
}

const INTENT_COLORS = {
  sport: '#10b981',
  weather: '#3b82f6',
  greeting: '#8b5cf6',
  help: '#f59e0b',
  error: '#ef4444',
}

export default function ChatMessage({ message }) {
  const { role, text, intent } = message
  const isBot = role === 'bot'
  const showIntent = isBot && intent && intent !== 'general'

  return (
    <div className={`message-row ${role}`}>
      {isBot && (
        <div className="msg-avatar bot-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
            <path d="M10 21v1a2 2 0 0 0 4 0v-1" />
          </svg>
        </div>
      )}
      <div className={`message-bubble ${role}`}>
        {showIntent && (
          <span
            className="intent-badge"
            style={{ background: `${INTENT_COLORS[intent] || '#6b7280'}20`, color: INTENT_COLORS[intent] || '#6b7280' }}
          >
            {INTENT_LABELS[intent] || intent}
          </span>
        )}
        <p>{text}</p>
      </div>
    </div>
  )
}
