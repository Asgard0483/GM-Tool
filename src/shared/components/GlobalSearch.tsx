import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Users, Globe, Swords, GitBranch, X, ArrowRight } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useMapStore } from '@/features/maps/store/mapStore';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { EntityType } from '@/shared/types';
import styles from './GlobalSearch.module.css';

interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  summary: string;
  tags: string[];
  route: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Users; color: string }> = {
  character:   { label: 'Charakter',  icon: Users,     color: 'var(--color-accent)' },
  relationship:{ label: 'Beziehung', icon: GitBranch,  color: 'var(--color-info)' },
  place:       { label: 'Ort',        icon: Globe,      color: 'var(--color-success)' },
  region:      { label: 'Region',     icon: Globe,      color: 'var(--color-success)' },
  faction:     { label: 'Fraktion',   icon: Globe,      color: 'var(--color-danger)' },
  culture:     { label: 'Kultur',     icon: Globe,      color: 'var(--color-warning)' },
  history:     { label: 'Geschichte', icon: Globe,      color: 'var(--color-muted)' },
  religion:    { label: 'Religion',   icon: Globe,      color: 'var(--color-accent)' },
  magic_tech:  { label: 'Magie/Tech', icon: Globe,      color: 'var(--color-accent)' },
  artifact:    { label: 'Artefakt',   icon: Globe,      color: 'var(--color-warning)' },
  lore:        { label: 'Lore',       icon: Globe,      color: 'var(--color-info)' },
  quest:       { label: 'Quest',      icon: Swords,     color: 'var(--color-info)' },
  scene:       { label: 'Szene',      icon: Swords,     color: 'var(--color-accent)' },
  encounter:   { label: 'Begegnung',  icon: Swords,     color: 'var(--color-warning)' },
  reward:      { label: 'Belohnung',  icon: Swords,     color: 'var(--color-success)' },
  session_log: { label: 'Session',    icon: Swords,     color: 'var(--color-muted)' },
  mechanic:    { label: 'Mechanik',   icon: Swords,     color: 'var(--color-text-secondary)' },
  map:         { label: 'Karte',      icon: Globe,      color: 'var(--color-accent)' },
  story:       { label: 'Story',      icon: BookOpen,   color: 'var(--color-info)' },
};

function getRoute(entityType: EntityType, id: string): string {
  if (entityType === 'character') return `/characters/${id}`;
  if (entityType === 'relationship') return `/characters/relationships`;
  const worldTypes: EntityType[] = ['place', 'region', 'faction', 'culture', 'history', 'religion', 'magic_tech', 'artifact', 'lore'];
  if (worldTypes.includes(entityType)) return `/worldbuilding/${id}`;
  if (entityType === 'map') return `/maps/${id}`;
  if (entityType === 'story') return `/story/${id}`;
  return `/gameplay/${id}`;
}

export default function GlobalSearch() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const characters = useCharacterStore(s => s.characters);
  const relationships = useRelationshipStore(s => s.relationships);
  const worldEntities = useWorldStore(s => s.entities);
  const gameplayEntities = useGameplayStore(s => s.entities);
  const mapEntities = useMapStore(s => s.entities);
  const storyEntities = useStoryStore(s => s.entities);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setActiveIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const search = useCallback((q: string): SearchResult[] => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    const results: SearchResult[] = [];

    // Filter by campaign
    const cChars = characters.filter(c => c.campaignId === activeCampaignId);
    const cWorld = worldEntities.filter(e => e.campaignId === activeCampaignId);
    const cGame = gameplayEntities.filter(e => e.campaignId === activeCampaignId);
    const cMaps = mapEntities.filter(m => m.campaignId === activeCampaignId);
    const cStory = storyEntities.filter(s => s.campaignId === activeCampaignId);
    const cRels = relationships.filter(r => r.campaignId === activeCampaignId);

    cChars.forEach(c => {
      if (c.name.toLowerCase().includes(ql) || c.short_description.toLowerCase().includes(ql) || c.tags.some(t => t.includes(ql))) {
        results.push({ id: c.id, entityType: 'character', title: c.name, summary: c.short_description, tags: c.tags, route: getRoute('character', c.id) });
      }
    });

    cRels.forEach(r => {
      const src = cChars.find(c => c.id === r.source_character_id);
      const tgt = cChars.find(c => c.id === r.target_character_id);
      const label = `${src?.name ?? '?'} → ${tgt?.name ?? '?'}`;
      if (label.toLowerCase().includes(ql) || r.relationship_type.includes(ql)) {
        results.push({ id: r.id, entityType: 'relationship', title: label, summary: r.description.slice(0, 80), tags: [], route: getRoute('relationship', r.id) });
      }
    });

    cWorld.forEach(e => {
      if (e.title.toLowerCase().includes(ql) || (e.summary ?? '').toLowerCase().includes(ql) || e.tags.some(t => t.includes(ql))) {
        results.push({ id: e.id, entityType: e.entityType, title: e.title, summary: e.summary || '', tags: e.tags, route: getRoute(e.entityType, e.id) });
      }
    });

    cMaps.forEach(m => {
      if (m.title.toLowerCase().includes(ql) || (m.description ?? '').toLowerCase().includes(ql)) {
        results.push({ id: m.id, entityType: 'map', title: m.title, summary: m.description || '', tags: m.tags, route: getRoute('map', m.id) });
      }
    });

    cStory.forEach(s => {
      if (s.title.toLowerCase().includes(ql) || (s.summary ?? '').toLowerCase().includes(ql)) {
        results.push({ id: s.id, entityType: 'story', title: s.title, summary: s.summary || '', tags: s.tags, route: getRoute('story', s.id) });
      }
    });

    cGame.forEach(e => {
      if (e.title.toLowerCase().includes(ql) || (e.summary ?? '').toLowerCase().includes(ql)) {
        results.push({ id: e.id, entityType: e.entityType, title: e.title, summary: e.summary ?? '', tags: e.tags, route: getRoute(e.entityType, e.id) });
      }
    });

    return results.slice(0, 12);
  }, [characters, relationships, worldEntities, gameplayEntities, mapEntities, storyEntities, activeCampaignId]);

  const results = search(query);

  const handleSelect = (result: SearchResult) => {
    navigate(result.route);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIndex]) handleSelect(results[activeIndex]);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.palette} onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className={styles.inputRow}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Suche über alle Entitäten…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}><X size={14} /></button>
          )}
          <kbd className={styles.esc}>Esc</kbd>
        </div>

        {/* Results */}
        {query && (
          <div className={styles.results}>
            {results.length === 0 ? (
              <div className={styles.noResults}>{t('sidebar.searchNoResults').replace('{{query}}', query)}</div>
            ) : (
              <>
                <div className={styles.resultCount}>{results.length} Ergebnis{results.length !== 1 ? 'se' : ''}</div>
                {results.map((r, i) => {
                  const config = TYPE_CONFIG[r.entityType];
                  const Icon = config?.icon ?? Search;
                  const active = i === activeIndex;
                  return (
                    <div
                      key={r.id}
                      className={`${styles.result} ${active ? styles.resultActive : ''}`}
                      onClick={() => handleSelect(r)}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <div className={styles.resultIcon} style={{ color: config?.color }}>
                        <Icon size={16} />
                      </div>
                      <div className={styles.resultBody}>
                        <div className={styles.resultTitle}>{r.title}</div>
                        {r.summary && (
                          <div className={styles.resultSummary}>
                            {r.summary.slice(0, 80)}{r.summary.length > 80 ? '…' : ''}
                          </div>
                        )}
                      </div>
                      <div className={styles.resultMeta}>
                        <span className={styles.resultType}>{config?.label ?? r.entityType}</span>
                        {active && <ArrowRight size={14} className={styles.resultArrow} />}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Empty / Hint */}
        {!query && (
          <div className={styles.hint}>
            <div className={styles.hintRow}><kbd>↑↓</kbd> Navigieren</div>
            <div className={styles.hintRow}><kbd>↵</kbd> Öffnen</div>
            <div className={styles.hintRow}><kbd>Esc</kbd> Schließen</div>
          </div>
        )}
      </div>
    </div>
  );
}
