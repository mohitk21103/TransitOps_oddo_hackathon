import { Card, CardHeader, EmptyState } from '@/components/ui'
import { Route } from 'lucide-react'
import { TripStatusBadge } from '@/features/trips'
import type { RecentTrip } from '../types'

export function RecentTripsTable({ trips }: { trips: RecentTrip[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Recent Trips" />
      {trips.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Route}
            title="No trips yet"
            description="Dispatched trips will show up here."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Trip</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Driver</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trips.map((trip) => (
                <tr key={trip.id} className="text-slate-700 dark:text-slate-300">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {trip.referenceCode}
                  </td>
                  <td className="px-5 py-3">{trip.vehicle}</td>
                  <td className="px-5 py-3">{trip.driver}</td>
                  <td className="px-5 py-3">
                    <TripStatusBadge status={trip.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
