import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { RealtimeToasts } from './RealtimeToasts'

const pageTitles = {
  '/dashboard': 'Main Dashboard',
  '/qc-dashboard': 'QC Dashboard',
  '/city-overview': 'City Overview',
  '/resources': 'Resources',
  '/new-resource-request': 'New Resource Request',
  '/transfers': 'Transfer Requests',
  '/calendar': 'Operational Calendar',
  '/notifications': 'Notifications',
  '/lc-dashboard': 'LC Dashboard',
  '/cd-dashboard': 'CD Dashboard',
  '/permissions': 'Current Permissions',
  '/team': 'Team Permissions',
  '/catastrophe': 'Catastrophe Status',
  '/error-adjacency': 'Adjacency Violation',
  '/error-retention': 'Retention Violation',
  '/error-permission': 'Permission Denied',
  '/success-confirmation': 'Success Confirmation'
}

export function AppShell() {
  const location = useLocation()
  const title = location.pathname.startsWith('/resources/')
    ? 'Resource Details'
    : location.pathname.startsWith('/transfers/')
    ? 'Transfer Details'
    : pageTitles[location.pathname] || 'KAIJU'

  return (
    <div className="app-shell">
      <RealtimeToasts />
      <div className="main-panel">
        <Header title={title} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
