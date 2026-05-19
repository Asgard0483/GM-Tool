const fs = require('fs');

// Fix SettingsPage.tsx
let spPath = './src/pages/SettingsPage.tsx';
if (fs.existsSync(spPath)) {
  let content = fs.readFileSync(spPath, 'utf8');
  if (!content.includes('import { useState, useEffect }')) {
    content = content.replace("import { useState }", "import { useState, useEffect }");
    fs.writeFileSync(spPath, content, 'utf8');
  }
}

// Fix GlobalSearch.tsx missing BookOpen
let gsPath = './src/shared/components/GlobalSearch.tsx';
if (fs.existsSync(gsPath)) {
  let content = fs.readFileSync(gsPath, 'utf8');
  if (!content.includes('BookOpen')) {
    content = content.replace(/import {([^}]+)} from 'lucide-react'/, (match, p1) => {
        return `import {${p1}, BookOpen } from 'lucide-react'`;
    });
    fs.writeFileSync(gsPath, content, 'utf8');
  }
}

// Fix empty entity creations missing campaignId
['characterStore', 'worldStore', 'gameplayStore', 'storyStore', 'mapStore'].forEach(store => {
  let storeDir = store === 'storyStore' ? 'story' : 
                 store === 'mapStore' ? 'maps' : 
                 store === 'characterStore' ? 'characters' : 
                 store === 'worldStore' ? 'worldbuilding' : 'gameplay';
  let path = `./src/features/${storeDir}/store/${store}.ts`;
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/metadata: \{\},/g, "metadata: {}, campaignId: '',");
    fs.writeFileSync(path, content, 'utf8');
  }
});

// Fix WorldBuildingPage EmptyState icon
let wbPath = './src/features/worldbuilding/pages/WorldBuildingPage.tsx';
if (fs.existsSync(wbPath)) {
  let content = fs.readFileSync(wbPath, 'utf8');
  content = content.replace(/icon=\{Globe\}/g, "icon={<Globe size={48} opacity={0.2} />}");
  fs.writeFileSync(wbPath, content, 'utf8');
}

// Fix seed data
['characters', 'relationships', 'worldbuilding', 'gameplay', 'maps'].forEach(file => {
  const path = `./src/seed/${file}.seed.ts`;
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    // Ensure campaignId is there for all entities
    content = content.replace(/updatedAt:\s*'([^']+)'(?!,\s*campaignId)/g, "updatedAt: '$1', campaignId: 'default'");
    fs.writeFileSync(path, content, 'utf8');
  }
});
