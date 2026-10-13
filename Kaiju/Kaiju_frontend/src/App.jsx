import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/app/AppShell'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { MainDashboardPage } from './pages/MainDashboardPage'
import { QcDashboardPage } from './pages/QcDashboardPage'
import { CityOverviewPage } from './pages/CityOverviewPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ResourceDetailsPage } from './pages/ResourceDetailsPage'
import { TeamPermissionsPage } from './pages/TeamPermissionsPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import {
  NewResourceRequestPage,
  TransferRequestsPage,
  TransferDetailsPage,
  OperationalCalendarPage,
  NotificationsPage,
  LcDashboardPage,
  CdDashboardPage,
  CurrentPermissionsPage,
  CatastropheStatusPage,
  AdjacencyViolationPage,
  RetentionViolationPage,
  PermissionDeniedPage,
  SuccessConfirmationPage
} from './pages/ExtendedPages'
import { authService } from './services/authService'
import './App.css'

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function CDOnlyRoute({ children }) {
  const currentUser = authService.getCurrentUser()

  if (currentUser?.roleCode !== 'CD') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<MainDashboardPage />} />
          <Route path="/qc-dashboard" element={<QcDashboardPage />} />
          <Route path="/city-overview" element={<CityOverviewPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetailsPage />} />
          <Route path="/new-resource-request" element={<NewResourceRequestPage />} />
          <Route path="/transfers" element={<TransferRequestsPage />} />
          <Route path="/transfer-requests" element={<TransferRequestsPage />} />
          <Route path="/transfers/:transferId" element={<TransferDetailsPage />} />
          <Route path="/calendar" element={<OperationalCalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/lc-dashboard" element={<LcDashboardPage />} />
          <Route path="/cd-dashboard" element={<CdDashboardPage />} />
          <Route path="/permissions" element={<CurrentPermissionsPage />} />
          <Route path="/team" element={<CDOnlyRoute><TeamPermissionsPage /></CDOnlyRoute>} />
          <Route path="/catastrophe" element={<CatastropheStatusPage />} />
          <Route path="/error-adjacency" element={<AdjacencyViolationPage />} />
          <Route path="/error-retention" element={<RetentionViolationPage />} />
          <Route path="/error-permission" element={<PermissionDeniedPage />} />
          <Route path="/success-confirmation" element={<SuccessConfirmationPage />} />

          <Route path="/placeholder" element={<PlaceholderPage />} />
        </Route>

        <Route path="*" element={<Navigate to={authService.isAuthenticated() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
