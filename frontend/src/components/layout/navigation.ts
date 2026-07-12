import {
  BarChart3,
  Fuel,
  LayoutDashboard,
  Route,
  Truck,
  UserRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Role } from '@/features/auth/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** When set, only these roles see the item. Empty/undefined = everyone. */
  roles?: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Vehicles', to: ROUTES.vehicles, icon: Truck },
  { label: 'Drivers', to: ROUTES.drivers, icon: UserRound },
  { label: 'Trips', to: ROUTES.trips, icon: Route },
  { label: 'Maintenance', to: ROUTES.maintenance, icon: Wrench },
  { label: 'Fuel & Expenses', to: ROUTES.fuel, icon: Fuel },
  {
    label: 'Reports',
    to: ROUTES.reports,
    icon: BarChart3,
    roles: [Role.Admin, Role.Manager],
  },
]
