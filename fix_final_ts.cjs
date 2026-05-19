const fs = require('fs');

// Fix RelationshipsPage.tsx
let rpPath = './src/features/relationships/pages/RelationshipsPage.tsx';
if (fs.existsSync(rpPath)) {
  let content = fs.readFileSync(rpPath, 'utf8');
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace("import { useToast } from '@/shared/components/atoms/Toast';", "import { useToast } from '@/shared/components/atoms/Toast';\nimport { useTranslation } from '@/shared/i18n/useTranslation';");
    content = content.replace("export default function RelationshipsPage() {", "export default function RelationshipsPage() {\n  const { t } = useTranslation();");
    fs.writeFileSync(rpPath, content, 'utf8');
  }
}

// Fix NewStoryPage.tsx
let nspPath = './src/features/story/pages/NewStoryPage.tsx';
if (fs.existsSync(nspPath)) {
  let content = fs.readFileSync(nspPath, 'utf8');
  content = content.replace("navigate(`/story/${entity.id}`);", "navigate(`/story`);");
  fs.writeFileSync(nspPath, content, 'utf8');
}

// Fix RelationshipForm in RelationshipsPage.tsx addRelationship call
if (fs.existsSync(rpPath)) {
  let content = fs.readFileSync(rpPath, 'utf8');
  content = content.replace("metadata: {} });", "metadata: {}, campaignId: '' });");
  fs.writeFileSync(rpPath, content, 'utf8');
}

// Fix EditMapPage.tsx
let empPath = './src/features/maps/pages/EditMapPage.tsx';
if (fs.existsSync(empPath)) {
  let content = fs.readFileSync(empPath, 'utf8');
  content = content.replace("pins: entity.pins,", "pins: entity.pins,\n    campaignId: ''");
  fs.writeFileSync(empPath, content, 'utf8');
}

// Fix EditStoryPage.tsx
let espPath = './src/features/story/pages/EditStoryPage.tsx';
if (fs.existsSync(espPath)) {
  let content = fs.readFileSync(espPath, 'utf8');
  content = content.replace("status: entity.status,", "status: entity.status,\n    campaignId: ''");
  fs.writeFileSync(espPath, content, 'utf8');
}

// Fix EditCharacterPage.tsx
let ecpPath = './src/features/characters/pages/EditCharacterPage.tsx';
if (fs.existsSync(ecpPath)) {
  let content = fs.readFileSync(ecpPath, 'utf8');
  content = content.replace("visibility: entity.visibility,", "visibility: entity.visibility,\n    campaignId: ''");
  fs.writeFileSync(ecpPath, content, 'utf8');
}
