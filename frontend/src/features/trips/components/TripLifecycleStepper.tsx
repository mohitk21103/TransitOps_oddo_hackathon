import { cn } from '@/lib/utils'
import { TRIP_STATUS_LABELS, TripStatus } from '../types'

const STEPS: { status: TripStatus; dot: string }[] = [
  { status: TripStatus.Draft, dot: 'bg-emerald-500' },
  { status: TripStatus.Dispatched, dot: 'bg-blue-500' },
  { status: TripStatus.Completed, dot: 'bg-slate-300 dark:bg-slate-600' },
  { status: TripStatus.Cancelled, dot: 'bg-slate-300 dark:bg-slate-600' },
]

export function TripLifecycleStepper() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Trip Lifecycle
      </p>
      <div className="mt-3 flex items-center">
        {STEPS.map((step, i) => (
          <div key={step.status} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <span className={cn('h-4 w-4 rounded-full', step.dot)} />
              <span className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {TRIP_STATUS_LABELS[step.status]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
