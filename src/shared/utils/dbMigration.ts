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

export async function migrateGermanToEnglish() {
  const keysToReplace = {
    'typ': 'type', 'rolle': 'role', 'volk_spezies': 'species', 'beruf_klasse': 'profession_class', 
    'alter': 'age', 'geschlecht': 'gender', 'herkunft': 'origin', 'fraktion_id': 'faction_id', 
    'ort_id': 'location_id', 'kurzbeschreibung': 'short_description', 'persoenlichkeit': 'personality', 
    'ziele': 'goals', 'aengste': 'fears', 'schwaechen': 'weaknesses', 'ideale': 'ideals', 
    'geheimnisse': 'secrets', 'hintergrund': 'background', 'wichtige_ereignisse': 'important_events',
    'ausruestung': 'equipment', 'faehigkeiten_werte_notizen': 'skills_stats_notes', 'sichtbarkeit': 'visibility'
  };
  
  const relTypes = {
    'familie': 'family', 'freundschaft': 'friendship', 'bekanntschaft': 'acquaintance',
    'allianz': 'alliance', 'loyalitaet': 'loyalty', 'schuld_verpflichtung': 'debt_obligation',
    'rivalitaet': 'rivalry', 'feindschaft': 'enmity', 'mentor_schueler': 'mentor_student',
    'liebe_affaere': 'love_affair', 'geheimverbindung': 'secret_connection'
  };

  try {
    const charsData = await indexedDBStorage.getItem('gmtool_characters');
    if (charsData) {
      const parsed = JSON.parse(charsData);
      let changed = false;
      if (parsed.state && parsed.state.characters) {
        parsed.state.characters = parsed.state.characters.map((c: any) => {
          let updated = { ...c };
          for (const [de, en] of Object.entries(keysToReplace)) {
            if (de in updated && !(en in updated)) {
              updated[en] = updated[de];
              delete updated[de];
              changed = true;
            }
          }
          return updated;
        });
        if (changed) await indexedDBStorage.setItem('gmtool_characters', JSON.stringify(parsed));
      }
    }

    const relData = await indexedDBStorage.getItem('gmtool_relationships');
    if (relData) {
      const parsed = JSON.parse(relData);
      let changed = false;
      if (parsed.state && parsed.state.relationships) {
        parsed.state.relationships = parsed.state.relationships.map((r: any) => {
          let updated = { ...r };
          if (relTypes[updated.relationship_type as keyof typeof relTypes]) {
            updated.relationship_type = relTypes[updated.relationship_type as keyof typeof relTypes];
            changed = true;
          }
          return updated;
        });
        if (changed) await indexedDBStorage.setItem('gmtool_relationships', JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.error('Translation migration failed:', e);
  }
}

export async function runDatabaseMigration() {
  await migrateGermanToEnglish();

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
