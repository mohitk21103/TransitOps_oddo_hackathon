import { Badge, type BadgeTone } from '@/components/ui'
import { TRIP_STATUS_LABELS, TripStatus } from '../types'

const TONE_BY_STATUS: Record<TripStatus, BadgeTone> = {
  [TripStatus.Draft]: 'neutral',
  [TripStatus.Dispatched]: 'info',
  [TripStatus.Completed]: 'success',
  [TripStatus.Cancelled]: 'danger',
}

export function TripStatusBadge({ status }: { status: TripStatus }) {
  return <Badge tone={TONE_BY_STATUS[status]}>{TRIP_STATUS_LABELS[status]}</Badge>
}
