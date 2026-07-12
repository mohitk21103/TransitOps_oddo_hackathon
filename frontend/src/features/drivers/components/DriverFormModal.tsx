import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError } from '@/types'
import { useCreateDriver, useUpdateDriver } from '../hooks/useDrivers'
import {
  DRIVER_STATUS_LABELS,
  DriverStatus,
  LicenseCategory,
  type Driver,
} from '../types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'Licence number is required'),
  licenseCategory: z.enum(Object.values(LicenseCategory) as [LicenseCategory, ...LicenseCategory[]]),
  licenseExpiry: z.string().min(1, 'Licence expiry is required'),
  contactNumber: z.string(),
  safetyScore: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  status: z.enum(Object.values(DriverStatus) as [DriverStatus, ...DriverStatus[]]).optional(),
})

type FormValues = z.infer<typeof schema>

const CATEGORY_OPTIONS = Object.values(LicenseCategory).map((v) => ({ value: v, label: v }))
const STATUS_OPTIONS = Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => ({ value, label }))

interface Props {
  open: boolean
  onClose: () => void
  driver?: Driver | null
}

export function DriverFormModal({ open, onClose, driver }: Props) {
  const isEdit = Boolean(driver)
  const create = useCreateDriver()
  const update = useUpdateDriver()
  const pending = create.isPending || update.isPending
  const apiError = (create.error ?? update.error) as AppError | null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: driver
      ? {
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          licenseCategory: driver.licenseCategory,
          licenseExpiry: driver.licenseExpiry.slice(0, 10),
          contactNumber: driver.contactNumber ?? '',
          safetyScore: driver.safetyScore,
          status: driver.status,
        }
      : undefined,
  })

  const submit = handleSubmit(async (values) => {
    if (isEdit && driver) {
      await update.mutateAsync({ id: driver.id, payload: values })
    } else {
      await create.mutateAsync(values)
    }
    reset()
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit driver' : 'Add driver'}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Licence Number" error={errors.licenseNumber?.message} {...register('licenseNumber')} />
          <Select label="Licence Category" options={CATEGORY_OPTIONS} error={errors.licenseCategory?.message} {...register('licenseCategory')} />
          <Input label="Licence Expiry" type="date" error={errors.licenseExpiry?.message} {...register('licenseExpiry')} />
          <Input label="Contact Number" error={errors.contactNumber?.message} {...register('contactNumber')} />
          <Input label="Safety Score" type="number" step="1" error={errors.safetyScore?.message} {...register('safetyScore', { valueAsNumber: true })} />
          {isEdit && (
            <Select label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
          )}
        </div>

        {apiError && <p className="text-sm text-red-600 dark:text-red-400">{apiError.message}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={pending}>{isEdit ? 'Save changes' : 'Add driver'}</Button>
        </div>
      </form>
    </Modal>
  )
}
