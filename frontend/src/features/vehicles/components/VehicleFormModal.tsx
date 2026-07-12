import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError } from '@/types'
import { useCreateVehicle, useUpdateVehicle } from '../hooks/useVehicles'
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
  VehicleStatus,
  VehicleType,
  type Vehicle,
} from '../types'

const schema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  name: z.string().min(1, 'Name / model is required'),
  type: z.enum(Object.values(VehicleType) as [VehicleType, ...VehicleType[]]),
  maxLoadCapacity: z.number().positive('Capacity must be greater than 0'),
  odometer: z.number().min(0, 'Cannot be negative'),
  acquisitionCost: z.number().min(0, 'Cannot be negative'),
  region: z.string().optional(),
  status: z.enum(Object.values(VehicleStatus) as [VehicleStatus, ...VehicleStatus[]]).optional(),
})

type FormValues = z.infer<typeof schema>

const TYPE_OPTIONS = Object.entries(VEHICLE_TYPE_LABELS).map(([value, label]) => ({ value, label }))
const STATUS_OPTIONS = Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => ({ value, label }))

interface Props {
  open: boolean
  onClose: () => void
  vehicle?: Vehicle | null
}

export function VehicleFormModal({ open, onClose, vehicle }: Props) {
  const isEdit = Boolean(vehicle)
  const create = useCreateVehicle()
  const update = useUpdateVehicle()
  const pending = create.isPending || update.isPending
  const apiError = (create.error ?? update.error) as AppError | null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: vehicle
      ? {
          registrationNumber: vehicle.registrationNumber,
          name: vehicle.name,
          type: vehicle.type,
          maxLoadCapacity: vehicle.maxLoadCapacity,
          odometer: vehicle.odometer,
          acquisitionCost: vehicle.acquisitionCost,
          region: vehicle.region ?? '',
          status: vehicle.status,
        }
      : undefined,
  })

  const submit = handleSubmit(async (values) => {
    if (isEdit && vehicle) {
      await update.mutateAsync({ id: vehicle.id, payload: values })
    } else {
      await create.mutateAsync(values)
    }
    reset()
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit vehicle' : 'Register vehicle'}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Registration No." error={errors.registrationNumber?.message} {...register('registrationNumber')} />
          <Input label="Name / Model" error={errors.name?.message} {...register('name')} />
          <Select label="Type" options={TYPE_OPTIONS} error={errors.type?.message} {...register('type')} />
          <Input label="Max Load Capacity (kg)" type="number" step="0.01" error={errors.maxLoadCapacity?.message} {...register('maxLoadCapacity', { valueAsNumber: true })} />
          <Input label="Odometer (km)" type="number" step="0.01" error={errors.odometer?.message} {...register('odometer', { valueAsNumber: true })} />
          <Input label="Acquisition Cost" type="number" step="0.01" error={errors.acquisitionCost?.message} {...register('acquisitionCost', { valueAsNumber: true })} />
          <Input label="Region" error={errors.region?.message} {...register('region')} />
          {isEdit && (
            <Select label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
          )}
        </div>

        {apiError && <p className="text-sm text-red-600 dark:text-red-400">{apiError.message}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={pending}>{isEdit ? 'Save changes' : 'Register'}</Button>
        </div>
      </form>
    </Modal>
  )
}
