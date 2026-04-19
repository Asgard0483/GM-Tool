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
  typ: 'nsc' as CharacterType,
  rolle: '',
  volk_spezies: '',
  beruf_klasse: '',
  alter: '',
  geschlecht: '',
  herkunft: '',
  fraktion_id: '',
  ort_id: '',
  status: 'active' as CharacterStatus,
  tags: [],
  kurzbeschreibung: '',
  persoenlichkeit: '',
  ziele: '',
  aengste: '',
  schwaechen: '',
  ideale: '',
  geheimnisse: '',
  hintergrund: '',
  wichtige_ereignisse: '',
  ausruestung: '',
  faehigkeiten_werte_notizen: '',
  sichtbarkeit: 'public' as VisibilityType,
  notes: '',
  metadata: {},
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
