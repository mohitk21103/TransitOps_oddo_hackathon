import {
  CarFront,
  CircleParking,
  Gauge,
  Route,
  Timer,
  UserCheck,
  Wrench,
} from 'lucide-react'
import { PageHeader, Spinner } from '@/components/ui'
import { percent } from '@/lib/utils'
import { useDashboardKpis } from '../hooks/useDashboard'
import { KpiCard } from '../components/KpiCard'
import type { DashboardKpis } from '../types'

const EMPTY_KPIS: DashboardKpis = {
  activeVehicles: 0,
  availableVehicles: 0,
  vehiclesInMaintenance: 0,
  activeTrips: 0,
  pendingTrips: 0,
  driversOnDuty: 0,
  fleetUtilization: 0,
}

export function DashboardPage() {
  const { data, isLoading } = useDashboardKpis()
  const kpis = data ?? EMPTY_KPIS

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of fleet operations."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Active Vehicles"
            value={kpis.activeVehicles}
            icon={CarFront}
          />
          <KpiCard
            label="Available Vehicles"
            value={kpis.availableVehicles}
            icon={CircleParking}
            accent="text-emerald-600"
          />
          <KpiCard
            label="In Maintenance"
            value={kpis.vehiclesInMaintenance}
            icon={Wrench}
            accent="text-amber-600"
          />
          <KpiCard
            label="Fleet Utilization"
            value={percent(kpis.fleetUtilization)}
            icon={Gauge}
            accent="text-indigo-600"
          />
          <KpiCard label="Active Trips" value={kpis.activeTrips} icon={Route} />
          <KpiCard
            label="Pending Trips"
            value={kpis.pendingTrips}
            icon={Timer}
            accent="text-slate-500"
          />
          <KpiCard
            label="Drivers On Duty"
            value={kpis.driversOnDuty}
            icon={UserCheck}
            accent="text-emerald-600"
          />
        </div>
      )}
    </div>
  )
}
