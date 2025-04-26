
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it' | 'hi' | 'ar';

interface SettingsStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
