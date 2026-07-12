import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition-colors',
          'placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500',
          'dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-700',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
})
