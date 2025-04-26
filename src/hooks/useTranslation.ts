
import { useCallback } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { translations, TranslationKey } from '@/i18n/translations';

export function useTranslation() {
  const { language } = useSettingsStore();
  
  const t = useCallback((key: TranslationKey): string => {
    // Si el idioma actual existe en las traducciones y la clave existe para ese idioma
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback a inglés si no se encuentra la traducción en el idioma actual
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Último recurso: devolver la clave como texto
    return key;
  }, [language]);

  return { t };
}
