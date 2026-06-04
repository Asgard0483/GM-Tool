import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { ItemEntity, ItemRarity } from '@/shared/types';
import { generateId, now } from '@/shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface ItemStore {
  entities: ItemEntity[];
  addEntity: (e: Omit<ItemEntity, 'id' | 'createdAt' | 'updatedAt'>) => ItemEntity;
  updateEntity: (id: string, updates: Partial<ItemEntity>) => void;
  deleteEntity: (id: string) => void;
  duplicateEntity: (id: string) => ItemEntity;
  getEntityById: (id: string) => ItemEntity | undefined;
}

export const createEmptyItem = (): Omit<ItemEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  entityType: 'item',
  title: '',
  rarity: 'common',
  stats: '',
  description: '',
  background: '',
  ownerId: '',
  tags: [],
  status: 'active',
  notes: '',
  metadata: {},
  campaignId: '',
});

export const useItemStore = create<ItemStore>()(
  persist(
    (set, get) => ({
      entities: [],

      addEntity: (e) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const entity: ItemEntity = { 
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
        const dup: ItemEntity = { ...orig, id: generateId(), title: `${orig.title} (Kopie)`, createdAt: now(), updatedAt: now() };
        set((s) => ({ entities: [...s.entities, dup] }));
        return dup;
      },

      getEntityById: (id) => get().entities.find((e) => e.id === id),
    }),
    { 
      name: 'gmtool_items',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
