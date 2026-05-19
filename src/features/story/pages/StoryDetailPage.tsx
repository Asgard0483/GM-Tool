import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Copy, Bookmark } from 'lucide-react';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import RichText from '@/shared/components/atoms/RichText';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { formatDate } from '@/shared/utils/helpers';
import styles from './StoryDetailPage.module.css';

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getEntityById = useStoryStore(s => s.getEntityById);
  const deleteEntity = useStoryStore(s => s.deleteEntity);
  const duplicateEntity = useStoryStore(s => s.duplicateEntity);

  const entity = id ? getEntityById(id) : undefined;

  if (!entity) {
    return (
      <div className={styles.notFound}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/story')}>{t('common.back')}</Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`${t('common.delete')} "${entity.title}"?`)) {
      deleteEntity(entity.id);
      toast(`${t('common.delete')} "${entity.title}" OK.`, 'info');
      navigate('/story');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateEntity(entity.id);
    toast(`${t('common.duplicate')} "${dup.title}" OK.`, 'success');
    navigate(`/story/${dup.id}/edit`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={entity.title}
        badge={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant="accent">{t('story.chapter')} {entity.chapter_number}</Badge>
            <Badge variant={entity.status === 'final' ? 'success' : 'default'} dot>
              {t(`status.story.${entity.status}`)}
            </Badge>
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/story')}>{t('common.back')}</Button>
            <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={handleDuplicate}>{t('common.duplicate')}</Button>
            <Button variant="secondary" size="sm" icon={<Edit2 size={15} />} onClick={() => navigate(`/story/${entity.id}/edit`)}>{t('common.edit')}</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={handleDelete}>{t('common.delete')}</Button>
          </>
        }
      />

      <div className={styles.body}>
        <div className={styles.book}>
          {entity.summary && (
            <div className={styles.summary}>
              <strong>{t('common.summary')}: </strong>
              <RichText content={entity.summary} />
            </div>
          )}
          
          <div className={styles.content}>
            <RichText content={entity.content} />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}><Bookmark size={14} /> {t('story.historyTitle')}</div>
            <div className={styles.meta}>
              <span>{t('common.status')}</span><span>{t(`status.story.${entity.status}`)}</span>
              <span>{t('common.createdAt')}</span><span>{formatDate(entity.createdAt)}</span>
              <span>{t('common.updatedAt')}</span><span>{formatDate(entity.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
