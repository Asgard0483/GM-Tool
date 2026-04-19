import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { MapEntity, MapPin } from '@/shared/types';
import { generateId, now } from '@/shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface MapState {
  entities: MapEntity[];
  addEntity: (e: Omit<MapEntity, 'id' | 'createdAt' | 'updatedAt' | 'entityType'>) => void;
  updateEntity: (id: string, updates: Partial<MapEntity>) => void;
  deleteEntity: (id: string) => void;
  getEntityById: (id: string) => MapEntity | undefined;
  
  // Pin actions
  addPin: (mapId: string, pin: Omit<MapPin, 'id'>) => void;
  updatePin: (mapId: string, pinId: string, updates: Partial<MapPin>) => void;
  deletePin: (mapId: string, pinId: string) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      entities: [],
      addEntity: (data) => set((state) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const newEntity: MapEntity = {
          ...data,
          id: generateId(),
          entityType: 'map',
          campaignId,
          createdAt: now(),
          updatedAt: now(),
          tags: data.tags || [],
          metadata: data.metadata || {},
          pins: data.pins || [],
        };
        return { entities: [...state.entities, newEntity] };
      }),
      updateEntity: (id, updates) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, ...updates, updatedAt: now() } : e
        ),
      })),
      deleteEntity: (id) => set((state) => ({
        entities: state.entities.filter((e) => e.id !== id),
      })),
      getEntityById: (id) => get().entities.find((e) => e.id === id),

      addPin: (mapId, pinData) => set((state) => ({
        entities: state.entities.map((e) => {
          if (e.id !== mapId) return e;
          const newPin: MapPin = { ...pinData, id: generateId() };
          return { ...e, pins: [...e.pins, newPin], updatedAt: now() };
        }),
      })),
      updatePin: (mapId, pinId, updates) => set((state) => ({
        entities: state.entities.map((e) => {
          if (e.id !== mapId) return e;
          return {
            ...e,
            pins: e.pins.map((p) => (p.id === pinId ? { ...p, ...updates } : p)),
            updatedAt: now(),
          };
        }),
      })),
      deletePin: (mapId, pinId) => set((state) => ({
        entities: state.entities.map((e) => {
          if (e.id !== mapId) return e;
          return {
            ...e,
            pins: e.pins.filter((p) => p.id !== pinId),
            updatedAt: now(),
          };
        }),
      })),
    }),
    { 
      name: 'gmtool_maps',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
