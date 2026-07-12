import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useVehicles } from '@/features/vehicles'
import { useCreateMaintenance } from '../hooks/useMaintenance'
import { maintenanceSchema, type MaintenanceFormValues } from '../schemas'

interface MaintenanceFormModalProps {
  open: boolean
  onClose: () => void
}

export function MaintenanceFormModal({ open, onClose }: MaintenanceFormModalProps) {
  const createMutation = useCreateMaintenance()
  const { data: vehicles } = useVehicles()

  const vehicleOptions: SelectOption[] = (vehicles?.items ?? []).map((v) => ({
    value: v.id,
    label: `${v.registrationNumber} — ${v.name}`,
  }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { vehicleId: '', title: '', description: '', cost: 0 },
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
      title="New Maintenance Record"
      description="Opening a record moves the vehicle to In Shop."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Select
          label="Vehicle"
          placeholder="Select a vehicle"
          options={vehicleOptions}
          error={errors.vehicleId?.message}
          {...register('vehicleId')}
        />
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Input
          label="Description"
          error={errors.description?.message}
          {...register('description')}
        />
        <Input
          label="Cost"
          type="number"
          step="any"
          error={errors.cost?.message}
          {...register('cost', { valueAsNumber: true })}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Create Record
          </Button>
        </div>
      </form>
    </Modal>
  )
}
