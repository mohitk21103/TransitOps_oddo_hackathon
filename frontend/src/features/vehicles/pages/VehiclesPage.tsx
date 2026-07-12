import { Plus, Truck } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useVehicles } from '../hooks/useVehicles'
import { VEHICLE_TYPE_LABELS } from '../types'
import { VehicleStatusBadge } from '../components/VehicleStatusBadge'

export function VehiclesPage() {
  const { data, isLoading, isError } = useVehicles()
  const vehicles = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle Registry"
        description="Master list of fleet vehicles and their current status."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Vehicle</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Truck}
          title="Couldn't load vehicles"
          description="Please check your connection and try again."
        />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles yet"
          description="Register your first vehicle to start dispatching trips."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Registration</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Capacity</th>
                  <th className="px-5 py-3 font-medium">Odometer</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="px-5 py-3">{vehicle.name}</td>
                    <td className="px-5 py-3">{VEHICLE_TYPE_LABELS[vehicle.type]}</td>
                    <td className="px-5 py-3">
                      {formatNumber(vehicle.maxLoadCapacity)} kg
                    </td>
                    <td className="px-5 py-3">{formatNumber(vehicle.odometer)} km</td>
                    <td className="px-5 py-3">
                      {formatCurrency(vehicle.acquisitionCost)}
                    </td>
                    <td className="px-5 py-3">
                      <VehicleStatusBadge status={vehicle.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
