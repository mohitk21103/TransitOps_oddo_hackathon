import { z } from 'zod'
import { Role } from './types'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(
    Object.values(Role) as [Role, ...Role[]],
    'Select a role',
  ),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
