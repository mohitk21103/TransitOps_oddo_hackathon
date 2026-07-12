import { useMemo, useState } from 'react'
import { Route } from 'lucide-react'
import { Button, ConfirmDialog, EmptyState, Spinner } from '@/components/ui'
import { useVehicles } from '@/features/vehicles'
import { useDrivers } from '@/features/drivers'
import {
  useCancelTrip,
  useDispatchTrip,
  useTrips,
} from '../hooks/useTrips'
import { TripStatus, type Trip } from '../types'
import { TripStatusBadge } from './TripStatusBadge'
import { CompleteTripModal } from './CompleteTripModal'

const NOTE_BY_STATUS: Record<TripStatus, string> = {
  [TripStatus.Draft]: 'Awaiting dispatch',
  [TripStatus.Dispatched]: 'In transit',
  [TripStatus.Completed]: 'Completed',
  [TripStatus.Cancelled]: 'Cancelled',
}

export function LiveBoard() {
  const { data, isLoading, isError } = useTrips()
  const { data: vehicles } = useVehicles({ pageSize: 200 })
  const { data: drivers } = useDrivers({ pageSize: 200 })

  const trips = data?.items ?? []

  const vehicleMap = useMemo(
    () =>
      new Map((vehicles?.items ?? []).map((v) => [v.id, v.registrationNumber])),
    [vehicles],
  )
  const driverMap = useMemo(
    () => new Map((drivers?.items ?? []).map((d) => [d.id, d.name])),
    [drivers],
  )

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
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Live Board
      </p>

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
          description="Create and dispatch a trip to see it here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {trips.map((trip) => {
            const vehicle = vehicleMap.get(trip.vehicleId)
            const driver = driverMap.get(trip.driverId)
            return (
              <div
                key={trip.id}
                className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    #{trip.id.slice(0, 6).toUpperCase()}
                  </span>
                  <span className="text-right text-xs font-medium text-slate-600 dark:text-slate-300">
                    {vehicle && driver
                      ? `${vehicle} / ${driver}`
                      : (vehicle ?? driver ?? 'Unassigned')}
                  </span>
                </div>

                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {trip.source} → {trip.destination}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <TripStatusBadge status={trip.status} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {NOTE_BY_STATUS[trip.status]}
                  </span>
                </div>

                {(trip.status === TripStatus.Draft ||
                  trip.status === TripStatus.Dispatched) && (
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCancelling(trip)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        On complete: odometer → fuel log → expenses → Vehicle &amp; Driver available.
      </p>

      <CompleteTripModal
        open={Boolean(completing)}
        trip={completing}
        onClose={() => setCompleting(null)}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        title="Cancel trip"
        message={`Cancel ${cancelling?.source} → ${cancelling?.destination}? The vehicle and driver will be freed.`}
        confirmLabel="Cancel Trip"
        isLoading={cancelMutation.isPending}
        onConfirm={confirmCancel}
        onClose={() => setCancelling(null)}
      />
    </div>
  )
}
