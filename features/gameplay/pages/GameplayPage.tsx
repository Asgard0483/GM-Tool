import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Swords } from 'lucide-react';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge, { gameplayStatusBadge } from '@/shared/components/atoms/Badge';
import SearchBar from '@/shared/components/molecules/SearchBar';
import EmptyState from '@/shared/components/atoms/EmptyState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './GameplayPage.module.css';

const TYPE_TABS = ['', 'quest', 'scene', 'encounter', 'reward', 'session_log', 'mechanic'];
const TYPE_VARIANTS: Record<string, 'default'|'info'|'accent'|'warning'|'success'|'muted'> = {
  quest: 'info', scene: 'accent', encounter: 'warning',
  reward: 'success', session_log: 'muted', mechanic: 'default',
};
// Removed TYPE_LABELS, STATUS_LABELS and DIFF_LABELS in favor of t()

export default function GameplayPage() {
  const entities = useGameplayStore(s => s.entities);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('');

  const campaignEntities = entities.filter(e => e.campaignId === activeCampaignId);

  const filtered = campaignEntities.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || (e.summary ?? '').toLowerCase().includes(q);
    const matchType = !activeTab || e.entityType === activeTab;
    return matchSearch && matchType;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('gameplay.title')}
        subtitle={`${campaignEntities.length} Einträge`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={15} />}
            onClick={() => navigate('/gameplay/new')}>
            {t('gameplay.new')}
          </Button>
        }
      />

      <div className={styles.tabs}>
        {TYPE_TABS.map(tab => (
          <button key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === '' ? t('common.all') : t(`types.game.${tab}`)}
            <span className={styles.tabCount}>
              {tab === '' ? campaignEntities.length : campaignEntities.filter(e => e.entityType === tab).length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <SearchBar placeholder={t('common.searchPlaceholder')} onSearch={setSearch} />
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState icon={Swords} title={t('gameplay.emptyTitle')}
            description={t('gameplay.emptyDesc')} />
        ) : (
          <div className={styles.cardGrid}>
            {filtered.map(e => (
              <div key={e.id} className={styles.card} onClick={() => navigate(`/gameplay/${e.id}`)}>
                <div className={styles.cardHeader}>
                  <Badge variant={TYPE_VARIANTS[e.entityType] ?? 'default'} size="sm">
                    {t(`types.game.${e.entityType}`)}
                  </Badge>
                  <Badge variant={gameplayStatusBadge(e.status)} size="sm">
                    {t(`status.game.${e.status}`)}
                  </Badge>
                  {e.difficulty && (
                    <Badge variant="default" size="sm">{t(`diff.${e.difficulty}`)}</Badge>
                  )}
                </div>
                <h3 className={styles.cardTitle}>{e.title}</h3>
                {e.summary && <p className={styles.cardSummary}>{e.summary}</p>}
                {e.session_number && (
                  <div className={styles.sessionNum}>{t('types.game.session_log')} #{e.session_number}</div>
                )}
                <div className={styles.cardMeta}>
                  {e.related_character_ids.length > 0 && (
                    <span>{e.related_character_ids.length} {t('sidebar.characters')}</span>
                  )}
                  {e.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
