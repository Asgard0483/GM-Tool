import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { StoryEntity } from '@/shared/types';
import { generateId, now } from '@/shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface StoryState {
  entities: StoryEntity[];
  addEntity: (e: Omit<StoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'entityType'>) => StoryEntity;
  updateEntity: (id: string, updates: Partial<StoryEntity>) => void;
  deleteEntity: (id: string) => void;
  duplicateEntity: (id: string) => StoryEntity;
  getEntityById: (id: string) => StoryEntity | undefined;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      entities: [],
      addEntity: (data) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const newEntity: StoryEntity = {
          ...data,
          id: generateId(),
          entityType: 'story',
          campaignId,
          createdAt: now(),
          updatedAt: now(),
          metadata: data.metadata || {},
          tags: data.tags || [],
        };
        set((state) => ({ entities: [...state.entities, newEntity] }));
        return newEntity;
      },
      updateEntity: (id, updates) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, ...updates, updatedAt: now() } : e
        ),
      })),
      deleteEntity: (id) => set((state) => ({
        entities: state.entities.filter((e) => e.id !== id),
      })),
      duplicateEntity: (id) => {
        const state = get();
        const orig = state.entities.find((e) => e.id === id);
        if (!orig) throw new Error('Entity not found');

        const newId = generateId();
        const dup: StoryEntity = {
          ...orig,
          id: newId,
          title: `${orig.title} (Kopie)`,
          status: 'draft',
          createdAt: now(),
          updatedAt: now(),
        };
        set({ entities: [...state.entities, dup] });
        return dup;
      },
      getEntityById: (id) => get().entities.find((e) => e.id === id),
    }),
    { 
      name: 'gmtool_story',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
