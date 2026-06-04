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

export function loadSeedData() {
  const characterStore = useCharacterStore.getState();
  const relationshipStore = useRelationshipStore.getState();
  const worldStore = useWorldStore.getState();
  const gameplayStore = useGameplayStore.getState();
  const storyStore = useStoryStore.getState();
  const itemStore = useItemStore.getState();
  const calendarStore = useCalendarStore.getState();

  const campaignId = useCampaignStore.getState().activeCampaignId;

  // Note: Stores will automatically persist to IndexedDB via Zustand
  // We don't manually clear storage here to avoid direct DB coupling.
  // Instead, the stores are updated below.

  // Load seed characters (bypass addCharacter to preserve IDs)
  useCharacterStore.setState({ 
    characters: seedCharacters.map(c => ({ ...c, campaignId: campaignId || '' })) 
  });
  useRelationshipStore.setState({ 
    relationships: seedRelationships.map(r => ({ ...r, campaignId: campaignId || '' })) 
  });
  useWorldStore.setState({ 
    entities: seedWorldEntities.map(w => ({ ...w, campaignId: campaignId || '' })) 
  });
  useGameplayStore.setState({ 
    entities: seedGameplayEntities.map(g => ({ ...g, campaignId: campaignId || '' })) 
  });
  useStoryStore.setState({
    entities: seedStories.map(s => ({ ...s, campaignId: campaignId || '' }))
  });
  useCalendarStore.setState({
    events: seedEvents.map(e => ({ ...e, campaignId: campaignId || '' }))
  });
  seedItems(campaignId || '');

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
