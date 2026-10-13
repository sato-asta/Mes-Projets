import { NavLink } from 'react-router-dom'

const primaryNav = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/city-overview', label: 'City Overview' },
  { path: '/resources', label: 'Resources' },
  { path: '/transfers', label: 'Transfers', future: true },
  { path: '/calendar', label: 'Calendar', future: true },
  { path: '/notifications', label: 'Notifications', future: true },
  { path: '/permissions', label: 'Permissions', future: true },
  { path: '/catastrophe', label: 'Catastrophe', future: true }
]

const secondaryNav = [{ path: '/transfer-details', label: 'Transfer Details', future: true }]

export function Sidebar() {
  const items = [...primaryNav, ...secondaryNav]

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-logo">
          <span>K</span>
        </div>
        <div>
          <div className="brand-name">KAIJU</div>
          <small>Tokyork command</small>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''} ${item.future ? 'sidebar-link--future' : ''}`
            }
          >
            <span>{item.label}</span>
            {item.future && <small>Soon</small>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
