import { useMapStore } from '@/features/maps/store/mapStore';
import { useState } from 'react';
import { Download, FileJson, FileText, File, Printer, Layout, Sparkles } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useToast } from '@/shared/components/atoms/Toast';
import { useTranslation } from '@/shared/i18n/useTranslation';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { formatDate } from '@/shared/utils/helpers';
import PrintLayout from '@/features/export/components/PrintLayout';
import PrintCharacterSheet from '@/features/export/components/PrintCharacterSheet';
import styles from './ExportPage.module.css';

type Scope = 'full_project' | 'characters' | 'worldbuilding' | 'gameplay' | 'story' | 'maps';
type Format = 'json' | 'markdown' | 'csv' | 'print';
type PrintTheme = 'legendary' | 'minimalist' | 'dark-digital';

const SCOPE_OPTS = [
  { id: 'full_project' as Scope, label: 'Ganzes Projekt', desc: 'Alle Charaktere, Weltbau und Gameplay' },
  { id: 'characters' as Scope, label: 'Nur Charaktere', desc: 'Charaktere & Beziehungen' },
  { id: 'worldbuilding' as Scope, label: 'Nur Weltbau', desc: 'Orte, Fraktionen, Artefakte usw.' },
  { id: 'maps' as Scope, label: 'Nur Karten', desc: 'Interaktive Weltkarten & Pins' },
  { id: 'gameplay' as Scope, label: 'Nur Gameplay', desc: 'Quests, Szenen, Session-Logs usw.' },
];

const FORMAT_OPTS = [
  { id: 'json' as Format, label: 'JSON', icon: <FileJson size={20} />, desc: 'Vollständiger Export mit allen IDs und Referenzen' },
  { id: 'markdown' as Format, icon: <FileText size={20} />, label: 'Markdown', desc: 'Lesbare Dokumente pro Entität' },
  { id: 'csv' as Format, icon: <File size={20} />, label: 'CSV', desc: 'Tabellenformat, mit Excel kompatibel' },
];

function buildExportPayload(scope: Scope, stores: { 
  characters: ReturnType<typeof useCharacterStore.getState>; 
  relationships: ReturnType<typeof useRelationshipStore.getState>; 
  world: ReturnType<typeof useWorldStore.getState>; 
  gameplay: ReturnType<typeof useGameplayStore.getState>; 
  maps: ReturnType<typeof useMapStore.getState>;
  settings: ReturnType<typeof useSettingsStore.getState> 
}) {
  const { characters, relationships, world, gameplay, maps, settings } = stores;
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    campaign: settings.settings.campaignName,
    data: {
      ...(scope === 'full_project' || scope === 'characters' ? { characters: characters.characters, relationships: relationships.relationships } : {}),
      ...(scope === 'full_project' || scope === 'worldbuilding' ? { worldEntities: world.entities } : {}),
      ...(scope === 'full_project' || scope === 'maps' ? { maps: maps.entities } : {}),
      ...(scope === 'full_project' || scope === 'gameplay' ? { gameplayEntities: gameplay.entities } : {}),
    },
  };
}

function toMarkdown(payload: ReturnType<typeof buildExportPayload>): string {
  const lines: string[] = [`# ${payload.campaign}`, `*Export vom ${new Date(payload.exportedAt).toLocaleDateString('de-DE')}*`, ''];
  const { data } = payload;
  if (data.characters) {
    lines.push('## Charaktere', '');
    data.characters.forEach(c => {
      lines.push(`### ${c.name}`, `**Typ:** ${c.type} | **Status:** ${c.status}`, '');
      if (c.short_description) lines.push(c.short_description, '');
      if (c.personality) lines.push(`**Personality:** ${c.personality}`, '');
      if (c.goals) lines.push(`**Ziele:** ${c.goals}`, '');
      if (c.background) lines.push(`**Background:** ${c.background}`, '');
      lines.push('---', '');
    });
  }
  if (data.worldEntities) {
    lines.push('## Weltbau', '');
    data.worldEntities.forEach(e => {
      lines.push(`### ${e.title} _(${e.entityType})_`, '');
      if (e.summary) lines.push(e.summary, '');
      if (e.description) lines.push(e.description, '');
      lines.push('---', '');
    });
  }
  if (data.gameplayEntities) {
    lines.push('## Gameplay', '');
    data.gameplayEntities.forEach(e => {
      lines.push(`### ${e.title} _(${e.entityType})_`, `**Status:** ${e.status}`, '');
      if (e.summary) lines.push(e.summary, '');
      lines.push('---', '');
    });
  }
  if (data.maps) {
    lines.push('## Karten', '');
    data.maps.forEach((m: any) => {
      lines.push(`### ${m.title}`, `**Bild-URL:** ${m.imageUrl}`, '');
      if (m.description) lines.push(m.description, '');
      lines.push(`**Pins ({{count}}):**`.replace('{{count}}', String(m.pins.length)), '');
      m.pins.forEach((p: any) => lines.push(`- ${p.label} (x: ${Math.round(p.x)}%, y: ${Math.round(p.y)}%)`));
      lines.push('', '---', '');
    });
  }
  return lines.join('\n');
}

function toCSV(payload: ReturnType<typeof buildExportPayload>): string {
  const sections: string[] = [];
  if (payload.data.characters) {
    sections.push('--- CHARAKTERE ---');
    sections.push('Name,Typ,Status,Volk,Beruf,Herkunft');
    payload.data.characters.forEach(c =>
      sections.push(`"${c.name}","${c.type}","${c.status}","${c.species}","${c.profession_class}","${c.origin}"`)
    );
    sections.push('');
  }
  if (payload.data.worldEntities) {
    sections.push('--- WELTBAU ---');
    sections.push('Titel,Typ,Status,Zusammenfassung');
    payload.data.worldEntities.forEach(e =>
      sections.push(`"${e.title}","${e.entityType}","${e.status}","${(e.summary ?? '').replace(/"/g, "'")}"`)
    );
    sections.push('');
  }
  if (payload.data.gameplayEntities) {
    sections.push('--- GAMEPLAY ---');
    sections.push('Titel,Typ,Status,Zusammenfassung');
    payload.data.gameplayEntities.forEach(e =>
      sections.push(`"${e.title}","${e.entityType}","${e.status}","${(e.summary ?? '').replace(/"/g, "'")}"`)
    );
    sections.push('');
  }
  if (payload.data.maps) {
    sections.push('--- KARTEN ---');
    sections.push('Titel,Bild-URL,Pins');
    payload.data.maps.forEach((m: any) =>
      sections.push(`"${m.title}","${m.imageUrl}","${m.pins.length}"`)
    );
  }
  return sections.join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const [scope, setScope] = useState<Scope>('full_project');
  const [format, setFormat] = useState<Format>('json');
  const [printTheme, setPrintTheme] = useState<PrintTheme>('legendary');
  const { toast } = useToast();
  const { t } = useTranslation();

  const SCOPE_OPTS = [
    { id: 'full_project' as Scope, label: t('export.scopeAll'), desc: t('dashboard.descChar') + ', ' + t('dashboard.descWorld') },
    { id: 'characters' as Scope, label: t('sidebar.characters'), desc: t('dashboard.descChar') },
    { id: 'worldbuilding' as Scope, label: t('sidebar.worldbuilding'), desc: t('dashboard.descWorld') },
    { id: 'maps' as Scope, label: t('sidebar.maps'), desc: t('maps.emptyDesc') },
    { id: 'gameplay' as Scope, label: t('sidebar.gameplay'), desc: t('dashboard.descGame') },
  ];

  const FORMAT_OPTS = [
    { id: 'json' as Format, label: 'JSON', icon: <FileJson size={20} />, desc: 'Vollständiger Export mit allen IDs und Referenzen' },
    { id: 'markdown' as Format, icon: <FileText size={20} />, label: 'Markdown', desc: 'Lesbare Dokumente pro Entität' },
    { id: 'csv' as Format, icon: <File size={20} />, label: 'CSV', desc: 'Tabellenformat, mit Excel kompatibel' },
    { id: 'print' as Format, icon: <Printer size={20} />, label: 'Druck-Vorschau', desc: 'Schönes Layout zum Drucken oder als PDF' },
  ];

  const PRINT_THEMES = [
    { id: 'legendary' as PrintTheme, label: 'Legendär', icon: <Sparkles size={16} />, desc: 'Klassischer Fantasy-Stil' },
    { id: 'minimalist' as PrintTheme, label: 'Minimalistisch', icon: <Layout size={16} />, desc: 'Modern & Tintensparend' },
  ];

  const characters = useCharacterStore();
  const relationships = useRelationshipStore();
  const world = useWorldStore();
  const gameplay = useGameplayStore();
  const maps = useMapStore();
  const settings = useSettingsStore();

  const payload = buildExportPayload(scope, { characters, relationships, world, gameplay, maps, settings });

  const preview = format === 'json'
    ? JSON.stringify(payload, null, 2).slice(0, 3000)
    : format === 'markdown'
    ? toMarkdown(payload).slice(0, 3000)
    : format === 'csv'
    ? toCSV(payload).slice(0, 3000)
    : `Druck-Vorschau aktiv (${printTheme}). Klicken Sie auf 'Drucken' für das PDF-Layout.`;

  const totalItems =
    (payload.data.characters?.length ?? 0) +
    (payload.data.relationships?.length ?? 0) +
    (payload.data.worldEntities?.length ?? 0) +
    (payload.data.maps?.length ?? 0) +
    (payload.data.gameplayEntities?.length ?? 0);

  const handleExport = () => {
    if (totalItems === 0) {
      toast(`${t('common.notFound')}`, 'error');
      return;
    }
    const campaignSlug = settings.settings.campaignName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (format === 'json') {
      downloadFile(JSON.stringify(payload, null, 2), `${campaignSlug}-${scope}.json`, 'application/json');
    } else if (format === 'markdown') {
      downloadFile(toMarkdown(payload), `${campaignSlug}-${scope}.md`, 'text/markdown');
    } else {
      downloadFile(toCSV(payload), `${campaignSlug}-${scope}.csv`, 'text/csv');
    }
    toast(`Export OK (${format.toUpperCase()}).`, 'success');
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('export.title')}
        subtitle={t('export.desc')}
        actions={
          <>
            {format === 'print' ? (
              <Button variant="primary" icon={<Printer size={16} />} onClick={() => window.print()}
                disabled={totalItems === 0}>
                {t('common.print') || 'Drucken'}
              </Button>
            ) : (
              <Button variant="primary" icon={<Download size={16} />} onClick={handleExport}
                disabled={totalItems === 0}>
                {t('export.download')} ({totalItems})
              </Button>
            )}
          </>
        }
      />

      <div className={styles.body}>
        <div className={styles.controls}>
          {/* Scope */}
          <div className={styles.controlSection}>
            <h3 className={styles.controlTitle}>{t('export.scope')}</h3>
            {SCOPE_OPTS.map(s => (
              <button key={s.id} className={`${styles.option} ${scope === s.id ? styles.optionActive : ''}`}
                onClick={() => setScope(s.id)}>
                <div className={styles.optionCheck}>{scope === s.id ? '●' : '○'}</div>
                <div>
                  <div className={styles.optionLabel}>{s.label}</div>
                  <div className={styles.optionDesc}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Format */}
          <div className={styles.controlSection}>
            <h3 className={styles.controlTitle}>{t('export.format')}</h3>
            {FORMAT_OPTS.map(f => (
              <button key={f.id} className={`${styles.option} ${format === f.id ? styles.optionActive : ''}`}
                onClick={() => setFormat(f.id)}>
                <div className={styles.optionIcon}>{f.icon}</div>
                <div>
                  <div className={styles.optionLabel}>{f.label}</div>
                  <div className={styles.optionDesc}>{f.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Print Themes */}
          {format === 'print' && (
            <div className={styles.controlSection}>
              <h3 className={styles.controlTitle}>Druck-Stil</h3>
              {PRINT_THEMES.map(pt => (
                <button key={pt.id} className={`${styles.option} ${printTheme === pt.id ? styles.optionActive : ''}`}
                  onClick={() => setPrintTheme(pt.id)}>
                  <div className={styles.optionIcon}>{pt.icon}</div>
                  <div>
                    <div className={styles.optionLabel}>{pt.label}</div>
                    <div className={styles.optionDesc}>{pt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* PDF hint */}
          <div className={styles.pdfHint}>
            <strong>{t('export.printHeader')}:</strong> {t('export.printDesc')}
          </div>
        </div>

        {/* Preview */}
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span className={styles.previewTitle}>{t('common.summary')} / Preview</span>
            <span className={styles.previewMeta}>{totalItems} {' '} · {format.toUpperCase()}</span>
          </div>
          <pre className={styles.previewContent}>{preview || `(${t('common.notFound')})`}</pre>
          {preview.length >= 3000 && (
            <div className={styles.previewTruncated}>...</div>
          )}
        </div>
      </div>

      {/* Print Only Content */}
      <div className="print-only">
        <PrintLayout theme={printTheme} title={payload.campaign}>
          {payload.data.characters?.map(c => (
            <PrintCharacterSheet key={c.id} character={c} />
          ))}
          {payload.data.worldEntities?.map(e => (
            <div key={e.id} className="print-section print-card">
              <h2>{e.title}</h2>
              <p><em>{e.entityType}</em></p>
              <div dangerouslySetInnerHTML={{ __html: e.summary || '' }} />
              <div dangerouslySetInnerHTML={{ __html: e.description || '' }} />
            </div>
          ))}
        </PrintLayout>
      </div>
    </div>
  );
}
