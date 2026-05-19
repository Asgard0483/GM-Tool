import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import { generateId, now } from '@/shared/utils/helpers';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignState {
  campaigns: Campaign[];
  activeCampaignId: string | null;
  addCampaign: (name: string, description?: string) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setActiveCampaign: (id: string) => void;
  getActiveCampaign: () => Campaign | undefined;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      activeCampaignId: null,

      addCampaign: (name, description = '') => {
        const id = generateId();
        const newCampaign: Campaign = {
          id,
          name,
          description,
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
          activeCampaignId: state.activeCampaignId || id, // Auto-select if first
        }));
        return newCampaign;
      },

      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: now() } : c
        ),
      })),

      deleteCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        activeCampaignId: state.activeCampaignId === id ? (state.campaigns[0]?.id || null) : state.activeCampaignId,
      })),

      setActiveCampaign: (id) => set({ activeCampaignId: id }),

      getActiveCampaign: () => {
        const state = get();
        return state.campaigns.find((c) => c.id === state.activeCampaignId);
      },
    }),
    { 
      name: 'gmtool_campaigns',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
