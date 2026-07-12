import { BarChart3, Download } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import {
  downloadCsv,
  formatCurrency,
  formatNumber,
  percent,
  type CsvColumn,
} from '@/lib/utils'
import { useFleetReport } from '../hooks/useReports'
import type { VehicleReport } from '../types'

const CSV_COLUMNS: CsvColumn<VehicleReport>[] = [
  { header: 'Registration', accessor: (r) => r.registrationNumber },
  { header: 'Distance (km)', accessor: (r) => r.distance },
  { header: 'Fuel (L)', accessor: (r) => r.fuelConsumed },
  { header: 'Efficiency (km/L)', accessor: (r) => r.fuelEfficiency.toFixed(2) },
  { header: 'Operational Cost', accessor: (r) => r.operationalCost },
  { header: 'Revenue', accessor: (r) => r.revenue },
  { header: 'ROI', accessor: (r) => r.roi.toFixed(2) },
]

export function ReportsPage() {
  const { data, isLoading, isError } = useFleetReport()
  const vehicles = data?.vehicles ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Fuel efficiency, operational cost and ROI across the fleet."
        action={
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            disabled={vehicles.length === 0}
            onClick={() =>
              downloadCsv('fleet-report', vehicles, CSV_COLUMNS)
            }
          >
            Export CSV
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={BarChart3}
          title="Couldn't load reports"
          description="Please check your connection and try again."
        />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No report data yet"
          description="Complete trips and log fuel to generate analytics."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Efficiency</th>
                  <th className="px-5 py-3 font-medium">Op. Cost</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                  <th className="px-5 py-3 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vehicles.map((row) => (
                  <tr
                    key={row.vehicleId}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {row.registrationNumber}
                    </td>
                    <td className="px-5 py-3">
                      {formatNumber(Number(row.fuelEfficiency.toFixed(2)))} km/L
                    </td>
                    <td className="px-5 py-3">
                      {formatCurrency(row.operationalCost)}
                    </td>
                    <td className="px-5 py-3">{formatCurrency(row.revenue)}</td>
                    <td className="px-5 py-3">{percent(row.roi * 100, 1)}</td>
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
