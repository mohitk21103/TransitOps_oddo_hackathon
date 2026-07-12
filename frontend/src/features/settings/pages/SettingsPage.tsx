import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  PageHeader,
  Select,
} from '@/components/ui'
import type { SelectOption } from '@/types'
import { useSettingsStore, type AppSettings } from '@/stores/settingsStore'
import { RbacMatrix } from '../components/RbacMatrix'

const currencyOptions: SelectOption[] = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
]

const distanceOptions: SelectOption[] = [
  { value: 'KM', label: 'Kilometers' },
  { value: 'MI', label: 'Miles' },
]

export function SettingsPage() {
  const { depotName, currency, distanceUnit, update } = useSettingsStore()
  const [form, setForm] = useState<AppSettings>({
    depotName,
    currency,
    distanceUnit,
  })
  const [saved, setSaved] = useState(false)

  const patch = (p: Partial<AppSettings>) => {
    setForm((prev) => ({ ...prev, ...p }))
    setSaved(false)
  }

  const onSave = () => {
    update(form)
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Organization preferences and role-based access."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General */}
        <Card>
          <CardHeader title="General" />
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Depot Name"
              value={form.depotName}
              onChange={(e) => patch({ depotName: e.target.value })}
            />
            <Select
              label="Currency"
              options={currencyOptions}
              value={form.currency}
              onChange={(e) => patch({ currency: e.target.value })}
            />
            <Select
              label="Distance Unit"
              options={distanceOptions}
              value={form.distanceUnit}
              onChange={(e) => patch({ distanceUnit: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <Button onClick={onSave}>Save changes</Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
          </CardBody>
        </Card>

        {/* RBAC */}
        <RbacMatrix />
      </div>
    </div>
  )
}
