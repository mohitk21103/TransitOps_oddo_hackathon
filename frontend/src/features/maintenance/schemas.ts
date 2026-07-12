import { z } from 'zod'

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  cost: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
})

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>
