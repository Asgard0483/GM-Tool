import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import { v4 as uuidv4 } from 'uuid';

export type AudioType = 'music' | 'ambience' | 'sfx';

export interface AudioTrack {
  id: string;
  campaignId: string;
  title: string;
  type: AudioType;
  url: string; // YouTube, Spotify, or local
  tags: string[];
}

interface AudioStore {
  tracks: AudioTrack[];
  addTrack: (track: Omit<AudioTrack, 'id'>) => void;
  updateTrack: (id: string, track: Partial<AudioTrack>) => void;
  deleteTrack: (id: string) => void;
  deleteByCampaign: (campaignId: string) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      tracks: [],

      addTrack: (track) => set((state) => ({
        tracks: [...state.tracks, { ...track, id: uuidv4() }]
      })),

      updateTrack: (id, updatedFields) => set((state) => ({
        tracks: state.tracks.map(t => t.id === id ? { ...t, ...updatedFields } : t)
      })),

      deleteTrack: (id) => set((state) => ({
        tracks: state.tracks.filter(t => t.id !== id)
      })),

      deleteByCampaign: (campaignId) => set((state) => ({
        tracks: state.tracks.filter(t => t.campaignId !== campaignId)
      })),
    }),
    {
      name: 'gmtool_audio',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
