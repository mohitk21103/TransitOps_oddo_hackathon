import { Plus, Wrench } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useMaintenanceLogs } from '../hooks/useMaintenance'
import { MaintenanceStatus } from '../types'

export function MaintenancePage() {
  const { data, isLoading, isError } = useMaintenanceLogs()
  const logs = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Maintenance"
        description="Service records. Opening a record moves the vehicle to In Shop."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Record</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Wrench}
          title="Couldn't load maintenance records"
          description="Please check your connection and try again."
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance records"
          description="Log a service to track vehicle upkeep and costs."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Opened</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {log.title}
                    </td>
                    <td className="px-5 py-3">{formatDate(log.openedAt)}</td>
                    <td className="px-5 py-3">{formatCurrency(log.cost)}</td>
                    <td className="px-5 py-3">
                      <Badge
                        tone={
                          log.status === MaintenanceStatus.Open
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {log.status === MaintenanceStatus.Open ? 'Open' : 'Closed'}
                      </Badge>
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
