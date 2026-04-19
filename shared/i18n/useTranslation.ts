import { useSettingsStore } from '@/store/settingsStore';
import { de } from './de';
import { en } from './en';

const dictionaries: Record<string, any> = { de, en };

export function useTranslation() {
  const language = useSettingsStore(s => s.settings.language) || 'de';

  const t = (path: string, params?: Record<string, string | number>) => {
    const keys = path.split('.');
    let val = dictionaries[language];

    for (const key of keys) {
      if (val === undefined || val === null) break;
      val = val[key];
    }

    if (val === undefined || typeof val !== 'string') {
      return path; // Fallback to key if not found
    }

    let result = val;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        result = result.replace(`{{${key}}}`, String(value));
      }
    }

    return result;
  };

  return { t, language };
}
