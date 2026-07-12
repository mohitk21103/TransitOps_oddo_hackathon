import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Modal, Select } from '@/components/ui'
import type { AppError, SelectOption } from '@/types'
import { useVehicles } from '@/features/vehicles'
import { useTrips } from '@/features/trips'
import { useCreateExpense } from '../hooks/useFuel'
import { EXPENSE_CATEGORY_LABELS, ExpenseCategory } from '../types'
import { expenseSchema, type ExpenseFormValues } from '../schemas'

const categoryOptions: SelectOption[] = (
  Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]
).map((value) => ({ value, label: EXPENSE_CATEGORY_LABELS[value] }))

interface ExpenseFormModalProps {
  open: boolean
  onClose: () => void
}

export function ExpenseFormModal({ open, onClose }: ExpenseFormModalProps) {
  const createMutation = useCreateExpense()
  const { data: vehicles } = useVehicles({ pageSize: 200 })
  const { data: trips } = useTrips({ pageSize: 200 })
  const today = new Date().toISOString().slice(0, 10)

  const vehicleOptions: SelectOption[] = [
    { value: '', label: 'None' },
    ...(vehicles?.items ?? []).map((v) => ({
      value: v.id,
      label: `${v.registrationNumber} — ${v.name}`,
    })),
  ]
  const tripOptions: SelectOption[] = [
    { value: '', label: 'None' },
    ...(trips?.items ?? []).map((t) => ({
      value: t.id,
      label: `#${t.id.slice(0, 6).toUpperCase()} · ${t.source} → ${t.destination}`,
    })),
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      vehicleId: '',
      tripId: '',
      category: ExpenseCategory.Toll,
      amount: 0,
      note: '',
      date: today,
    },
  })

  const serverError = (createMutation.error as AppError | null)?.message

  const onSubmit = handleSubmit(async ({ vehicleId, tripId, ...rest }) => {
    try {
      await createMutation.mutateAsync({
        ...rest,
        vehicleId: vehicleId || undefined,
        tripId: tripId || undefined,
      })
      reset()
      onClose()
    } catch {
      /* surfaced via serverError */
    }
  })

  return (
    <Modal open={open} onClose={onClose} title="Add Expense" description="Record an operational expense.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />
          <Input
            label="Amount"
            type="number"
            step="any"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Select
            label="Trip (optional)"
            options={tripOptions}
            error={errors.tripId?.message}
            {...register('tripId')}
          />
          <Select
            label="Vehicle (optional)"
            options={vehicleOptions}
            error={errors.vehicleId?.message}
            {...register('vehicleId')}
          />
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>
        <Input label="Note" error={errors.note?.message} {...register('note')} />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  )
}
