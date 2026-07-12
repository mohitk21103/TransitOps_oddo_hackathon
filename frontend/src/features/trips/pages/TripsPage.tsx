import { Plus, Route } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { formatDistance, formatNumber } from '@/lib/utils'
import { useTrips } from '../hooks/useTrips'
import { TripStatusBadge } from '../components/TripStatusBadge'

export function TripsPage() {
  const { data, isLoading, isError } = useTrips()
  const trips = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trip Management"
        description="Create, dispatch and track deliveries across the fleet."
        action={<Button leftIcon={<Plus className="h-4 w-4" />}>New Trip</Button>}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Route}
          title="Couldn't load trips"
          description="Please check your connection and try again."
        />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No trips yet"
          description="Create a trip to dispatch a vehicle and driver."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Route</th>
                  <th className="px-5 py-3 font-medium">Cargo</th>
                  <th className="px-5 py-3 font-medium">Distance</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {trips.map((trip) => (
                  <tr key={trip.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {trip.source} → {trip.destination}
                    </td>
                    <td className="px-5 py-3">{formatNumber(trip.cargoWeight)} kg</td>
                    <td className="px-5 py-3">
                      {formatDistance(trip.plannedDistance)}
                    </td>
                    <td className="px-5 py-3">
                      <TripStatusBadge status={trip.status} />
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
