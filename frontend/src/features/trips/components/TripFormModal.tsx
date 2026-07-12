import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useDispatchableVehicles } from '@/features/vehicles'
import { useAssignableDrivers } from '@/features/drivers'
import { useCreateTrip } from '../hooks/useTrips'
import { tripSchema, type TripFormValues } from '../schemas'

interface TripFormModalProps {
  open: boolean
  onClose: () => void
}

export function TripFormModal({ open, onClose }: TripFormModalProps) {
  const createMutation = useCreateTrip()
  const { data: vehicles } = useDispatchableVehicles()
  const { data: drivers } = useAssignableDrivers()

  const vehicleOptions: SelectOption[] = (vehicles ?? []).map((v) => ({
    value: v.id,
    label: `${v.registrationNumber} — ${v.name}`,
  }))
  const driverOptions: SelectOption[] = (drivers ?? []).map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      cargoWeight: 0,
      plannedDistance: 0,
      revenue: 0,
    },
  })

  const serverError = (createMutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async (payload) => {
    try {
      await createMutation.mutateAsync(payload)
      reset()
      onClose()
    } catch {
      /* surfaced via serverError */
    }
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Trip"
      description="Only available vehicles and drivers can be dispatched."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Source" error={errors.source?.message} {...register('source')} />
          <Input
            label="Destination"
            error={errors.destination?.message}
            {...register('destination')}
          />
          <Select
            label="Vehicle"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            error={errors.vehicleId?.message}
            {...register('vehicleId')}
          />
          <Select
            label="Driver"
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
          <Input
            label="Revenue"
            type="number"
            step="any"
            error={errors.revenue?.message}
            {...register('revenue', { valueAsNumber: true })}
          />
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Create Trip
          </Button>
        </div>
      </form>
    </Modal>
  )
}
