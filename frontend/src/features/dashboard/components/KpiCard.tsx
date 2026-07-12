import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent = 'text-indigo-600',
}: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <Icon className={cn('h-5 w-5', accent)} />
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </Card>
  )
}
