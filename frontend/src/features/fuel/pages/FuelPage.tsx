import { Fuel, Plus } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { useFuelLogs } from '../hooks/useFuel'

export function FuelPage() {
  const { data, isLoading, isError } = useFuelLogs()
  const logs = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Fuel logs and operational expenses per vehicle."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Log Fuel</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Fuel}
          title="Couldn't load fuel logs"
          description="Please check your connection and try again."
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Fuel}
          title="No fuel logs yet"
          description="Record fuel entries to compute efficiency and cost."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Liters</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Odometer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3">{formatDate(log.date)}</td>
                    <td className="px-5 py-3">{formatNumber(log.liters)} L</td>
                    <td className="px-5 py-3">{formatCurrency(log.cost)}</td>
                    <td className="px-5 py-3">
                      {log.odometer ? `${formatNumber(log.odometer)} km` : '—'}
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
