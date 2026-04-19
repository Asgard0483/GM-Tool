import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import { generateId, now } from '@/shared/utils/helpers';

export interface DiceRoll {
  id: string;
  formula: string;
  result: number;
  individualResults: number[];
  timestamp: number;
  label?: string;
}

export interface DieFavorite {
  id: string;
  label: string;
  formula: string;
}

interface DiceState {
  history: DiceRoll[];
  favorites: DieFavorite[];
  
  // Actions
  addRoll: (roll: Omit<DiceRoll, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  addFavorite: (favorite: Omit<DieFavorite, 'id'>) => void;
  removeFavorite: (id: string) => void;
}

export const useDiceStore = create<DiceState>()(
  persist(
    (set) => ({
      history: [],
      favorites: [
        { id: '1', label: 'Heilung (schwach)', formula: '2d4+2' },
        { id: '2', label: 'Kurzschwert', formula: '1d6' },
        { id: '3', label: 'Initiative', formula: '1d20' }
      ],

      addRoll: (data) => set((state) => ({
        history: [
          { ...data, id: generateId(), timestamp: now() },
          ...state.history
        ].slice(0, 50) // Keep last 50 rolls
      })),

      clearHistory: () => set({ history: [] }),

      addFavorite: (data) => set((state) => ({
        favorites: [...state.favorites, { ...data, id: generateId() }]
      })),

      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id)
      }))
    }),
    { 
      name: 'gmtool_dice',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
