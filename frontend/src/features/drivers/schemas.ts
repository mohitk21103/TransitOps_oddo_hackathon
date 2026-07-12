import { z } from 'zod'
import { DriverStatus, LicenseCategory } from './types'

export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseCategory: z.enum(
    Object.values(LicenseCategory) as [LicenseCategory, ...LicenseCategory[]],
  ),
  licenseExpiry: z.string().min(1, 'License expiry is required'),
  contactNumber: z.string().optional(),
  safetyScore: z
    .number({ message: 'Enter a number' })
    .min(0, 'Min 0')
    .max(100, 'Max 100'),
  status: z
    .enum(Object.values(DriverStatus) as [DriverStatus, ...DriverStatus[]])
    .optional(),
})

export type DriverFormValues = z.infer<typeof driverSchema>
