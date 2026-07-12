import { LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { useThemeStore } from '@/stores/themeStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_LABELS } from '@/features/auth/types'

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="lg:hidden">
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          TransitOps
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {user && (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
