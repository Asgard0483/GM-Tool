import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { Relationship } from '../../../shared/types';
import { generateId, now } from '../../../shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface RelationshipStore {
  relationships: Relationship[];
  addRelationship: (r: Omit<Relationship, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>) => Relationship;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  deleteRelationshipsForCharacter: (characterId: string) => void;
  getRelationshipsForCharacter: (characterId: string) => Relationship[];
  getRelationshipById: (id: string) => Relationship | undefined;
}

export const useRelationshipStore = create<RelationshipStore>()(
  persist(
    (set, get) => ({
      relationships: [],

      addRelationship: (r) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const rel: Relationship = {
          ...r,
          id: generateId(),
          entityType: 'relationship',
          campaignId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ relationships: [...s.relationships, rel] }));
        return rel;
      },

      updateRelationship: (id, updates) => {
        set((s) => ({
          relationships: s.relationships.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: now() } : r
          ),
        }));
      },

      deleteRelationship: (id) => {
        set((s) => ({ relationships: s.relationships.filter((r) => r.id !== id) }));
      },

      deleteRelationshipsForCharacter: (characterId) => {
        set((s) => ({
          relationships: s.relationships.filter(
            (r) => r.source_character_id !== characterId && r.target_character_id !== characterId
          ),
        }));
      },

      getRelationshipsForCharacter: (characterId) => {
        return get().relationships.filter(
          (r) => r.source_character_id === characterId || r.target_character_id === characterId
        );
      },

      getRelationshipById: (id) => get().relationships.find((r) => r.id === id),
    }),
    { 
      name: 'gmtool_relationships',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
