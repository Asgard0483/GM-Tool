import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { AppSettings } from '../shared/types';

interface SettingsStore {
  settings: AppSettings;
  setTheme: (theme: AppSettings['theme']) => void;
  toggleTheme: () => void;
  setCampaignName: (name: string) => void;
  setLanguage: (lang: 'de' | 'en') => void;
  addRecentVisit: (id: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        theme: 'modern-dark',
        language: 'de',
        defaultView: 'list',
        campaignName: 'Neue Kampagne',
        lastVisited: [],
      },

      setTheme: (theme) =>
        set((s) => ({ settings: { ...s.settings, theme } })),

      toggleTheme: () => {
        const current = get().settings.theme;
        let nextTheme: AppSettings['theme'] = current;
        
        if (current === 'modern-dark') nextTheme = 'modern-light';
        else if (current === 'modern-light') nextTheme = 'modern-dark';
        else if (current === 'fantasy-dark') nextTheme = 'fantasy-light';
        else if (current === 'fantasy-light') nextTheme = 'fantasy-dark';
        
        set((s) => ({
          settings: { ...s.settings, theme: nextTheme },
        }));
      },

      setCampaignName: (campaignName) => set((s) => ({ settings: { ...s.settings, campaignName } })),
      setLanguage: (language) => set((s) => ({ settings: { ...s.settings, language } })),

      addRecentVisit: (id) => {
        const prev = get().settings.lastVisited.filter((v) => v !== id);
        set((s) => ({
          settings: { ...s.settings, lastVisited: [id, ...prev].slice(0, 20) },
        }));
      },
    }),
    { 
      name: 'gmtool_settings',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
