import { useNavigate } from 'react-router-dom';
import { Plus, Map as MapIcon, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import EmptyState from '@/shared/components/atoms/EmptyState';
import styles from './MapsPage.module.css';

export default function MapsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { entities, deleteEntity } = useMapStore();
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);

  const campaignMaps = entities.filter(m => m.campaignId === activeCampaignId);

  const handleDelete = (id: string, name: string) => {
    if (confirm(t('common.confirmDeleteGeneric').replace('{{name}}', name))) {
      deleteEntity(id);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('maps.title')}
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/maps/new')}>
            {t('maps.new')}
          </Button>
        }
      />

      <div className={styles.content}>
        {campaignMaps.length === 0 ? (
          <EmptyState
            icon={<MapIcon size={48} />}
            title={t('maps.emptyTitle')}
            description={t('maps.emptyDesc')}
            action={
              <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/maps/new')}>
                {t('maps.new')}
              </Button>
            }
          />
        ) : (
          <div className={styles.grid}>
            {campaignMaps.map((map) => (
              <div key={map.id} className={styles.card} onClick={() => navigate(`/maps/${map.id}`)}>
                <div className={styles.cardPreview}>
                  <img src={map.imageUrl} alt={map.title} className={map.imageUrl ? '' : styles.missingImage} />
                  {!map.imageUrl && <MapIcon size={32} />}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{map.title}</h3>
                  <div className={styles.cardMeta}>
                    <span>{map.pins.length} Pins</span>
                  </div>
                </div>
                <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    <button className={styles.iconBtn} onClick={() => navigate(`/maps/${map.id}/edit`)}>
                        <Edit2 size={14} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(map.id, map.title)}>
                        <Trash2 size={14} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
