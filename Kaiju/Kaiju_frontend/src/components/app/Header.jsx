import { Bell, ChevronDown, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { catastropheState, mockUser } from '../../data/mockData'
import { authService } from '../../services/authService'
import { wsService } from '../../services/wsService'

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/city-overview', label: 'City Overview' },
  { path: '/resources', label: 'Resources' },
  { path: '/transfers', label: 'Transfers' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/notifications', label: 'Notifications' },
  { path: '/permissions', label: 'Permissions' },
  { path: '/catastrophe', label: 'Catastrophe' }
]

const disasterTitles = {
  1: 'Watch',
  2: 'Alert',
  3: 'Emergency',
  4: 'Critical',
  5: 'Catastrophic'
}

const disasterLevelClassMap = {
  1: 'status-pill--watch',
  2: 'status-pill--alert',
  3: 'status-pill--emergency',
  4: 'status-pill--critical',
  5: 'status-pill--catastrophic'
}

export function Header({ title: _title }) {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser() ?? mockUser
  const [disasterStatus, setDisasterStatus] = useState(catastropheState)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const items = currentUser.roleCode === 'CD'
    ? [...navigationItems, { path: '/team', label: 'Team' }]
    : navigationItems

  useEffect(() => {
    let ignore = false

    function applyLevel(level) {
      if (ignore) return
      setDisasterStatus({
        level,
        title: disasterTitles[level] || 'Emergency',
        summary: catastropheState.summary
      })
    }

    fetch('/api/disaster-level')
      .then(async (response) => {
        if (!response.ok) throw new Error('Backend unavailable')
        const data = await response.json()
        applyLevel(data.level)
      })
      .catch(() => {
        if (!ignore) setDisasterStatus(catastropheState)
      })

    wsService.connect()
    const unsubscribe = wsService.subscribe('disaster_level_changed', (data) => applyLevel(data.level))

    return () => {
      ignore = true
      unsubscribe()
    }
  }, [])

  const handleUserClick = () => {
    authService.logout()
    navigate('/login')
  }

  const levelClassName = disasterLevelClassMap[disasterStatus.level] || 'status-pill--emergency'

  return (
    <header className="global-header">
      <div className="header-left">
        <div className="brand-block">
          <div className="brand-logo">
            <img src={logo} alt="KAIJU logo" className="brand-logo__svg" />
          </div>
          <div>
            <div className="brand-name">KAIJU</div>
            <small>Tokyork command</small>
          </div>
        </div>

        <button
          type="button"
          className="header-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span>Menu</span>
          <ChevronDown size={15} />
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'header-nav--open' : ''}`} aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `header-link ${isActive ? 'header-link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="header-status">
        <div className={`status-pill ${levelClassName}`}>
          <ShieldCheck size={16} />
          <span>
            Level {disasterStatus.level} — {disasterStatus.title}
          </span>
        </div>

        <button type="button" className="header-user header-user--clickable" onClick={handleUserClick} aria-label="Return to login page">
          <div className="user-badge">
            {currentUser.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
        </button>

        <button type="button" className="icon-button" aria-label="Open notifications" onClick={() => navigate('/notifications')}>
          <Bell size={17} />
        </button>
      </div>
    </header>
  )
}
