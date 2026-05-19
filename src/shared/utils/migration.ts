import { useCampaignStore } from '@/store/campaignStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useMapStore } from '@/features/maps/store/mapStore';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';

export function runLaunchMigration() {
  const campaignStore = useCampaignStore.getState();
  
  // 1. If we already have a campaign selected, we assume migration is done or not needed
  if (campaignStore.activeCampaignId) return;

  // 2. Check if we have loose data in any store
  const chars = useCharacterStore.getState().characters;
  const world = useWorldStore.getState().entities;
  const maps = useMapStore.getState().entities;
  const story = useStoryStore.getState().entities;
  const gameplay = useGameplayStore.getState().entities;
  const rels = useRelationshipStore.getState().relationships;

  const hasData = chars.length > 0 || world.length > 0 || maps.length > 0 || story.length > 0 || gameplay.length > 0;

  if (!hasData) {
    // Fresh start: Create the very first campaign
    if (campaignStore.campaigns.length === 0) {
      campaignStore.addCampaign('Meine erste Kampagne', 'Willkommen im GM Tool!');
    }
    return;
  }

  // 3. We have loose data but no active campaign -> MIGRATION TIME
  console.log('Starting Multi-Campaign Migration...');
  
  const defaultCampaign = campaignStore.addCampaign('Migrierte Kampagne', 'Automatisch erstellt aus deinen bestehenden Daten.');
  const campaignId = defaultCampaign.id;

  // Update all stores
  if (chars.length > 0) {
    useCharacterStore.setState({
      characters: chars.map(c => ({ ...c, campaignId: c.campaignId || campaignId }))
    });
  }
  
  if (rels.length > 0) {
    useRelationshipStore.setState({
      relationships: rels.map(r => ({ ...r, campaignId: r.campaignId || campaignId }))
    });
  }

  if (world.length > 0) {
    useWorldStore.setState({
      entities: world.map(e => ({ ...e, campaignId: e.campaignId || campaignId }))
    });
  }

  if (maps.length > 0) {
    useMapStore.setState({
      entities: maps.map(m => ({ ...m, campaignId: m.campaignId || campaignId }))
    });
  }

  if (story.length > 0) {
    useStoryStore.setState({
      entities: story.map(s => ({ ...s, campaignId: s.campaignId || campaignId }))
    });
  }

  if (gameplay.length > 0) {
    useGameplayStore.setState({
      entities: gameplay.map(g => ({ ...g, campaignId: g.campaignId || campaignId }))
    });
  }

  console.log('Migration complete. Target campaign:', campaignId);
}
