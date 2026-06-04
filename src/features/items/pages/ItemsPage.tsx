import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { useItemStore } from '../store/itemStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import SearchBar from '@/shared/components/molecules/SearchBar';
import EmptyState from '@/shared/components/atoms/EmptyState';
import styles from './ItemsPage.module.css';

const RARITY_TABS = ['', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'unique'];

const RARITY_VARIANTS: Record<string, 'default'|'info'|'success'|'warning'|'accent'|'danger'|'muted'> = {
  common: 'default',
  uncommon: 'success',
  rare: 'info',
  epic: 'accent',
  legendary: 'warning',
  unique: 'danger'
};

export default function ItemsPage() {
  const entities = useItemStore(s => s.entities);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('');

  const campaignEntities = entities.filter(e => e.campaignId === activeCampaignId);

  const filtered = campaignEntities.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some(t => t.includes(q));
    const matchCat = !activeTab || e.rarity === activeTab;
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title="Gegenstände"
        subtitle={`${campaignEntities.length} Einträge`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={15} />}
            onClick={() => navigate('/items/new')}>
            Neu erstellen
          </Button>
        }
      />

      <div className={styles.tabs}>
        {RARITY_TABS.map(tab => (
          <button key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === '' ? 'Alle' : tab}
            {tab === '' && <span className={styles.tabCount}>{campaignEntities.length}</span>}
            {tab !== '' && <span className={styles.tabCount}>{campaignEntities.filter(e => e.rarity === tab).length}</span>}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <SearchBar placeholder="Gegenstände durchsuchen..." onSearch={setSearch} />
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Package size={48} opacity={0.2} />} title="Keine Gegenstände gefunden"
            description="Erstelle deinen ersten Gegenstand, um das Inventar zu füllen." />
        ) : (
          <div className={styles.list}>
            {filtered.map(e => (
              <div key={e.id} className={styles.item} onClick={() => navigate(`/items/${e.id}`)}>
                <div className={styles.itemLeft}>
                  <div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <Badge variant={RARITY_VARIANTS[e.rarity] ?? 'default'} size="sm">
                        {e.rarity}
                      </Badge>
                      <div className={styles.itemTitle}>{e.title}</div>
                    </div>
                    {e.description && <div className={styles.itemSummary}>{e.description}</div>}
                  </div>
                </div>
                <div className={styles.itemRight}>
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
