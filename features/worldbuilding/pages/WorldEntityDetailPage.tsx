import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Copy } from 'lucide-react';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import RichText from '@/shared/components/atoms/RichText';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { formatDate } from '@/shared/utils/helpers';
import styles from './WorldEntityDetailPage.module.css';

// Removed CAT_LABELS and STATUS_LABELS in favor of standard translations

export default function WorldEntityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const getEntityById = useWorldStore(s => s.getEntityById);
  const deleteEntity = useWorldStore(s => s.deleteEntity);
  const duplicateEntity = useWorldStore(s => s.duplicateEntity);
  const characters = useCharacterStore(s => s.characters);
  const { t } = useTranslation();

  const entity = id ? getEntityById(id) : undefined;
  const worldEntities = useWorldStore(s => s.entities);

  if (!entity) {
    return (
      <div className={styles.notFound}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/worldbuilding')}>{t('common.back')}</Button>
      </div>
    );
  }

  const relatedChars = characters.filter(c => entity.related_character_ids.includes(c.id));
  const relatedFaction = worldEntities.find(e => e.id === entity.faction_id);
  const relatedRegion = worldEntities.find(e => e.id === entity.region_id);

  const handleDelete = () => {
    if (confirm(t('common.confirmDeleteGeneric').replace('{{name}}', entity.title))) {
      deleteEntity(entity.id);
      toast(t('common.deletedGeneric').replace('{{name}}', entity.title), 'info');
      navigate('/worldbuilding');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateEntity(entity.id);
    toast(`„${dup.title}" wurde erstellt.`, 'success');
    navigate(`/worldbuilding/${dup.id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={entity.title}
        badge={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant="info" size="sm">{t(`types.world.${entity.entityType}`)}</Badge>
            <Badge variant="default" size="sm">{t(`status.world.${entity.status}`)}</Badge>
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/worldbuilding')}>{t('common.back')}</Button>
            <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={handleDuplicate}>{t('common.duplicate')}</Button>
            <Button variant="secondary" size="sm" icon={<Edit2 size={15} />} onClick={() => navigate(`/worldbuilding/${entity.id}/edit`)}>{t('common.edit')}</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={handleDelete}>{t('common.delete')}</Button>
          </>
        }
      />

      <div className={styles.body}>
        <div className={styles.main}>
          {entity.summary && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.summary')}</h3>
              <div className={styles.text}><RichText content={entity.summary} /></div>
            </div>
          )}
          {entity.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.description')}</h3>
              <div className={styles.text}><RichText content={entity.description} /></div>
            </div>
          )}
          {entity.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.notes')} (GM)</h3>
              <div className={styles.text}><RichText content={entity.notes} /></div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {entity.tags.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('common.tags')}</div>
              <div className={styles.tagList}>
                {entity.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          )}

          {(relatedRegion || relatedFaction) && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('worldbuilding.embeddedIn')}</div>
              {relatedRegion && (
                <div className={styles.link} onClick={() => navigate(`/worldbuilding/${relatedRegion.id}`)}>
                  <Badge variant="success" size="sm">{t('types.world.region')}</Badge>
                  <span>{relatedRegion.title}</span>
                </div>
              )}
              {relatedFaction && (
                <div className={styles.link} onClick={() => navigate(`/worldbuilding/${relatedFaction.id}`)}>
                  <Badge variant="danger" size="sm">{t('types.world.faction')}</Badge>
                  <span>{relatedFaction.title}</span>
                </div>
              )}
            </div>
          )}

          {relatedChars.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('worldbuilding.relatedChars')}</div>
              {relatedChars.map(c => (
                <div key={c.id} className={styles.link} onClick={() => navigate(`/characters/${c.id}`)}>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>{t('common.metadata')}</div>
            <div className={styles.meta}>
              <span>{t('common.createdAt')}</span><span>{formatDate(entity.createdAt)}</span>
              <span>{t('common.updatedAt')}</span><span>{formatDate(entity.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
