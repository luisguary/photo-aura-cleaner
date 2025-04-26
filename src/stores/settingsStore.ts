
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it' | 'hi' | 'ar';

interface SettingsStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Función para detectar el idioma del navegador
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages: Language[] = ['es', 'en', 'pt', 'fr', 'de', 'it', 'hi', 'ar'];
  
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'en'; // Idioma por defecto si no se reconoce el del navegador
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Inicializa con el idioma detectado (solo se usará si no hay un valor guardado)
      language: detectBrowserLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
