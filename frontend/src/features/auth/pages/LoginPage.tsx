import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { BrandMark } from '@/components/ui'
import { APP } from '@/config/constants'
import { cn } from '@/lib/utils'
import type { AppError } from '@/types'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas'
import { ROLE_LABELS, ROLE_OPTIONS, Role } from '../types'

const BRAND_ROLES = [
  Role.FleetManager,
  Role.Dispatcher,
  Role.SafetyOfficer,
  Role.FinancialAnalyst,
]

const ROLE_SCOPE: { role: Role; scope: string }[] = [
  { role: Role.FleetManager, scope: 'Fleet, Drivers, Maintenance, Reports' },
  { role: Role.Dispatcher, scope: 'Dashboard, Trips' },
  { role: Role.SafetyOfficer, scope: 'Drivers & compliance' },
  { role: Role.FinancialAnalyst, scope: 'Fuel, Expenses, Reports' },
]

const fieldLabel = 'text-xs font-medium uppercase tracking-wide text-slate-500'
const fieldBase =
  'h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 dark:bg-slate-900 dark:text-slate-100'

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: Role.Dispatcher,
      rememberMe: true,
    },
  })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    await login({ email, password }).catch(() => {
      /* surfaced via loginError */
    })
  })

  const serverError = (loginError as AppError | null)?.message

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      {/* Left — brand panel */}
      <aside className="hidden w-2/5 max-w-xl flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
        <div>
          <BrandMark size={52} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">{APP.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{APP.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-200">
            One login, role-scoped access:
          </p>
          <ul className="mt-4 space-y-3">
            {BRAND_ROLES.map((role) => (
              <li key={role} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {ROLE_LABELS[role]}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs uppercase tracking-wide text-slate-500">
          TransitOps © 2026 · RBAC Enabled
        </p>
      </aside>

      {/* Right — form panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark size={44} />
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to continue
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={fieldLabel}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="raven.k@transitops.in"
                className={cn(
                  fieldBase,
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-700',
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className={fieldLabel}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  fieldBase,
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-700',
                )}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className={fieldLabel}>
                Role (RBAC)
              </label>
              <select
                id="role"
                className={cn(fieldBase, 'border-slate-300 dark:border-slate-700')}
                {...register('role')}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  {...register('rememberMe')}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                Forgot password?
              </button>
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="h-11 w-full rounded-lg bg-amber-500 font-semibold text-slate-900 transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Access is scoped by role after login:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {ROLE_SCOPE.map(({ role, scope }) => (
                <li key={role}>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {ROLE_LABELS[role]}
                  </span>{' '}
                  → {scope}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
