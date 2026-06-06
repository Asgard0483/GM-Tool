import { useState, useEffect } from 'react';
import { Save, Trash2, Database, Sun, Moon, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { loadSeedData, clearAllData, SEED_STATS } from '@/seed';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { useToast } from '@/shared/components/atoms/Toast';
import { exportAllData, importAllData } from '@/shared/utils/backupService';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input } from '@/shared/components/atoms/FormField';
import styles from './SettingsPage.module.css';

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { settings, setCampaignName, setTheme, setLanguage } = useSettingsStore();
  const { toast } = useToast();

  const [dbUsage, setDbUsage] = useState<string>('0');
  const [legacyUsage, setLegacyUsage] = useState<string>('0');

  const characters = useCharacterStore(s => s.characters);
  const relationships = useRelationshipStore(s => s.relationships);
  const worldEntities = useWorldStore(s => s.entities);
  const gameplayEntities = useGameplayStore(s => s.entities);

  const [campaignName, setCampaignNameLocal] = useState(settings.campaignName);

  const handleSaveName = () => {
    if (!campaignName.trim()) { toast(`${t('settings.campaignName')} ${t('common.required_err')}`, 'error'); return; }
    setCampaignName(campaignName.trim());
    toast(t('settings.saved'), 'success');
  };

  const handleLoadSeed = (type: 'fantasy' | 'cthulhu') => {
    loadSeedData(type);
    toast(`${t('settings.seeded')} (${SEED_STATS.characters} ${t('sidebar.characters')}, ${SEED_STATS.relationships} ${t('dashboard.relationships')}…)`, 'success');
  };

  const handleClearData = () => {
    if (!confirm(t('settings.clearConfirm'))) return;
    clearAllData();
    toast(t('settings.cleared'), 'info');
  };

  const handleExportBackup = async () => {
    try {
        await exportAllData();
        toast(t('settings.exportTitle'), 'success');
    } catch (err) {
        toast('Backup fehlgeschlagen: ' + (err instanceof Error ? err.message : 'Unknown'), 'error');
    }
  };

  const calculateStorage = async () => {
    // IndexedDB / Origin-wide Usage
    if (navigator.storage && navigator.storage.estimate) {
      const { usage } = await navigator.storage.estimate();
      setDbUsage(((usage ?? 0) / (1024 * 1024)).toFixed(2));
    }

    // Legacy LocalStorage Usage
    let total = 0;
    for (const key of ['gmtool_characters', 'gmtool_relationships', 'gmtool_worldbuilding', 'gmtool_gameplay', 'gmtool_settings', 'gmtool_campaigns']) {
      total += (localStorage.getItem(key) ?? '').length;
    }
    setLegacyUsage((total / 1024).toFixed(1));
  };

  const handlePurgeLegacy = () => {
    if (!confirm('Dies löscht alle alten Daten aus dem LocalStorage. Die Daten in der neuen Datenbank (IndexedDB) bleiben erhalten. Fortfahren?')) return;
    
    ['gmtool_characters', 'gmtool_relationships', 'gmtool_worldbuilding', 'gmtool_gameplay', 'gmtool_settings', 'gmtool_campaigns', 'gmtool_maps', 'gmtool_calendar', 'gmtool_dice', 'gmtool_story', 'gmtool_audio'].forEach(key => {
        localStorage.removeItem(key);
    });
    
    calculateStorage();
    toast('Legacy LocalStorage bereinigt.', 'success');
  };

  useEffect(() => {
    calculateStorage();
  }, []);

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(t('settings.importConfirm'))) return;

    try {
      await importAllData(file);
      toast(t('settings.importSuccess'), 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast('Fehler: ' + (err instanceof Error ? err.message : 'Unknown'), 'error');
    }
  };

  const storageUsed = (() => {
    let total = 0;
    for (const key of ['gmtool_characters', 'gmtool_relationships', 'gmtool_worldbuilding', 'gmtool_gameplay', 'gmtool_settings']) {
      total += (localStorage.getItem(key) ?? '').length;
    }
    return (total / 1024).toFixed(1);
  })();

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('settings.title')}
        subtitle={t('dashboard.heroSub')}
      />

      <div className={styles.body}>
        {/* === Kampagne === */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.campaignData')}</h2>
          <div className={styles.card}>
            <FormField label={t('settings.campaignName')} hint={t('settings.campaignNameDesc')}>
              <div className={styles.inputRow}>
                <Input
                  value={campaignName}
                  onChange={e => setCampaignNameLocal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  style={{ flex: 1 }}
                />
                <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSaveName}>
                  {t('common.save')}
                </Button>
              </div>
            </FormField>
          </div>
        </section>

        {/* === Erscheinungsbild === */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.appearance')}</h2>
          <div className={styles.card}>
            <div className={styles.themeRow}>
              <div>
                <div className={styles.fieldLabel}>Genre (Theme)</div>
              </div>
              <div className={styles.themeToggleGroup} style={{ flexWrap: 'wrap' }}>
                {[
                  { id: 'modern', label: 'Gegenwart' },
                  { id: 'fantasy', label: 'Fantasy' },
                  { id: 'scifi', label: 'Sci-Fi' },
                  { id: 'cyberpunk', label: 'Cyberpunk' }
                ].map(genre => {
                  const currentGenre = settings.theme.split('-')[0];
                  return (
                    <button
                      key={genre.id}
                      className={`${styles.themeOption} ${currentGenre === genre.id ? styles.themeOptionActive : ''}`}
                      onClick={() => {
                        if (genre.id === 'scifi' || genre.id === 'cyberpunk') {
                          setTheme(`${genre.id}-dark` as any);
                        } else {
                          const mode = settings.theme.includes('light') ? 'light' : 'dark';
                          setTheme(`${genre.id}-${mode}` as any);
                        }
                      }}
                    >
                      {genre.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Switch (only for Modern/Fantasy) */}
            {(!settings.theme.startsWith('scifi') && !settings.theme.startsWith('cyberpunk')) && (
              <div className={styles.themeRow}>
                <div>
                  <div className={styles.fieldLabel}>Modus</div>
                </div>
                <div className={styles.themeToggleGroup}>
                  <button
                    className={`${styles.themeOption} ${settings.theme.includes('light') ? styles.themeOptionActive : ''}`}
                    onClick={() => {
                      const genre = settings.theme.split('-')[0];
                      setTheme(`${genre}-light` as any);
                    }}
                  >
                    <Sun size={16} /> Hell
                  </button>
                  <button
                    className={`${styles.themeOption} ${settings.theme.includes('dark') ? styles.themeOptionActive : ''}`}
                    onClick={() => {
                      const genre = settings.theme.split('-')[0];
                      setTheme(`${genre}-dark` as any);
                    }}
                  >
                    <Moon size={16} /> Dunkel
                  </button>
                </div>
              </div>
            )}

            {/* Language Switch */}
            <div className={styles.themeRow}>
              <div>
                <div className={styles.fieldLabel}>{t('settings.langTitle')}</div>
              </div>
              <div className={styles.themeToggleGroup}>
                <button
                  className={`${styles.themeOption} ${settings.language === 'de' ? styles.themeOptionActive : ''}`}
                  onClick={() => setLanguage('de')}
                >
                  🇩🇪 Deutsch
                </button>
                <button
                  className={`${styles.themeOption} ${settings.language === 'en' ? styles.themeOptionActive : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* === Datenbank-Übersicht === */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.statsTitle')}</h2>
          <div className={styles.card}>
            <div className={styles.stats}>
              <StatRow label={t('sidebar.characters')} value={characters.length} />
              <StatRow label={t('dashboard.relationships')} value={relationships.length} />
              <StatRow label={t('sidebar.worldbuilding')} value={worldEntities.length} />
              <StatRow label={t('sidebar.gameplay')} value={gameplayEntities.length} />
              <div className={styles.statDivider} />
              <StatRow label={t('settings.total')} value={characters.length + relationships.length + worldEntities.length + gameplayEntities.length} />
            </div>
            <div className={styles.storageInfo}>
              <span className={styles.storageLabel}>Datenbank-Speicher (IndexedDB)</span>
              <span className={styles.storageValue}>{dbUsage} MB</span>
            </div>
            <div className={styles.storageInfo} style={{ border: 'none', paddingTop: 0 }}>
              <span className={styles.storageLabel}>Veralteter Speicher (LocalStorage)</span>
              <span className={styles.storageValue}>{legacyUsage} KB</span>
            </div>
          </div>
        </section>

        {/* === Daten verwalten === */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.dataManaged')}</h2>
          <div className={styles.card}>
            <div className={styles.actionList}>
              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>Veraltete Daten bereinigen</div>
                  <div className={styles.actionDesc}>
                    Löscht die Daten im alten Speicherformat (localStorage). Deine aktuellen Datenbank-Einträge bleiben erhalten.
                  </div>
                </div>
                <Button variant="secondary" onClick={handlePurgeLegacy} disabled={legacyUsage === '0.0'}>
                  Bereinigen
                </Button>
              </div>
              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>Demo: Die Eiserne Krone (Fantasy)</div>
                  <div className={styles.actionDesc}>
                    {t('settings.seedDesc')}
                  </div>
                </div>
                <Button variant="secondary" icon={<Database size={15} />} onClick={() => handleLoadSeed('fantasy')}>
                  {t('common.load')}
                </Button>
              </div>

              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>Demo: Schatten über Arkham (Cthulhu)</div>
                  <div className={styles.actionDesc}>
                    Lädt eine Beispielkampagne im 1920er Lovecraft-Setting.
                  </div>
                </div>
                <Button variant="secondary" icon={<Database size={15} />} onClick={() => handleLoadSeed('cthulhu')}>
                  {t('common.load')}
                </Button>
              </div>

              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>{t('settings.exportTitle')}</div>
                  <div className={styles.actionDesc}>
                    {t('settings.exportDesc')}
                  </div>
                </div>
                <Button variant="secondary" icon={<Save size={15} />} onClick={handleExportBackup}>
                  Export (.json)
                </Button>
              </div>

              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>{t('settings.importTitle')}</div>
                  <div className={styles.actionDesc}>
                    {t('settings.importDesc')}
                  </div>
                </div>
                <div className={styles.fileInputWrapper}>
                    <Button variant="secondary" icon={<RefreshCw size={15} />} onClick={() => document.getElementById('import-file')?.click()}>
                        Import (.json)
                    </Button>
                    <input id="import-file" type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </div>
              </div>

              <div className={styles.actionItem}>
                <div>
                  <div className={styles.actionTitle}>{t('settings.restart')}</div>
                  <div className={styles.actionDesc}>{t('settings.restartDesc')}</div>
                </div>
                <Button variant="secondary" icon={<RefreshCw size={15} />} onClick={() => window.location.reload()}>
                  {t('settings.restartBtn')}
                </Button>
              </div>

              <div className={`${styles.actionItem} ${styles.actionItemDanger}`}>
                <div>
                  <div className={styles.actionTitle}>{t('settings.clearCache')}</div>
                  <div className={styles.actionDesc}>
                    {t('settings.clearCacheDesc')}
                  </div>
                </div>
                <Button variant="danger" icon={<Trash2 size={15} />} onClick={handleClearData}>
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* === Info === */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.about')}</h2>
          <div className={styles.card}>
            <div className={styles.about}>
              <div className={styles.aboutRow}><span>Version</span><span>0.14.0 Alpha</span></div>
              <div className={styles.aboutRow}><span>Tech-Stack</span><span>React 19 · Vite · TypeScript · Zustand · React Flow</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
