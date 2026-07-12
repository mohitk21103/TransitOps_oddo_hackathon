import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { ProtectedRoute } from '@/features/auth'
import { Role } from '@/features/auth/types'
import { LoginPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { VehiclesPage } from '@/features/vehicles'
import { DriversPage } from '@/features/drivers'
import { TripsPage } from '@/features/trips'
import { MaintenancePage } from '@/features/maintenance'
import { FuelPage } from '@/features/fuel'
import { ReportsPage } from '@/features/reports'
import { ROUTES } from '@/routes/paths'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.vehicles} element={<VehiclesPage />} />
        <Route path={ROUTES.drivers} element={<DriversPage />} />
        <Route path={ROUTES.trips} element={<TripsPage />} />
        <Route path={ROUTES.maintenance} element={<MaintenancePage />} />
        <Route path={ROUTES.fuel} element={<FuelPage />} />
        <Route
          path={ROUTES.reports}
          element={
            <ProtectedRoute roles={[Role.FleetManager, Role.FinancialAnalyst]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
