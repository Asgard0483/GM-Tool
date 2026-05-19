const fs = require('fs');

// Fix seed files to include campaignId: 'default'
['characters', 'relationships', 'worldbuilding', 'gameplay', 'maps'].forEach(file => {
  const path = `./src/seed/${file}.seed.ts`;
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/updatedAt:\s*('[^']+')/g, "updatedAt: $1, campaignId: 'default'");
    fs.writeFileSync(path, content, 'utf8');
  }
});

// Fix GlobalSearch.tsx missing BookOpen
let gsPath = './src/shared/components/GlobalSearch.tsx';
if (fs.existsSync(gsPath)) {
  let content = fs.readFileSync(gsPath, 'utf8');
  if (!content.includes('BookOpen')) {
    content = content.replace("import { Search,", "import { Search, BookOpen,");
    fs.writeFileSync(gsPath, content, 'utf8');
  }
}

// Fix DiceRoller.tsx implicitly any
let drPath = './src/shared/components/DiceRoller.tsx';
if (fs.existsSync(drPath)) {
  let content = fs.readFileSync(drPath, 'utf8');
  content = content.replace(/history\.map\(r =>/g, 'history.map((r: any) =>');
  content = content.replace(/favorites\.map\(f =>/g, 'favorites.map((f: any) =>');
  fs.writeFileSync(drPath, content, 'utf8');
}

// Fix storage.ts type import
let storagePath = './src/shared/utils/storage.ts';
if (fs.existsSync(storagePath)) {
  let content = fs.readFileSync(storagePath, 'utf8');
  content = content.replace("import { StateStorage }", "import type { StateStorage }");
  fs.writeFileSync(storagePath, content, 'utf8');
}
