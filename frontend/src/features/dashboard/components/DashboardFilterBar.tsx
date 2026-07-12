import { Select } from '@/components/ui'
import type { SelectOption } from '@/types'
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
  type VehicleStatus,
  type VehicleType,
} from '@/features/vehicles'
import type { DashboardFilters } from '../types'

const ALL: SelectOption = { label: 'All', value: '' }

const typeOptions: SelectOption[] = [
  ALL,
  ...(Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((value) => ({
    value,
    label: VEHICLE_TYPE_LABELS[value],
  })),
]

const statusOptions: SelectOption[] = [
  ALL,
  ...(Object.keys(VEHICLE_STATUS_LABELS) as VehicleStatus[]).map((value) => ({
    value,
    label: VEHICLE_STATUS_LABELS[value],
  })),
]

interface DashboardFilterBarProps {
  filters: DashboardFilters
  onChange: (patch: Partial<DashboardFilters>) => void
}

export function DashboardFilterBar({ filters, onChange }: DashboardFilterBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Filters
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Vehicle Type"
          options={typeOptions}
          value={filters.vehicleType ?? ''}
          onChange={(e) => onChange({ vehicleType: e.target.value })}
        />
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status ?? ''}
          onChange={(e) => onChange({ status: e.target.value })}
        />
        <Select
          label="Region"
          options={[ALL]}
          value=""
          disabled
          title="Region data is not available yet"
        />
      </div>
    </div>
  )
}
