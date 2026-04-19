import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { GameplayEntity, GameplayEntityType, GameplayStatus } from '../../../shared/types';
import { generateId, now } from '../../../shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface GameplayStore {
  entities: GameplayEntity[];
  addEntity: (e: Omit<GameplayEntity, 'id' | 'createdAt' | 'updatedAt'>) => GameplayEntity;
  updateEntity: (id: string, updates: Partial<GameplayEntity>) => void;
  deleteEntity: (id: string) => void;
  duplicateEntity: (id: string) => GameplayEntity;
  getEntityById: (id: string) => GameplayEntity | undefined;
}

export const createEmptyGameplayEntity = (type: GameplayEntityType = 'quest'): Omit<GameplayEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  entityType: type,
  title: '',
  summary: '',
  description: '',
  status: 'open' as GameplayStatus,
  related_character_ids: [],
  related_faction_ids: [],
  related_place_ids: [],
  consequences: '',
  related_reward_ids: [],
  related_scene_ids: [],
  tags: [],
  notes: '',
  metadata: {},
});

export const useGameplayStore = create<GameplayStore>()(
  persist(
    (set, get) => ({
      entities: [],

      addEntity: (e) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const entity: GameplayEntity = { 
          ...e, 
          id: generateId(), 
          campaignId, 
          createdAt: now(), 
          updatedAt: now() 
        };
        set((s) => ({ entities: [...s.entities, entity] }));
        return entity;
      },

      updateEntity: (id, updates) => {
        set((s) => ({
          entities: s.entities.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: now() } : e
          ),
        }));
      },

      deleteEntity: (id) => {
        set((s) => ({ entities: s.entities.filter((e) => e.id !== id) }));
      },

      duplicateEntity: (id) => {
        const orig = get().entities.find((e) => e.id === id);
        if (!orig) throw new Error('Entity not found');
        const dup: GameplayEntity = { ...orig, id: generateId(), title: `${orig.title} (Kopie)`, createdAt: now(), updatedAt: now() };
        set((s) => ({ entities: [...s.entities, dup] }));
        return dup;
      },

      getEntityById: (id) => get().entities.find((e) => e.id === id),
    }),
    { 
      name: 'gmtool_gameplay',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
