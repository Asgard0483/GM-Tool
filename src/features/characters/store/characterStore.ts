import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { Character, CharacterType, CharacterStatus, VisibilityType } from '../../../shared/types';
import { generateId, now } from '../../../shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface CharacterStore {
  characters: Character[];
  addCharacter: (c: Omit<Character, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  duplicateCharacter: (id: string) => Character;
  getCharacterById: (id: string) => Character | undefined;
}

export const createEmptyCharacter = (): Omit<Character, 'id' | 'entityType' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  type: 'nsc' as CharacterType,
  role: '',
  species: '',
  profession_class: '',
  age: '',
  gender: '',
  origin: '',
  faction_id: '',
  location_id: '',
  status: 'active' as CharacterStatus,
  tags: [],
  short_description: '',
  personality: '',
  goals: '',
  fears: '',
  weaknesses: '',
  ideals: '',
  secrets: '',
  background: '',
  important_events: '',
  equipment: '',
  skills_stats_notes: '',
  visibility: 'public' as VisibilityType,
  notes: '',
  metadata: {}, campaignId: '',
});

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],

      addCharacter: (c) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const character: Character = {
          ...c,
          id: generateId(),
          entityType: 'character',
          campaignId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ characters: [...s.characters, character] }));
        return character;
      },

      updateCharacter: (id, updates) => {
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: now() } : c
          ),
        }));
      },

      deleteCharacter: (id) => {
        set((s) => ({ characters: s.characters.filter((c) => c.id !== id) }));
      },

      duplicateCharacter: (id) => {
        const orig = get().characters.find((c) => c.id === id);
        if (!orig) throw new Error('Character not found');
        const dup: Character = {
          ...orig,
          id: generateId(),
          name: `${orig.name} (Kopie)`,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ characters: [...s.characters, dup] }));
        return dup;
      },

      getCharacterById: (id) => get().characters.find((c) => c.id === id),
    }),
    { 
      name: 'gmtool_characters',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
