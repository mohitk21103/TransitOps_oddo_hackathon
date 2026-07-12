import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, Input, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useVehicles } from '@/features/vehicles'
import { useCreateMaintenance } from '../hooks/useMaintenance'
import { maintenanceSchema, type MaintenanceFormValues } from '../schemas'

export function LogServicePanel() {
  const createMutation = useCreateMaintenance()
  const { data: vehicles } = useVehicles({ pageSize: 200 })
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
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { vehicleId: '', title: '', description: '', cost: 0 },
  })

  const serverError = (createMutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async (payload) => {
    try {
      await createMutation.mutateAsync(payload)
      reset()
    } catch {
      /* surfaced via serverError */
    }
  })

  return (
    <Card>
      <CardBody className="flex flex-col gap-5">
        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Log Service Record
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Select
            label="Vehicle"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            error={errors.vehicleId?.message}
            {...register('vehicleId')}
          />
          <Input
            label="Service Type"
            placeholder="e.g. Oil Change"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Cost"
            type="number"
            step="any"
            error={errors.cost?.message}
            {...register('cost', { valueAsNumber: true })}
          />
          <Input label="Date" value={today} disabled readOnly />
          <Input label="Status" value="Active" disabled readOnly />

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" isLoading={createMutation.isPending}>
            Save
          </Button>
        </form>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-medium text-emerald-600">Available</span>
            <span className="text-slate-400">→ creating active record →</span>
            <span className="font-medium text-amber-600">In Shop</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-600">In Shop</span>
            <span className="text-slate-400">→ closing record (not retired) →</span>
            <span className="font-medium text-emerald-600">Available</span>
          </div>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
            Note: In Shop vehicles are removed from the dispatch pool.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
