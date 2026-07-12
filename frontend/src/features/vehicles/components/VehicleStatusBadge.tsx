import { Badge, type BadgeTone } from '@/components/ui'
import { VEHICLE_STATUS_LABELS, VehicleStatus } from '../types'

const TONE_BY_STATUS: Record<VehicleStatus, BadgeTone> = {
  [VehicleStatus.Available]: 'success',
  [VehicleStatus.OnTrip]: 'info',
  [VehicleStatus.InShop]: 'warning',
  [VehicleStatus.Retired]: 'neutral',
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge tone={TONE_BY_STATUS[status]}>{VEHICLE_STATUS_LABELS[status]}</Badge>
}
