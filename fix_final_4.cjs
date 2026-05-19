const fs = require('fs');

// CharactersPage
let cp = './src/features/characters/pages/CharactersPage.tsx';
if (fs.existsSync(cp)) {
  let c = fs.readFileSync(cp, 'utf8');
  c = c.replace('icon={Users}', 'icon={<Users size={48} opacity={0.2} />}');
  fs.writeFileSync(cp, c);
}

// CharacterDetailPage
let cdp = './src/features/characters/pages/CharacterDetailPage.tsx';
if (fs.existsSync(cdp)) {
  let c = fs.readFileSync(cdp, 'utf8');
  if (!c.includes('useParams')) {
    c = c.replace("import { useNavigate }", "import { useNavigate, useParams }");
  }
  fs.writeFileSync(cdp, c);
}

