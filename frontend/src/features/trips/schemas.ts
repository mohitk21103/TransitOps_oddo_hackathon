import { z } from 'zod'

export const tripSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  vehicleId: z.string().min(1, 'Select a vehicle'),
  driverId: z.string().min(1, 'Select a driver'),
  cargoWeight: z.number({ message: 'Enter a number' }).positive('Must be > 0'),
  plannedDistance: z.number({ message: 'Enter a number' }).positive('Must be > 0'),
  revenue: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
})

export type TripFormValues = z.infer<typeof tripSchema>

export const completeTripSchema = z.object({
  endOdometer: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  fuelConsumed: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
})

export type CompleteTripFormValues = z.infer<typeof completeTripSchema>
