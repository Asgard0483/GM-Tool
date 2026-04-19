import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, LayoutList, LayoutGrid, Users } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge, { characterTypeBadge, characterStatusBadge } from '@/shared/components/atoms/Badge';
import SearchBar from '@/shared/components/molecules/SearchBar';
import EmptyState from '@/shared/components/atoms/EmptyState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { Character } from '@/shared/types';
import styles from './CharactersPage.module.css';

const TYPES = ['pc', 'nsc', 'enemy', 'contact', 'faction_rep', 'creature', 'other'];
const STATUSES = ['active', 'inactive', 'dead', 'unknown', 'draft'];

export default function CharactersPage() {
  const characters = useCharacterStore(s => s.characters);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const campaignCharacters = characters.filter(c => c.campaignId === activeCampaignId);

  const filtered = campaignCharacters.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) ||
      c.kurzbeschreibung.toLowerCase().includes(q) ||
      c.tags.some(t => t.includes(q));
    const matchType = !typeFilter || c.typ === typeFilter;
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('characters.title')}
        subtitle={`${campaignCharacters.length} Einträge · ${filtered.length} angezeigt`}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Sparkles size={15} />}
              onClick={() => navigate('/characters/new?mode=generate')}>
              {t('characters.generate')}
            </Button>
            <Button variant="primary" size="sm" icon={<Plus size={15} />}
              onClick={() => navigate('/characters/new')}>
              {t('characters.new')}
            </Button>
          </>
        }
      />

      {/* Stats / Quick Filters */}
      <div className={styles.stats}>
        <button className={`${styles.statBadge} ${!typeFilter ? styles.statBadgeActive : ''}`} onClick={() => setTypeFilter('')}>
          <span>{t('common.all')}</span>
          <span className={styles.statCount}>{campaignCharacters.length}</span>
        </button>
        {TYPES.map(v => {
          const count = campaignCharacters.filter(c => c.typ === v).length;
          if (count === 0) return null;
          return (
            <button key={v} className={`${styles.statBadge} ${typeFilter === v ? styles.statBadgeActive : ''}`}
              onClick={() => setTypeFilter(typeFilter === v ? '' : v)}>
              <span>{t(`types.char.${v}`)}</span>
              <span className={styles.statCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBar placeholder={t('common.searchPlaceholder')} onSearch={setSearch} />
        <select className={styles.filter} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">{t('characters.allTypes')}</option>
          {TYPES.map(v => <option key={v} value={v}>{t(`types.char.${v}`)}</option>)}
        </select>
        <select className={styles.filter} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">{t('characters.allStatuses')}</option>
          {STATUSES.map(v => <option key={v} value={v}>{t(`status.char.${v}`)}</option>)}
        </select>
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('list')}><LayoutList size={16} /></button>
          <button className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={campaignCharacters.length === 0 ? t('characters.emptyTitle') : t('characters.noHits')}
            description={campaignCharacters.length === 0
              ? t('characters.emptyDesc')
              : t('characters.noHitsDesc')}
            action={campaignCharacters.length === 0 ?
              <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/characters/new')}>
                {t('characters.new')}
              </Button> : undefined}
          />
        ) : view === 'list' ? (
          <CharacterTable characters={filtered} onSelect={id => navigate(`/characters/${id}`)} t={t} />
        ) : (
          <CharacterGrid characters={filtered} onSelect={id => navigate(`/characters/${id}`)} t={t} />
        )}
      </div>
    </div>
  );
}

function CharacterTable({ characters, onSelect, t }: { characters: Character[]; onSelect: (id: string) => void; t: any }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{t('common.name')}</th>
          <th>{t('common.type')}</th>
          <th>{t('characters.role')}</th>
          <th>{t('characters.species')}</th>
          <th>{t('common.status')}</th>
          <th>{t('common.tags')}</th>
        </tr>
      </thead>
      <tbody>
        {characters.map(c => (
          <tr key={c.id} onClick={() => onSelect(c.id)} className={styles.tableRow}>
            <td>
              <div className={styles.tableNameCell}>
                {c.portraitUrl ? (
                  <img src={c.portraitUrl} className={styles.tableAvatar} alt="" />
                ) : (
                  <div className={styles.tableAvatarFallback}>{c.name.charAt(0)}</div>
                )}
                <strong>{c.name}</strong>
              </div>
            </td>
            <td><Badge variant={characterTypeBadge(c.typ)}>{t(`types.char.${c.typ}`)}</Badge></td>
            <td className={styles.muted}>{c.rolle || '—'}</td>
            <td className={styles.muted}>{c.volk_spezies || '—'}</td>
            <td><Badge variant={characterStatusBadge(c.status)} dot>{t(`status.char.${c.status}`)}</Badge></td>
            <td>
              <div className={styles.tagList}>
                {c.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                {c.tags.length > 3 && <span className={styles.tagMore}>+{c.tags.length - 3}</span>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CharacterGrid({ characters, onSelect, t }: { characters: Character[]; onSelect: (id: string) => void; t: any }) {
  return (
    <div className={styles.grid}>
      {characters.map(c => (
        <div key={c.id} className={styles.card} onClick={() => onSelect(c.id)}>
          <div className={styles.cardAvatar}>
            {c.portraitUrl ? (
              <img src={c.portraitUrl} alt={c.name} className={styles.gridAvatarImg} />
            ) : (
              c.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardName}>{c.name}</div>
            <div className={styles.cardMeta}>
              <Badge variant={characterTypeBadge(c.typ)} size="sm">{t(`types.char.${c.typ}`)}</Badge>
              {c.volk_spezies && <span className={styles.muted}>{c.volk_spezies}</span>}
            </div>
            {c.kurzbeschreibung && (
              <p className={styles.cardDesc}>{c.kurzbeschreibung.slice(0, 100)}{c.kurzbeschreibung.length > 100 ? '…' : ''}</p>
            )}
            <div className={styles.tagList}>
              {c.tags.slice(0, 4).map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
