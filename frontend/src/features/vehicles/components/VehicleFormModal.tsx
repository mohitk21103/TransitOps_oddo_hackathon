import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { SelectOption, AppError } from '@/types'
import { useCreateVehicle, useUpdateVehicle } from '../hooks/useVehicles'
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
  VehicleStatus,
  VehicleType,
  type Vehicle,
} from '../types'
import { vehicleSchema, type VehicleFormValues } from '../schemas'

const typeOptions: SelectOption[] = (
  Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]
).map((value) => ({ value, label: VEHICLE_TYPE_LABELS[value] }))

const statusOptions: SelectOption[] = (
  Object.keys(VEHICLE_STATUS_LABELS) as VehicleStatus[]
).map((value) => ({ value, label: VEHICLE_STATUS_LABELS[value] }))

interface VehicleFormModalProps {
  open: boolean
  onClose: () => void
  vehicle?: Vehicle | null
}

export function VehicleFormModal({ open, onClose, vehicle }: VehicleFormModalProps) {
  const isEdit = Boolean(vehicle)
  const createMutation = useCreateVehicle()
  const updateMutation = useUpdateVehicle()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
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
      : {
          registrationNumber: '',
          name: '',
          type: VehicleType.Van,
          maxLoadCapacity: 0,
          odometer: 0,
          acquisitionCost: 0,
          region: '',
        },
  })

  const mutation = isEdit ? updateMutation : createMutation
  const serverError = (mutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (isEdit && vehicle) {
        await updateMutation.mutateAsync({ id: vehicle.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
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
      title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
      description={isEdit ? vehicle?.registrationNumber : 'Register a new fleet vehicle.'}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Registration Number"
            error={errors.registrationNumber?.message}
            {...register('registrationNumber')}
          />
          <Input label="Name / Model" error={errors.name?.message} {...register('name')} />
          <Select label="Type" options={typeOptions} error={errors.type?.message} {...register('type')} />
          {isEdit && (
            <Select
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
              {...register('status')}
            />
          )}
          <Input
            label="Max Load Capacity (kg)"
            type="number"
            step="any"
            error={errors.maxLoadCapacity?.message}
            {...register('maxLoadCapacity', { valueAsNumber: true })}
          />
          <Input
            label="Odometer (km)"
            type="number"
            step="any"
            error={errors.odometer?.message}
            {...register('odometer', { valueAsNumber: true })}
          />
          <Input
            label="Acquisition Cost"
            type="number"
            step="any"
            error={errors.acquisitionCost?.message}
            {...register('acquisitionCost', { valueAsNumber: true })}
          />
          <Input label="Region" error={errors.region?.message} {...register('region')} />
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
