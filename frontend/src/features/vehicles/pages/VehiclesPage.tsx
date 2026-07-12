import { useState } from 'react'
import { Pencil, Plus, Trash2, Truck } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Role } from '@/features/auth/types'
import { useDeleteVehicle, useVehicles } from '../hooks/useVehicles'
import { VEHICLE_TYPE_LABELS, type Vehicle } from '../types'
import { VehicleStatusBadge } from '../components/VehicleStatusBadge'
import { VehicleFormModal } from '../components/VehicleFormModal'

export function VehiclesPage() {
  const { data, isLoading, isError } = useVehicles()
  const vehicles = data?.items ?? []
  const { hasAnyRole } = useAuth()
  const canManage = hasAnyRole(Role.FleetManager)
  const del = useDeleteVehicle()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (v: Vehicle) => {
    setEditing(v)
    setModalOpen(true)
  }
  const remove = (v: Vehicle) => {
    if (window.confirm(`Delete vehicle ${v.registrationNumber}?`)) del.mutate(v.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle Registry"
        description="Master list of fleet vehicles and their current status."
        action={
          canManage ? (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Vehicle</Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
      ) : isError ? (
        <EmptyState icon={Truck} title="Couldn't load vehicles" description="Please check your connection and try again." />
      ) : vehicles.length === 0 ? (
        <EmptyState icon={Truck} title="No vehicles yet" description="Register your first vehicle to start dispatching trips." />
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
                  {canManage && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">{vehicle.registrationNumber}</td>
                    <td className="px-5 py-3">{vehicle.name}</td>
                    <td className="px-5 py-3">{VEHICLE_TYPE_LABELS[vehicle.type]}</td>
                    <td className="px-5 py-3">{formatNumber(vehicle.maxLoadCapacity)} kg</td>
                    <td className="px-5 py-3">{formatNumber(vehicle.odometer)} km</td>
                    <td className="px-5 py-3">{formatCurrency(vehicle.acquisitionCost)}</td>
                    <td className="px-5 py-3"><VehicleStatusBadge status={vehicle.status} /></td>
                    {canManage && (
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(vehicle)} aria-label="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(vehicle)} aria-label="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {canManage && (
        <VehicleFormModal open={modalOpen} onClose={() => setModalOpen(false)} vehicle={editing} />
      )}
    </div>
  )
}
