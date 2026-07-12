import { NavLink } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { APP } from '@/config/constants'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { NAV_ITEMS } from './navigation'

export function Sidebar() {
  const { user } = useAuthStore()

  const items = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  )

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Truck className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {APP.name}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
