import { PageHeader } from '@/components/ui'
import { CreateTripPanel } from '../components/CreateTripPanel'
import { LiveBoard } from '../components/LiveBoard'

export function TripsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trip Dispatcher"
        description="Create and dispatch trips, and track the live board."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreateTripPanel />
        <LiveBoard />
      </div>
    </div>
  )
}
