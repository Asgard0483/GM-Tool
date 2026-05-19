const fs = require('fs');

let cdp = './src/features/characters/pages/CharacterDetailPage.tsx';
if (fs.existsSync(cdp)) {
  let c = fs.readFileSync(cdp, 'utf8');
  if (!c.includes('useParams')) {
    c = "import { useParams, useNavigate } from 'react-router-dom';\n" + c.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*'react-router-dom';/, '');
    fs.writeFileSync(cdp, c);
  }
}

let calp = './src/features/calendar/pages/CalendarPage.tsx';
if (fs.existsSync(calp)) {
  let c = fs.readFileSync(calp, 'utf8');
  c = c.replace(/year:\s*viewDate\.year,/g, "year: viewDate.year,\n      status: 'active',\n      tags: [],\n      notes: '',\n      metadata: {},");
  fs.writeFileSync(calp, c);
}

