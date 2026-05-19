const fs = require('fs');
const path = require('path');

const replacements = {
  'typ': 'type',
  'rolle': 'role',
  'volk_spezies': 'species',
  'beruf_klasse': 'profession_class',
  'alter': 'age',
  'geschlecht': 'gender',
  'herkunft': 'origin',
  'fraktion_id': 'faction_id',
  'ort_id': 'location_id',
  'kurzbeschreibung': 'short_description',
  'persoenlichkeit': 'personality',
  'ziele': 'goals',
  'aengste': 'fears',
  'schwaechen': 'weaknesses',
  'ideale': 'ideals',
  'geheimnisse': 'secrets',
  'hintergrund': 'background',
  'wichtige_ereignisse': 'important_events',
  'ausruestung': 'equipment',
  'faehigkeiten_werte_notizen': 'skills_stats_notes',
  'sichtbarkeit': 'visibility',
  
  "'familie'": "'family'",
  "'freundschaft'": "'friendship'",
  "'bekanntschaft'": "'acquaintance'",
  "'allianz'": "'alliance'",
  "'loyalitaet'": "'loyalty'",
  "'schuld_verpflichtung'": "'debt_obligation'",
  "'rivalitaet'": "'rivalry'",
  "'feindschaft'": "'enmity'",
  "'mentor_schueler'": "'mentor_student'",
  "'liebe_affaere'": "'love_affair'",
  "'geheimverbindung'": "'secret_connection'",

  "Allgemein": "General",
  "Persönlichkeit": "Personality",
  "Hintergrund": "Background",
  "Ausrüstung & Werte": "Equipment & Stats",
  "Ausrüstung": "Equipment",
  "Verknüpfungen": "Connections",
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Object keys and variables
  const keysToReplace = [
    'typ', 'rolle', 'volk_spezies', 'beruf_klasse', 'alter', 'geschlecht', 'herkunft',
    'fraktion_id', 'ort_id', 'kurzbeschreibung', 'persoenlichkeit', 'ziele', 'aengste',
    'schwaechen', 'ideale', 'geheimnisse', 'hintergrund', 'wichtige_ereignisse',
    'ausruestung', 'faehigkeiten_werte_notizen', 'sichtbarkeit'
  ];

  keysToReplace.forEach(key => {
    // Only replace if it matches exactly as a word, e.g. `c.hintergrund`, `{ hintergrund }`, `hintergrund:`
    let regex = new RegExp(`\\b${key}\\b`, 'g');
    content = content.replace(regex, replacements[key]);
  });
  
  // Relationship types strings
  const relStrings = [
    "'familie'", "'freundschaft'", "'bekanntschaft'", "'allianz'", "'loyalitaet'",
    "'schuld_verpflichtung'", "'rivalitaet'", "'feindschaft'", "'mentor_schueler'",
    "'liebe_affaere'", "'geheimverbindung'"
  ];
  relStrings.forEach(str => {
    let regex = new RegExp(str, 'g');
    content = content.replace(regex, replacements[str]);
  });

  // Comments/Texts
  content = content.replace(/Allgemein/g, 'General');
  content = content.replace(/Persönlichkeit/g, 'Personality');
  content = content.replace(/Hintergrund/g, 'Background');
  content = content.replace(/Ausrüstung & Werte/g, 'Equipment & Stats');
  content = content.replace(/Ausrüstung/g, 'Equipment');
  content = content.replace(/Verknüpfungen/g, 'Connections');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src');
