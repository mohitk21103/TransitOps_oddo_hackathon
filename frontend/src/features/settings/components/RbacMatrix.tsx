import { Check } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui'

type Access = 'full' | 'view' | 'none'

const COLUMNS = ['Fleet', 'Drivers', 'Trips', 'Fuel/Exp.', 'Analytics']

const MATRIX: { role: string; cells: Access[] }[] = [
  { role: 'Fleet Manager', cells: ['full', 'full', 'none', 'none', 'full'] },
  { role: 'Dispatcher', cells: ['view', 'none', 'full', 'none', 'none'] },
  { role: 'Safety Officer', cells: ['none', 'full', 'view', 'none', 'none'] },
  { role: 'Financial Analyst', cells: ['view', 'none', 'none', 'full', 'full'] },
]

function AccessCell({ access }: { access: Access }) {
  if (access === 'full')
    return <Check className="mx-auto h-4 w-4 text-emerald-600" />
  if (access === 'view')
    return <span className="text-slate-500 dark:text-slate-400">view</span>
  return <span className="text-slate-300 dark:text-slate-600">—</span>
}

export function RbacMatrix() {
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Role-Based Access (RBAC)" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Role</th>
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 text-center font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {MATRIX.map((row) => (
              <tr key={row.role} className="text-slate-700 dark:text-slate-300">
                <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {row.role}
                </td>
                {row.cells.map((access, i) => (
                  <td key={COLUMNS[i]} className="px-4 py-3 text-center">
                    <AccessCell access={access} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
