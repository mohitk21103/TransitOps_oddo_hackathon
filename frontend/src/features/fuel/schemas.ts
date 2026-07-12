import { z } from 'zod'
import { ExpenseCategory } from './types'

export const fuelSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  liters: z.number({ message: 'Enter a number' }).positive('Must be > 0'),
  cost: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  odometer: z.number().min(0, 'Cannot be negative').optional(),
  date: z.string().optional(),
})

export type FuelFormValues = z.infer<typeof fuelSchema>

export const expenseSchema = z.object({
  vehicleId: z.string().optional(),
  category: z.enum(
    Object.values(ExpenseCategory) as [ExpenseCategory, ...ExpenseCategory[]],
  ),
  amount: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  note: z.string().optional(),
  date: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>
