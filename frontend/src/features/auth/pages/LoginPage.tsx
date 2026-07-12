import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Truck } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { APP } from '@/config/constants'
import type { AppError } from '@/types'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas'

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await login(values).catch(() => {
      /* surfaced via loginError */
    })
  })

  const serverError = (loginError as AppError | null)?.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Truck className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {APP.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {APP.tagline}
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
          )}

          <Button type="submit" isLoading={isLoggingIn} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}
