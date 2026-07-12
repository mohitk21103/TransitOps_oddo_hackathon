import { useState } from 'react'
import { Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Spinner,
} from '@/components/ui'
import { formatDate, daysUntil } from '@/lib/utils'
import { LICENSE_EXPIRY_WARNING_DAYS } from '@/config/constants'
import { useDeleteDriver, useDrivers } from '../hooks/useDrivers'
import { DriverStatusBadge } from '../components/DriverStatusBadge'
import { DriverFormModal } from '../components/DriverFormModal'
import type { Driver } from '../types'

export function DriversPage() {
  const { data, isLoading, isError } = useDrivers()
  const drivers = data?.items ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)
  const [deleting, setDeleting] = useState<Driver | null>(null)
  const deleteMutation = useDeleteDriver()

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const confirmDelete = async () => {
    if (!deleting) return
    await deleteMutation.mutateAsync(deleting.id).catch(() => {})
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Driver Management"
        description="Driver profiles, licenses and safety scores."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Driver
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={UserRound}
          title="Couldn't load drivers"
          description="Please check your connection and try again."
        />
      ) : drivers.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No drivers yet"
          description="Add drivers to assign them to trips."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
              Add Driver
            </Button>
          }
        />
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
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {drivers.map((driver) => {
                  const remaining = daysUntil(driver.licenseExpiry)
                  const expiringSoon =
                    remaining >= 0 && remaining <= LICENSE_EXPIRY_WARNING_DAYS
                  return (
                    <tr
                      key={driver.id}
                      className="text-slate-700 dark:text-slate-300"
                    >
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {driver.name}
                      </td>
                      <td className="px-5 py-3">
                        <span className="block">{driver.licenseNumber}</span>
                        <span className="text-xs text-slate-400">
                          {driver.licenseCategory}
                        </span>
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
                      <td className="px-5 py-3">
                        <DriverStatusBadge status={driver.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(driver)
                              setFormOpen(true)
                            }}
                            aria-label="Edit"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(driver)}
                            aria-label="Delete"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <DriverFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        driver={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete driver"
        message={`Remove ${deleting?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
