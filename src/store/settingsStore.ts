import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types';

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        businessName: 'My Business',
        businessEmail: 'me@example.com',
        businessPhone: '',
        businessAddress: '',
        defaultCurrency: 'HTG',
        defaultTaxRate: 0,
        language: 'fr',
      },
      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),
    }),
    { name: 'ht-settings-data' }
  )
);
