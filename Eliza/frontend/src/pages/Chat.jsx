import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ChatMessage from '../components/ChatMessage'
import TypingIndicator from '../components/TypingIndicator'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function Chat() {
  const { user, token, logout } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hey ${user}! I'm Eliza, your assistant. How can I help you?`, intent: 'greeting' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      })

      if (res.status === 401) {
        logout()
        return
      }

      const raw = await res.text()
      let data
      try { data = JSON.parse(raw) } catch { throw new Error('Server is not reachable. Please try again later.') }

      if (!res.ok) {
        throw new Error(data.detail || 'Server error')
      }

      setMessages(prev => [...prev, { role: 'bot', text: data.response, intent: data.intent }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: err.message || 'Unable to reach the server.', intent: 'error' }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const resetChat = async () => {
    try {
      await fetch(`${API_URL}/chat/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      })
    } catch {}
    setMessages([
      { role: 'bot', text: `Conversation reset! How can I help you?`, intent: 'greeting' }
    ])
    setSidebarOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">E</div>
            <span>Eliza AI</span>
          </div>
        </div>

        <div className="sidebar-content">
          <button className="sidebar-btn" onClick={resetChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            New conversation
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user[0].toUpperCase()}</div>
            <span className="user-name">{user}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main chat */}
      <main className="chat-main">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="header-info">
            <div className="header-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                <path d="M10 21v1a2 2 0 0 0 4 0v-1" />
              </svg>
            </div>
            <div>
              <h1>Eliza</h1>
              <span className="status-dot">Online</span>
            </div>
          </div>
        </header>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
