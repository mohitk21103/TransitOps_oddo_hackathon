import { z } from 'zod'
import { VehicleStatus, VehicleType } from './types'

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(Object.values(VehicleType) as [VehicleType, ...VehicleType[]]),
  maxLoadCapacity: z
    .number({ message: 'Enter a number' })
    .positive('Must be greater than 0'),
  odometer: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  acquisitionCost: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  region: z.string().optional(),
  status: z
    .enum(Object.values(VehicleStatus) as [VehicleStatus, ...VehicleStatus[]])
    .optional(),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>
