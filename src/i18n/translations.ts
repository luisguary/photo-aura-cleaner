import { Translation, Language } from './types';
import { en } from './languages/en';
import { es } from './languages/es';

export type { TranslationKey } from './types';

export const translations: Record<Language, Translation> = {
  en,
  es,
  // Other languages will be added here as they are implemented
  pt: en, // Fallback to English for now
  fr: en,
  de: en,
  it: en,
  hi: en,
  ar: en
};
