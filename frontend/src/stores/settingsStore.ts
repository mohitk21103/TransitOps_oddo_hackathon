import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppSettings {
  depotName: string
  currency: string
  distanceUnit: string
}

interface SettingsState extends AppSettings {
  update: (patch: Partial<AppSettings>) => void
}

/** Org-level preferences, persisted locally (no backend endpoint yet). */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      depotName: 'Gandhinagar Depot GJ4',
      currency: 'INR',
      distanceUnit: 'KM',
      update: (patch) => set(patch),
    }),
    { name: 'transitops.settings' },
  ),
)
