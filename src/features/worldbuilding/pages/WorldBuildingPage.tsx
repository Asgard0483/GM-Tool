import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe } from 'lucide-react';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import SearchBar from '@/shared/components/molecules/SearchBar';
import EmptyState from '@/shared/components/atoms/EmptyState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './WorldBuildingPage.module.css';

const CATEGORY_TABS = ['', 'place', 'region', 'faction', 'culture', 'history', 'religion', 'magic_tech', 'artifact', 'lore'];

// Removed CAT_LABELS in favor of t()
const CAT_VARIANTS: Record<string, 'default'|'info'|'success'|'warning'|'accent'|'danger'|'muted'> = {
  place: 'info', region: 'success', faction: 'danger', culture: 'warning',
  history: 'muted', religion: 'accent', magic_tech: 'accent', artifact: 'warning', lore: 'default',
};

export default function WorldBuildingPage() {
  const entities = useWorldStore(s => s.entities);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('');

  const campaignEntities = entities.filter(e => e.campaignId === activeCampaignId);

  const filtered = campaignEntities.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.tags.some(t => t.includes(q));
    const matchCat = !activeTab || e.entityType === activeTab;
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('worldbuilding.title')}
        subtitle={`${campaignEntities.length} Einträge`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={15} />}
            onClick={() => navigate('/worldbuilding/new')}>
            {t('worldbuilding.new')}
          </Button>
        }
      />

      {/* Category Tabs */}
      <div className={styles.tabs}>
        {CATEGORY_TABS.map(tab => (
          <button key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === '' ? t('common.all') : t(`types.world.${tab}`)}
            {tab === '' && <span className={styles.tabCount}>{campaignEntities.length}</span>}
            {tab !== '' && <span className={styles.tabCount}>{campaignEntities.filter(e => e.entityType === tab).length}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.toolbar}>
        <SearchBar placeholder={t('common.searchPlaceholder')} onSearch={setSearch} />
      </div>

      {/* List */}
      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Globe size={48} opacity={0.2} />} title={t('worldbuilding.emptyTitle')}
            description={t('worldbuilding.emptyDesc')} />
        ) : (
          <div className={styles.list}>
            {filtered.map(e => (
              <div key={e.id} className={styles.item} onClick={() => navigate(`/worldbuilding/${e.id}`)}>
                <div className={styles.itemLeft}>
                  {e.imageUrl && (
                    <img src={e.imageUrl} alt={e.title} className={styles.thumbnail} />
                  )}
                  <div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <Badge variant={CAT_VARIANTS[e.entityType] ?? 'default'} size="sm">
                        {t(`types.world.${e.entityType}`)}
                      </Badge>
                      <div className={styles.itemTitle}>{e.title}</div>
                    </div>
                    {e.summary && <div className={styles.itemSummary}>{e.summary}</div>}
                  </div>
                </div>
                <div className={styles.itemRight}>
                  {e.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  {e.related_character_ids.length > 0 && (
                    <span className={styles.refCount}>{e.related_character_ids.length} Char.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
