import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal } from '@/components/ui'
import type { AppError } from '@/types'
import { useCompleteTrip } from '../hooks/useTrips'
import type { Trip } from '../types'
import { completeTripSchema, type CompleteTripFormValues } from '../schemas'

interface CompleteTripModalProps {
  open: boolean
  onClose: () => void
  trip: Trip | null
}

export function CompleteTripModal({ open, onClose, trip }: CompleteTripModalProps) {
  const completeMutation = useCompleteTrip()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompleteTripFormValues>({
    resolver: zodResolver(completeTripSchema),
    defaultValues: { endOdometer: 0, fuelConsumed: 0 },
  })

  const serverError = (completeMutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async (payload) => {
    if (!trip) return
    try {
      await completeMutation.mutateAsync({ id: trip.id, payload })
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
      title="Complete Trip"
      description={trip ? `${trip.source} → ${trip.destination}` : undefined}
      size="sm"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Final Odometer (km)"
          type="number"
          step="any"
          error={errors.endOdometer?.message}
          {...register('endOdometer', { valueAsNumber: true })}
        />
        <Input
          label="Fuel Consumed (L)"
          type="number"
          step="any"
          error={errors.fuelConsumed?.message}
          {...register('fuelConsumed', { valueAsNumber: true })}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={completeMutation.isPending}>
            Complete Trip
          </Button>
        </div>
      </form>
    </Modal>
  )
}
