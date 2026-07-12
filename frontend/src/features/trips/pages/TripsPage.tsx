import { useState } from 'react'
import { Plus, Route } from 'lucide-react'
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Spinner,
} from '@/components/ui'
import { formatDistance, formatNumber } from '@/lib/utils'
import {
  useCancelTrip,
  useDispatchTrip,
  useTrips,
} from '../hooks/useTrips'
import { TripStatus, type Trip } from '../types'
import { TripStatusBadge } from '../components/TripStatusBadge'
import { TripFormModal } from '../components/TripFormModal'
import { CompleteTripModal } from '../components/CompleteTripModal'

export function TripsPage() {
  const { data, isLoading, isError } = useTrips()
  const trips = data?.items ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [completing, setCompleting] = useState<Trip | null>(null)
  const [cancelling, setCancelling] = useState<Trip | null>(null)

  const dispatchMutation = useDispatchTrip()
  const cancelMutation = useCancelTrip()

  const confirmCancel = async () => {
    if (!cancelling) return
    await cancelMutation.mutateAsync(cancelling.id).catch(() => {})
    setCancelling(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trip Management"
        description="Create, dispatch and track deliveries across the fleet."
        action={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setFormOpen(true)}
          >
            New Trip
          </Button>
        }
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
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setFormOpen(true)}
            >
              New Trip
            </Button>
          }
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
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
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
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {trip.status === TripStatus.Draft && (
                          <Button
                            size="sm"
                            onClick={() => dispatchMutation.mutate(trip.id)}
                            isLoading={
                              dispatchMutation.isPending &&
                              dispatchMutation.variables === trip.id
                            }
                          >
                            Dispatch
                          </Button>
                        )}
                        {trip.status === TripStatus.Dispatched && (
                          <Button size="sm" onClick={() => setCompleting(trip)}>
                            Complete
                          </Button>
                        )}
                        {(trip.status === TripStatus.Draft ||
                          trip.status === TripStatus.Dispatched) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCancelling(trip)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <TripFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      <CompleteTripModal
        open={Boolean(completing)}
        trip={completing}
        onClose={() => setCompleting(null)}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        title="Cancel trip"
        message={`Cancel the trip ${cancelling?.source} → ${cancelling?.destination}? The vehicle and driver will be freed.`}
        confirmLabel="Cancel Trip"
        isLoading={cancelMutation.isPending}
        onConfirm={confirmCancel}
        onClose={() => setCancelling(null)}
      />
    </div>
  )
}
