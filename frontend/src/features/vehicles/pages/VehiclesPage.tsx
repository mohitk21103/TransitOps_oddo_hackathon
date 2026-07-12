import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, Truck } from 'lucide-react'
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  Select,
  Spinner,
} from '@/components/ui'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { SelectOption } from '@/types'
import { useDeleteVehicle, useVehicles } from '../hooks/useVehicles'
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
  type Vehicle,
  type VehicleStatus,
  type VehicleType,
} from '../types'
import { VehicleStatusBadge } from '../components/VehicleStatusBadge'
import { VehicleFormModal } from '../components/VehicleFormModal'

const ALL: SelectOption = { label: 'All', value: '' }

const typeOptions: SelectOption[] = [
  ALL,
  ...(Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((value) => ({
    value,
    label: VEHICLE_TYPE_LABELS[value],
  })),
]

const statusOptions: SelectOption[] = [
  ALL,
  ...(Object.keys(VEHICLE_STATUS_LABELS) as VehicleStatus[]).map((value) => ({
    value,
    label: VEHICLE_STATUS_LABELS[value],
  })),
]

export function VehiclesPage() {
  const { data, isLoading, isError } = useVehicles({ pageSize: 200 })
  const vehicles = data?.items ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [deleting, setDeleting] = useState<Vehicle | null>(null)
  const deleteMutation = useDeleteVehicle()

  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (data?.items ?? []).filter(
      (v) =>
        (!typeFilter || v.type === typeFilter) &&
        (!statusFilter || v.status === statusFilter) &&
        (!term || v.registrationNumber.toLowerCase().includes(term)),
    )
  }, [data, typeFilter, statusFilter, search])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (vehicle: Vehicle) => {
    setEditing(vehicle)
    setFormOpen(true)
  }
  const confirmDelete = async () => {
    if (!deleting) return
    await deleteMutation.mutateAsync(deleting.id).catch(() => {})
    setDeleting(null)
  }

  const hasVehicles = vehicles.length > 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle Registry"
        description="Master list of fleet vehicles and their current status."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Vehicle
          </Button>
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
      ) : !hasVehicles ? (
        <EmptyState
          icon={Truck}
          title="No vehicles yet"
          description="Register your first vehicle to start dispatching trips."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
              Add Vehicle
            </Button>
          }
        />
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              label="Type"
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Input
              label="Search"
              placeholder="Search reg. no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                      >
                        No vehicles match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((vehicle) => (
                      <tr
                        key={vehicle.id}
                        className="text-slate-700 dark:text-slate-300"
                      >
                        <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {vehicle.registrationNumber}
                        </td>
                        <td className="px-5 py-3">{vehicle.name}</td>
                        <td className="px-5 py-3">
                          {VEHICLE_TYPE_LABELS[vehicle.type]}
                        </td>
                        <td className="px-5 py-3">
                          {formatNumber(vehicle.maxLoadCapacity)} kg
                        </td>
                        <td className="px-5 py-3">
                          {formatNumber(vehicle.odometer)} km
                        </td>
                        <td className="px-5 py-3">
                          {formatCurrency(vehicle.acquisitionCost)}
                        </td>
                        <td className="px-5 py-3">
                          <VehicleStatusBadge status={vehicle.status} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(vehicle)}
                              aria-label="Edit"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(vehicle)}
                              aria-label="Delete"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <p className="text-xs text-amber-600 dark:text-amber-500">
            Rule: Registration No. must be unique · Retired / In Shop vehicles are
            hidden from the Trip Dispatcher.
          </p>
        </>
      )}

      <VehicleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        vehicle={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete vehicle"
        message={`Remove ${deleting?.registrationNumber} from the registry? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
