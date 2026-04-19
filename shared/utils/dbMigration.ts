import { indexedDBStorage } from './storage';

const STORAGE_KEYS = [
  'gmtool_campaigns',
  'gmtool_characters',
  'gmtool_relationships',
  'gmtool_worldbuilding',
  'gmtool_gameplay',
  'gmtool_maps',
  'gmtool_story',
  'gmtool_calendar',
  'gmtool_dice',
  'gmtool_settings'
];

/**
 * Migration Service: Moves data from localStorage to IndexedDB once.
 */
export async function runDatabaseMigration() {
  let migratedCount = 0;

  for (const key of STORAGE_KEYS) {
    const localData = localStorage.getItem(key);
    
    if (localData) {
      // Check if data already exists in IndexedDB
      const idbData = await indexedDBStorage.getItem(key);
      
      if (!idbData) {
        console.log(`Migrating ${key} from localStorage to IndexedDB...`);
        await indexedDBStorage.setItem(key, localData);
        migratedCount++;
        // We keep localStorage for safety until everything is 100% verified, 
        // or the user can clear it in settings.
      }
    }
  }

  if (migratedCount > 0) {
    console.log(`Migration complete. Successfully moved ${migratedCount} stores to the dedicated database.`);
  }
}
