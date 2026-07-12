import { useMemo, useState } from 'react'
import { Fuel, Plus, Receipt } from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Spinner,
} from '@/components/ui'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { useVehicles } from '@/features/vehicles'
import { useTrips } from '@/features/trips'
import { useMaintenanceLogs } from '@/features/maintenance'
import { useExpenses, useFuelLogs } from '../hooks/useFuel'
import { ExpenseCategory } from '../types'
import { FuelFormModal } from '../components/FuelFormModal'
import { ExpenseFormModal } from '../components/ExpenseFormModal'

interface ExpenseRow {
  key: string
  tripLabel: string
  vehicle: string
  toll: number
  other: number
  maint: number
  total: number
}

export function FuelPage() {
  const { data: fuelData, isLoading: fuelLoading } = useFuelLogs()
  const { data: expenseData } = useExpenses()
  const { data: maintData } = useMaintenanceLogs()
  const { data: vehicles } = useVehicles({ pageSize: 200 })
  const { data: trips } = useTrips({ pageSize: 200 })

  const logs = fuelData?.items ?? []

  const [fuelOpen, setFuelOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  const vehicleMap = useMemo(
    () =>
      new Map((vehicles?.items ?? []).map((v) => [v.id, v.registrationNumber])),
    [vehicles],
  )
  const tripMap = useMemo(
    () => new Map((trips?.items ?? []).map((t) => [t.id, t])),
    [trips],
  )

  // Per-trip expense pivot: Toll / Other / Maint (linked) / Total.
  const expenseRows = useMemo(() => {
    const groups = new Map<string, ExpenseRow>()
    for (const e of expenseData?.items ?? []) {
      const key = e.tripId ?? '__none__'
      let row = groups.get(key)
      if (!row) {
        const trip = e.tripId ? tripMap.get(e.tripId) : undefined
        const vehicleId = trip?.vehicleId ?? e.vehicleId
        row = {
          key,
          tripLabel: e.tripId ? `#${e.tripId.slice(0, 6).toUpperCase()}` : '—',
          vehicle: vehicleId ? (vehicleMap.get(vehicleId) ?? '—') : '—',
          toll: 0,
          other: 0,
          maint: 0,
          total: 0,
        }
        groups.set(key, row)
      }
      if (e.category === ExpenseCategory.Toll) row.toll += e.amount
      else if (e.category === ExpenseCategory.Maintenance) row.maint += e.amount
      else row.other += e.amount
      row.total += e.amount
    }
    return [...groups.values()]
  }, [expenseData, tripMap, vehicleMap])

  // Total operational cost = fuel + maintenance (auto).
  const totalOperationalCost = useMemo(() => {
    const fuelTotal = (fuelData?.items ?? []).reduce((sum, l) => sum + l.cost, 0)
    const maintTotal = (maintData?.items ?? []).reduce((sum, m) => sum + m.cost, 0)
    return fuelTotal + maintTotal
  }, [fuelData, maintData])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Fuel logs, operational expenses and total cost per fleet."
        action={
          <div className="flex gap-2">
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setFuelOpen(true)}
            >
              Log Fuel
            </Button>
            <Button
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setExpenseOpen(true)}
            >
              Add Expense
            </Button>
          </div>
        }
      />

      {/* Fuel logs */}
      <Card className="overflow-hidden">
        <CardHeader title="Fuel Logs" />
        {fuelLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-7 w-7" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Fuel}
              title="No fuel logs yet"
              description="Record fuel entries to compute efficiency and cost."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Liters</th>
                  <th className="px-5 py-3 font-medium">Fuel Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {vehicleMap.get(log.vehicleId) ?? '—'}
                    </td>
                    <td className="px-5 py-3">{formatDate(log.date)}</td>
                    <td className="px-5 py-3">{formatNumber(log.liters)} L</td>
                    <td className="px-5 py-3">{formatCurrency(log.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Other expenses (per-trip pivot) */}
      <Card className="overflow-hidden">
        <CardHeader title="Other Expenses (Toll / Misc)" />
        {expenseRows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Receipt}
              title="No expenses yet"
              description="Log tolls and other operational costs."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Trip</th>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Toll</th>
                  <th className="px-5 py-3 font-medium">Other</th>
                  <th className="px-5 py-3 font-medium">Maint. (linked)</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenseRows.map((row) => (
                  <tr key={row.key} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3 font-mono text-xs text-slate-900 dark:text-slate-100">
                      {row.tripLabel}
                    </td>
                    <td className="px-5 py-3">{row.vehicle}</td>
                    <td className="px-5 py-3">{formatCurrency(row.toll)}</td>
                    <td className="px-5 py-3">{formatCurrency(row.other)}</td>
                    <td className="px-5 py-3">{formatCurrency(row.maint)}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Total operational cost */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Total Operational Cost (auto) = Fuel + Maintenance
        </span>
        <span className="text-lg font-semibold text-amber-600 dark:text-amber-500">
          {formatCurrency(totalOperationalCost)}
        </span>
      </div>

      <FuelFormModal open={fuelOpen} onClose={() => setFuelOpen(false)} />
      <ExpenseFormModal open={expenseOpen} onClose={() => setExpenseOpen(false)} />
    </div>
  )
}
