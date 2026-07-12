import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useVehicles } from '@/features/vehicles'
import { useCreateFuelLog } from '../hooks/useFuel'
import { fuelSchema, type FuelFormValues } from '../schemas'

const optionalNumber = {
  setValueAs: (v: string) => (v === '' || v == null ? undefined : Number(v)),
}

interface FuelFormModalProps {
  open: boolean
  onClose: () => void
}

export function FuelFormModal({ open, onClose }: FuelFormModalProps) {
  const createMutation = useCreateFuelLog()
  const { data: vehicles } = useVehicles()
  const today = new Date().toISOString().slice(0, 10)

  const vehicleOptions: SelectOption[] = (vehicles?.items ?? []).map((v) => ({
    value: v.id,
    label: `${v.registrationNumber} — ${v.name}`,
  }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema),
    defaultValues: { vehicleId: '', liters: 0, cost: 0, date: today },
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
    <Modal open={open} onClose={onClose} title="Log Fuel" description="Record a fuel entry.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Select
          label="Vehicle"
          placeholder="Select a vehicle"
          options={vehicleOptions}
          error={errors.vehicleId?.message}
          {...register('vehicleId')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Liters"
            type="number"
            step="any"
            error={errors.liters?.message}
            {...register('liters', { valueAsNumber: true })}
          />
          <Input
            label="Cost"
            type="number"
            step="any"
            error={errors.cost?.message}
            {...register('cost', { valueAsNumber: true })}
          />
          <Input
            label="Odometer (km)"
            type="number"
            step="any"
            error={errors.odometer?.message}
            {...register('odometer', optionalNumber)}
          />
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Log Fuel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
