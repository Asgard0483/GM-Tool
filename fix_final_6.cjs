const fs = require('fs');

let cdp = './src/features/characters/pages/CharacterDetailPage.tsx';
if (fs.existsSync(cdp)) {
  let c = fs.readFileSync(cdp, 'utf8');
  if (!c.includes('useParams')) {
    c = c.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*'react-router-dom';/, "import { useNavigate, useParams } from 'react-router-dom';");
    fs.writeFileSync(cdp, c);
  }
}

let calp = './src/features/calendar/pages/CalendarPage.tsx';
if (fs.existsSync(calp)) {
  let c = fs.readFileSync(calp, 'utf8');
  c = c.replace(/a\.date\.year/g, 'a.year');
  c = c.replace(/b\.date\.year/g, 'b.year');
  c = c.replace(/a\.date\.month/g, 'a.month');
  c = c.replace(/b\.date\.month/g, 'b.month');
  c = c.replace(/a\.date\.day/g, 'a.day');
  c = c.replace(/b\.date\.day/g, 'b.day');
  fs.writeFileSync(calp, c);
}

