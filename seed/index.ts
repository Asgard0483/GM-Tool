import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { seedCharacters } from './characters.seed';
import { seedRelationships } from './relationships.seed';
import { seedWorldEntities } from './worldbuilding.seed';
import { seedGameplayEntities } from './gameplay.seed';

export function loadSeedData() {
  const characterStore = useCharacterStore.getState();
  const relationshipStore = useRelationshipStore.getState();
  const worldStore = useWorldStore.getState();
  const gameplayStore = useGameplayStore.getState();

  // Note: Stores will automatically persist to IndexedDB via Zustand
  // We don't manually clear storage here to avoid direct DB coupling.
  // Instead, the stores are updated below.

  // Load seed characters (bypass addCharacter to preserve IDs)
  useCharacterStore.setState({ characters: seedCharacters });
  useRelationshipStore.setState({ relationships: seedRelationships });
  useWorldStore.setState({ entities: seedWorldEntities });
  useGameplayStore.setState({ entities: seedGameplayEntities });

  // Silence unused variable warnings
  void characterStore;
  void relationshipStore;
  void worldStore;
  void gameplayStore;
}

export function clearAllData() {
  useCharacterStore.setState({ characters: [] });
  useRelationshipStore.setState({ relationships: [] });
  useWorldStore.setState({ entities: [] });
  useGameplayStore.setState({ entities: [] });
}

export const SEED_STATS = {
  characters: seedCharacters.length,
  relationships: seedRelationships.length,
  worldEntities: seedWorldEntities.length,
  gameplayEntities: seedGameplayEntities.length,
};
