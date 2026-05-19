const fs = require('fs');

// Fix CharacterDetailPage
let cdp = './src/features/characters/pages/CharacterDetailPage.tsx';
if (fs.existsSync(cdp)) {
  let c = fs.readFileSync(cdp, 'utf8');
  if (!c.includes('useParams')) {
    c = c.replace(/import\s+\{[^}]*useNavigate[^}]*\}\s+from\s+'react-router-dom';/, "import { useNavigate, useParams } from 'react-router-dom';");
    fs.writeFileSync(cdp, c);
  }
}

// Fix CalendarPage
let calp = './src/features/calendar/pages/CalendarPage.tsx';
if (fs.existsSync(calp)) {
  let c = fs.readFileSync(calp, 'utf8');
  c = c.replace(/e\.date\.day/g, 'e.day');
  c = c.replace(/e\.date\.month/g, 'e.month');
  c = c.replace(/e\.date\.year/g, 'e.year');
  c = c.replace(/date:\s*\{\s*day:\s*date\.day,\s*month:\s*date\.month,\s*year:\s*date\.year\s*\}/g, 'day: date.day, month: date.month, year: date.year');
  fs.writeFileSync(calp, c);
}

// Fix ExportPage
let exp = './src/features/export/pages/ExportPage.tsx';
if (fs.existsSync(exp)) {
  let c = fs.readFileSync(exp, 'utf8');
  if (!c.includes('import { useMapStore }')) {
    c = "import { useMapStore } from '@/features/maps/store/mapStore';\n" + c;
    fs.writeFileSync(exp, c);
  }
}
