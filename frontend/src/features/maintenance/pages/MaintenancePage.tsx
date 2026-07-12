import { useMemo } from 'react'
import { Wrench } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { useVehicles } from '@/features/vehicles'
import { useCloseMaintenance, useMaintenanceLogs } from '../hooks/useMaintenance'
import { MaintenanceStatus } from '../types'
import { LogServicePanel } from '../components/LogServicePanel'

export function MaintenancePage() {
  const { data, isLoading, isError } = useMaintenanceLogs()
  const { data: vehicles } = useVehicles({ pageSize: 200 })
  const logs = data?.items ?? []

  const closeMutation = useCloseMaintenance()

  const vehicleMap = useMemo(
    () =>
      new Map((vehicles?.items ?? []).map((v) => [v.id, v.registrationNumber])),
    [vehicles],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Maintenance"
        description="Log service records; an open record moves the vehicle to In Shop."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LogServicePanel />

        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Service Log
          </p>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : isError ? (
            <EmptyState
              icon={Wrench}
              title="Couldn't load service log"
              description="Please check your connection and try again."
            />
          ) : logs.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No service records"
              description="Log a service to track vehicle upkeep and costs."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Vehicle</th>
                      <th className="px-5 py-3 font-medium">Service</th>
                      <th className="px-5 py-3 font-medium">Cost</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map((log) => {
                      const isOpen = log.status === MaintenanceStatus.Open
                      return (
                        <tr
                          key={log.id}
                          className="text-slate-700 dark:text-slate-300"
                        >
                          <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                            {vehicleMap.get(log.vehicleId) ?? '—'}
                          </td>
                          <td className="px-5 py-3">{log.title}</td>
                          <td className="px-5 py-3">{formatCurrency(log.cost)}</td>
                          <td className="px-5 py-3">
                            <Badge tone={isOpen ? 'warning' : 'success'}>
                              {isOpen ? 'In Shop' : 'Completed'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end">
                              {isOpen && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => closeMutation.mutate(log.id)}
                                  isLoading={
                                    closeMutation.isPending &&
                                    closeMutation.variables === log.id
                                  }
                                >
                                  Close
                                </Button>
                              )}
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
        </div>
      </div>
    </div>
  )
}
