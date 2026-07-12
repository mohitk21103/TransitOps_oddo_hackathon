import { Badge, type BadgeTone } from '@/components/ui'
import { DRIVER_STATUS_LABELS, DriverStatus } from '../types'

const TONE_BY_STATUS: Record<DriverStatus, BadgeTone> = {
  [DriverStatus.Available]: 'success',
  [DriverStatus.OnTrip]: 'info',
  [DriverStatus.OffDuty]: 'neutral',
  [DriverStatus.Suspended]: 'danger',
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  return <Badge tone={TONE_BY_STATUS[status]}>{DRIVER_STATUS_LABELS[status]}</Badge>
}
