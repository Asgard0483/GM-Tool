import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/shared/utils/storage';
import type { CalendarEvent, CalendarConfig } from '@/shared/types';
import { generateId, now } from '@/shared/utils/helpers';
import { useCampaignStore } from '@/store/campaignStore';

interface CalendarState {
  events: CalendarEvent[];
  configs: Record<string, CalendarConfig>; // campaignId -> config
  currentDates: Record<string, { day: number; month: number; year: number; time: string }>; // campaignId -> date
  
  // Actions
  addEvent: (event: Omit<CalendarEvent, 'id' | 'entityType' | 'createdAt' | 'updatedAt' | 'campaignId'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  updateConfig: (campaignId: string, config: Partial<CalendarConfig>) => void;
  setCurrentDate: (campaignId: string, date: Partial<{ day: number; month: number; year: number; time: string }>) => void;
  advanceTime: (campaignId: string, days?: number, hours?: number) => void;
  
  getEventsForCampaign: (campaignId: string) => CalendarEvent[];
  getConfigForCampaign: (campaignId: string) => CalendarConfig;
  getCurrentDateForCampaign: (campaignId: string) => { day: number; month: number; year: number; time: string };
}

const DEFAULT_CONFIG: CalendarConfig = {
  daysPerWeek: 7,
  weekDays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  months: [
    { name: 'Januar', days: 30 }, { name: 'Februar', days: 30 }, { name: 'März', days: 30 },
    { name: 'April', days: 30 }, { name: 'Mai', days: 30 }, { name: 'Juni', days: 30 },
    { name: 'Juli', days: 30 }, { name: 'August', days: 30 }, { name: 'September', days: 30 },
    { name: 'Oktober', days: 30 }, { name: 'November', days: 30 }, { name: 'Dezember', days: 30 }
  ],
  yearOffset: 1000,
  yearName: 'Ära des Aufbruchs'
};

const DEFAULT_DATE = { day: 1, month: 0, year: 1000, time: '12:00' };

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      configs: {},
      currentDates: {},

      addEvent: (data) => {
        const campaignId = useCampaignStore.getState().activeCampaignId || '';
        const event: CalendarEvent = {
          ...data,
          id: generateId(),
          entityType: 'calendar_event',
          campaignId,
          createdAt: now(),
          updatedAt: now()
        };
        set((s) => ({ events: [...s.events, event] }));
        return event;
      },

      updateEvent: (id, updates) => set((s) => ({
        events: s.events.map(e => e.id === id ? { ...e, ...updates, updatedAt: now() } : e)
      })),

      deleteEvent: (id) => set((s) => ({
        events: s.events.filter(e => e.id !== id)
      })),

      updateConfig: (campaignId, config) => set((s) => ({
        configs: { ...s.configs, [campaignId]: { ...(s.configs[campaignId] || DEFAULT_CONFIG), ...config } }
      })),

      setCurrentDate: (campaignId, date) => set((s) => ({
        currentDates: { ...s.currentDates, [campaignId]: { ...(s.currentDates[campaignId] || DEFAULT_DATE), ...date } }
      })),

      advanceTime: (campaignId, days = 0, hours = 0) => {
        const state = get();
        const config = state.getConfigForCampaign(campaignId);
        let { day, month, year, time } = state.getCurrentDateForCampaign(campaignId);

        // Simple time parsing/adding (HH:mm)
        let [h, m] = time.split(':').map(Number);
        h += hours;
        while (h >= 24) { h -= 24; day += 1; }
        day += days;

        // Multi-month tick logic
        while (day > config.months[month].days) {
          day -= config.months[month].days;
          month += 1;
          if (month >= config.months.length) {
            month = 0;
            year += 1;
          }
        }

        const newTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        state.setCurrentDate(campaignId, { day, month, year, time: newTime });
      },

      getEventsForCampaign: (campaignId) => get().events.filter(e => e.campaignId === campaignId),
      getConfigForCampaign: (campaignId) => get().configs[campaignId] || DEFAULT_CONFIG,
      getCurrentDateForCampaign: (campaignId) => get().currentDates[campaignId] || DEFAULT_DATE,
    }),
    { 
      name: 'gmtool_calendar',
      storage: createJSONStorage(() => indexedDBStorage)
    }
  )
);
