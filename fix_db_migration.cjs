const fs = require('fs');

let path = './src/shared/utils/dbMigration.ts';
let content = fs.readFileSync(path, 'utf8');

const migrationCode = `
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
`;

if (!content.includes('migrateGermanToEnglish')) {
  content = content.replace('export async function runDatabaseMigration() {', migrationCode + '\nexport async function runDatabaseMigration() {\n  await migrateGermanToEnglish();\n');
  fs.writeFileSync(path, content, 'utf8');
}
