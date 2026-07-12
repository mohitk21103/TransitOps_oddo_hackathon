import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/types'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, id, ...props },
  ref,
) {
  const selectId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-10 rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition-colors',
          'focus:ring-2 focus:ring-indigo-500',
          'dark:bg-slate-900 dark:text-slate-100',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-700',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
})
