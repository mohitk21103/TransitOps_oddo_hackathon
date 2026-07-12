import { useState } from 'react'
import { Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import { Badge, Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { formatDate, daysUntil } from '@/lib/utils'
import { LICENSE_EXPIRY_WARNING_DAYS } from '@/config/constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Role } from '@/features/auth/types'
import { useDeleteDriver, useDrivers } from '../hooks/useDrivers'
import type { Driver } from '../types'
import { DriverStatusBadge } from '../components/DriverStatusBadge'
import { DriverFormModal } from '../components/DriverFormModal'

export function DriversPage() {
  const { data, isLoading, isError } = useDrivers()
  const drivers = data?.items ?? []
  const { hasAnyRole } = useAuth()
  const canManage = hasAnyRole(Role.SafetyOfficer, Role.FleetManager)
  const del = useDeleteDriver()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (d: Driver) => {
    setEditing(d)
    setModalOpen(true)
  }
  const remove = (d: Driver) => {
    if (window.confirm(`Delete driver ${d.name}?`)) del.mutate(d.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Driver Management"
        description="Driver profiles, licenses and safety scores."
        action={
          canManage ? (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Driver</Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
      ) : isError ? (
        <EmptyState icon={UserRound} title="Couldn't load drivers" description="Please check your connection and try again." />
      ) : drivers.length === 0 ? (
        <EmptyState icon={UserRound} title="No drivers yet" description="Add drivers to assign them to trips." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">License</th>
                  <th className="px-5 py-3 font-medium">Expiry</th>
                  <th className="px-5 py-3 font-medium">Safety</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  {canManage && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {drivers.map((driver) => {
                  const remaining = daysUntil(driver.licenseExpiry)
                  const expiringSoon = remaining >= 0 && remaining <= LICENSE_EXPIRY_WARNING_DAYS
                  return (
                    <tr key={driver.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">{driver.name}</td>
                      <td className="px-5 py-3">
                        <span className="block">{driver.licenseNumber}</span>
                        <span className="text-xs text-slate-400">{driver.licenseCategory}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2">
                          {formatDate(driver.licenseExpiry)}
                          {remaining < 0 ? (
                            <Badge tone="danger">Expired</Badge>
                          ) : expiringSoon ? (
                            <Badge tone="warning">{remaining}d left</Badge>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-5 py-3">{driver.safetyScore}</td>
                      <td className="px-5 py-3"><DriverStatusBadge status={driver.status} /></td>
                      {canManage && (
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEdit(driver)} aria-label="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => remove(driver)} aria-label="Delete">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {canManage && (
        <DriverFormModal open={modalOpen} onClose={() => setModalOpen(false)} driver={editing} />
      )}
    </div>
  )
}
