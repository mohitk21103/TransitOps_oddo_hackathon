import { Card, CardBody, CardHeader } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { VehicleStatusBreakdown } from '../types'

const ROWS: { key: keyof VehicleStatusBreakdown; label: string; color: string }[] =
  [
    { key: 'available', label: 'Available', color: 'bg-emerald-500' },
    { key: 'onTrip', label: 'On Trip', color: 'bg-blue-500' },
    { key: 'inShop', label: 'In Shop', color: 'bg-amber-500' },
    { key: 'retired', label: 'Retired', color: 'bg-red-500' },
  ]

export function VehicleStatusBars({
  breakdown,
}: {
  breakdown: VehicleStatusBreakdown
}) {
  const total =
    breakdown.available +
    breakdown.onTrip +
    breakdown.inShop +
    breakdown.retired

  return (
    <Card>
      <CardHeader title="Vehicle Status" />
      <CardBody className="flex flex-col gap-4">
        {ROWS.map(({ key, label, color }) => {
          const value = breakdown[key]
          const pct = total === 0 ? 0 : (value / total) * 100
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm text-slate-600 dark:text-slate-400">
                {label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn('h-full rounded-full', color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                {value}
              </span>
            </div>
          )
        })}
      </CardBody>
    </Card>
  )
}
