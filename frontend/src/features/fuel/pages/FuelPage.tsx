import { useState } from 'react'
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
import { useExpenses, useFuelLogs } from '../hooks/useFuel'
import { EXPENSE_CATEGORY_LABELS } from '../types'
import { FuelFormModal } from '../components/FuelFormModal'
import { ExpenseFormModal } from '../components/ExpenseFormModal'

export function FuelPage() {
  const { data: fuelData, isLoading: fuelLoading } = useFuelLogs()
  const { data: expenseData, isLoading: expenseLoading } = useExpenses()
  const logs = fuelData?.items ?? []
  const expenses = expenseData?.items ?? []

  const [fuelOpen, setFuelOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Fuel logs and operational expenses per vehicle."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setExpenseOpen(true)}
            >
              Add Expense
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setFuelOpen(true)}
            >
              Log Fuel
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
        )}
      </Card>

      {/* Expenses */}
      <Card className="overflow-hidden">
        <CardHeader title="Other Expenses" />
        {expenseLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-7 w-7" />
          </div>
        ) : expenses.length === 0 ? (
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
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3">{formatDate(exp.date)}</td>
                    <td className="px-5 py-3">
                      {EXPENSE_CATEGORY_LABELS[exp.category]}
                    </td>
                    <td className="px-5 py-3">{formatCurrency(exp.amount)}</td>
                    <td className="px-5 py-3">{exp.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <FuelFormModal open={fuelOpen} onClose={() => setFuelOpen(false)} />
      <ExpenseFormModal open={expenseOpen} onClose={() => setExpenseOpen(false)} />
    </div>
  )
}
