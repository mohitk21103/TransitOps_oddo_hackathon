import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useCreateDriver, useUpdateDriver } from '../hooks/useDrivers'
import {
  DRIVER_STATUS_LABELS,
  DriverStatus,
  LicenseCategory,
  type Driver,
} from '../types'
import { driverSchema, type DriverFormValues } from '../schemas'

const categoryOptions: SelectOption[] = Object.values(LicenseCategory).map(
  (value) => ({ value, label: value }),
)

const statusOptions: SelectOption[] = (
  Object.keys(DRIVER_STATUS_LABELS) as DriverStatus[]
).map((value) => ({ value, label: DRIVER_STATUS_LABELS[value] }))

interface DriverFormModalProps {
  open: boolean
  onClose: () => void
  driver?: Driver | null
}

export function DriverFormModal({ open, onClose, driver }: DriverFormModalProps) {
  const isEdit = Boolean(driver)
  const createMutation = useCreateDriver()
  const updateMutation = useUpdateDriver()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    values: driver
      ? {
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          licenseCategory: driver.licenseCategory,
          licenseExpiry: driver.licenseExpiry?.slice(0, 10) ?? '',
          contactNumber: driver.contactNumber ?? '',
          safetyScore: driver.safetyScore,
          status: driver.status,
        }
      : {
          name: '',
          licenseNumber: '',
          licenseCategory: LicenseCategory.LMV,
          licenseExpiry: '',
          contactNumber: '',
          safetyScore: 100,
        },
  })

  const mutation = isEdit ? updateMutation : createMutation
  const serverError = (mutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (isEdit && driver) {
        await updateMutation.mutateAsync({ id: driver.id, payload })
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
      title={isEdit ? 'Edit Driver' : 'Add Driver'}
      description={isEdit ? driver?.name : 'Register a new driver.'}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input
            label="License Number"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber')}
          />
          <Select
            label="License Category"
            options={categoryOptions}
            error={errors.licenseCategory?.message}
            {...register('licenseCategory')}
          />
          <Input
            label="License Expiry"
            type="date"
            error={errors.licenseExpiry?.message}
            {...register('licenseExpiry')}
          />
          <Input
            label="Contact Number"
            error={errors.contactNumber?.message}
            {...register('contactNumber')}
          />
          <Input
            label="Safety Score"
            type="number"
            step="any"
            error={errors.safetyScore?.message}
            {...register('safetyScore', { valueAsNumber: true })}
          />
          {isEdit && (
            <Select
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
              {...register('status')}
            />
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Add Driver'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
