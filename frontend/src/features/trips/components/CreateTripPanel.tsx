import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
import { Button, Card, CardBody, Input, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { formatNumber } from '@/lib/utils'
import { useDispatchableVehicles } from '@/features/vehicles'
import { useAssignableDrivers } from '@/features/drivers'
import { useCreateTrip, useDispatchTrip } from '../hooks/useTrips'
import { tripSchema } from '../schemas'
import { TripLifecycleStepper } from './TripLifecycleStepper'

const panelSchema = tripSchema.omit({ revenue: true })
type PanelValues = z.infer<typeof panelSchema>

export function CreateTripPanel() {
  const { data: vehicles } = useDispatchableVehicles()
  const { data: drivers } = useAssignableDrivers()
  const createMutation = useCreateTrip()
  const dispatchMutation = useDispatchTrip()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PanelValues>({
    resolver: zodResolver(panelSchema),
    defaultValues: {
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      cargoWeight: 0,
      plannedDistance: 0,
    },
  })

  const vehicleOptions: SelectOption[] = (vehicles ?? []).map((v) => ({
    value: v.id,
    label: `${v.registrationNumber} — ${formatNumber(v.maxLoadCapacity)} kg capacity`,
  }))
  const driverOptions: SelectOption[] = (drivers ?? []).map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const selectedVehicle = vehicles?.find((v) => v.id === watch('vehicleId'))
  const cargo = watch('cargoWeight')
  const capacity = selectedVehicle?.maxLoadCapacity
  const overBy =
    capacity != null && Number.isFinite(cargo) && cargo > capacity
      ? cargo - capacity
      : 0
  const overCapacity = overBy > 0

  const isSubmitting = createMutation.isPending || dispatchMutation.isPending
  const serverError = (
    (dispatchMutation.error ?? createMutation.error) as AppError | null
  )?.message

  const onSubmit = handleSubmit(async (payload) => {
    try {
      const created = await createMutation.mutateAsync(payload)
      await dispatchMutation.mutateAsync(created.id)
      reset()
    } catch {
      /* surfaced via serverError */
    }
  })

  return (
    <Card>
      <CardBody className="flex flex-col gap-5">
        <TripLifecycleStepper />

        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Create Trip
          </h2>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="Source" error={errors.source?.message} {...register('source')} />
          <Input
            label="Destination"
            error={errors.destination?.message}
            {...register('destination')}
          />
          <Select
            label="Vehicle (available only)"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            error={errors.vehicleId?.message}
            {...register('vehicleId')}
          />
          <Select
            label="Driver (available only)"
            placeholder="Select a driver"
            options={driverOptions}
            error={errors.driverId?.message}
            {...register('driverId')}
          />
          <Input
            label="Cargo Weight (kg)"
            type="number"
            step="any"
            error={errors.cargoWeight?.message}
            {...register('cargoWeight', { valueAsNumber: true })}
          />
          <Input
            label="Planned Distance (km)"
            type="number"
            step="any"
            error={errors.plannedDistance?.message}
            {...register('plannedDistance', { valueAsNumber: true })}
          />

          {overCapacity && capacity != null && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm dark:border-red-900/50 dark:bg-red-950/40">
              <p className="text-red-700 dark:text-red-400">
                Vehicle Capacity: {formatNumber(capacity)} kg
              </p>
              <p className="text-red-700 dark:text-red-400">
                Cargo Weight: {formatNumber(cargo)} kg
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-4 w-4" />
                Capacity exceeded by {formatNumber(overBy)} kg — dispatch blocked
              </p>
            </div>
          )}

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={overCapacity}
              isLoading={isSubmitting}
            >
              Dispatch
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
