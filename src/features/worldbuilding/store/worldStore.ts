import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { WorldEntity, WorldEntityType, WorldStatus } from '../../../shared/types';
import { generateId, now } from '../../../shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface WorldStore {
  entities: WorldEntity[];
  addEntity: (e: Omit<WorldEntity, 'id' | 'createdAt' | 'updatedAt'>) => WorldEntity;
  updateEntity: (id: string, updates: Partial<WorldEntity>) => void;
  deleteEntity: (id: string) => void;
  duplicateEntity: (id: string) => WorldEntity;
  getEntityById: (id: string) => WorldEntity | undefined;
}

export const createEmptyWorldEntity = (type: WorldEntityType = 'place'): Omit<WorldEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  entityType: type,
  title: '',
  category: type,
  summary: '',
  description: '',
  tags: [],
  status: 'active' as WorldStatus,
  region_id: '',
  faction_id: '',
  related_character_ids: [],
  related_gameplay_ids: [],
  historical_references: [],
  notes: '',
  metadata: {}, campaignId: '',
});

export const useWorldStore = create<WorldStore>()(
  persist(
    (set, get) => ({
      entities: [],

      addEntity: (e) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const entity: WorldEntity = { 
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
        const dup: WorldEntity = { ...orig, id: generateId(), title: `${orig.title} (Kopie)`, createdAt: now(), updatedAt: now() };
        set((s) => ({ entities: [...s.entities, dup] }));
        return dup;
      },

      getEntityById: (id) => get().entities.find((e) => e.id === id),
    }),
    { 
      name: 'gmtool_worldbuilding',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
