import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useItemStore } from '@/features/items/store/itemStore';
import { useCalendarStore } from '@/features/calendar/store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import { seedCharacters } from './characters.seed';
import { seedRelationships } from './relationships.seed';
import { seedWorldEntities } from './worldbuilding.seed';
import { seedGameplayEntities } from './gameplay.seed';
import { seedStories } from './story.seed';
import { seedItems } from './items.seed';
import { seedEvents } from './calendar.seed';

import { cthulhuCharacters } from './cthulhu-characters.seed';
import { cthulhuWorldEntities } from './cthulhu-worldbuilding.seed';
import { cthulhuGameplayEntities } from './cthulhu-gameplay.seed';
import { cthulhuStories } from './cthulhu-story.seed';
import { cthulhuRelationships } from './cthulhu-relationships.seed';
import { cthulhuItems } from './cthulhu-items.seed';
import { cthulhuEvents, cthulhuCalendarConfig } from './cthulhu-calendar.seed';

export function loadSeedData(type: 'fantasy' | 'cthulhu' = 'fantasy') {
  const characterStore = useCharacterStore.getState();
  const relationshipStore = useRelationshipStore.getState();
  const worldStore = useWorldStore.getState();
  const gameplayStore = useGameplayStore.getState();
  const storyStore = useStoryStore.getState();
  const itemStore = useItemStore.getState();
  const calendarStore = useCalendarStore.getState();

  const campaignId = useCampaignStore.getState().activeCampaignId || 'default';

  if (type === 'fantasy') {
    useCharacterStore.setState({ characters: seedCharacters.map(c => ({ ...c, campaignId })) });
    useRelationshipStore.setState({ relationships: seedRelationships.map(r => ({ ...r, campaignId })) });
    useWorldStore.setState({ entities: seedWorldEntities.map(w => ({ ...w, campaignId })) });
    useGameplayStore.setState({ entities: seedGameplayEntities.map(g => ({ ...g, campaignId })) });
    useStoryStore.setState({ entities: seedStories.map(s => ({ ...s, campaignId })) });
    useCalendarStore.setState({ events: seedEvents.map(e => ({ ...e, campaignId })) });
    seedItems(campaignId);
  } else if (type === 'cthulhu') {
    useCharacterStore.setState({ characters: cthulhuCharacters.map(c => ({ ...c, campaignId })) });
    useRelationshipStore.setState({ relationships: cthulhuRelationships.map(r => ({ ...r, campaignId })) });
    useWorldStore.setState({ entities: cthulhuWorldEntities.map(w => ({ ...w, campaignId })) });
    useGameplayStore.setState({ entities: cthulhuGameplayEntities.map(g => ({ ...g, campaignId })) });
    useStoryStore.setState({ entities: cthulhuStories.map(s => ({ ...s, campaignId })) });
    useCalendarStore.setState({ events: cthulhuEvents.map(e => ({ ...e, campaignId })) });
    useItemStore.setState({ entities: cthulhuItems.map(i => ({ ...i, campaignId })) });
    
    // Set custom Cthulhu calendar config
    const currentConfigs = calendarStore.configs;
    useCalendarStore.setState({
      configs: {
        ...currentConfigs,
        [campaignId]: cthulhuCalendarConfig
      }
    });
  }

  // Silence unused variable warnings
  void characterStore;
  void relationshipStore;
  void worldStore;
  void gameplayStore;
  void storyStore;
  void calendarStore;
}

export function clearAllData() {
  useCharacterStore.setState({ characters: [] });
  useRelationshipStore.setState({ relationships: [] });
  useWorldStore.setState({ entities: [] });
  useGameplayStore.setState({ entities: [] });
  useStoryStore.setState({ entities: [] });
  useItemStore.setState({ entities: [] });
  useCalendarStore.setState({ events: [] });
}

export const SEED_STATS = {
  characters: seedCharacters.length,
  relationships: seedRelationships.length,
  worldEntities: seedWorldEntities.length,
  gameplayEntities: seedGameplayEntities.length,
  stories: seedStories.length,
  items: 3,
  events: seedEvents.length,
};
