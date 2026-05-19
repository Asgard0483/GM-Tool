import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import { useStoryStore } from '@/features/story/store/storyStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import { useTranslation } from '@/shared/i18n/useTranslation';
import EmptyState from '@/shared/components/atoms/EmptyState';
import { formatDate } from '@/shared/utils/helpers';
import styles from './StoryPage.module.css';

export default function StoryPage() {
  const { t } = useTranslation();
  const entities = useStoryStore(s => s.entities);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'draft' | 'final' | 'archived'>('all');

  const filtered = entities
    .filter(e => filter === 'all' || e.status === filter)
    .sort((a, b) => a.chapter_number - b.chapter_number);

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('story.title')}
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/story/new')}>
            {t('story.new')}
          </Button>
        }
      />

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`} onClick={() => setFilter('all')}>{t('common.all')}</button>
        <button className={`${styles.tab} ${filter === 'draft' ? styles.tabActive : ''}`} onClick={() => setFilter('draft')}>{t('story.drafts')}</button>
        <button className={`${styles.tab} ${filter === 'final' ? styles.tabActive : ''}`} onClick={() => setFilter('final')}>{t('story.final')}</button>
        <button className={`${styles.tab} ${filter === 'archived' ? styles.tabActive : ''}`} onClick={() => setFilter('archived')}>{t('status.story.archived')}</button>
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={48} opacity={0.2} />}
            title={t('story.emptyTitle')}
            description={t('story.emptyDesc')}
            action={<Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/story/new')}>{t('story.new')}</Button>}
          />
        ) : (
          <div className={styles.list}>
            {filtered.map(e => (
              <div key={e.id} className={styles.item} onClick={() => navigate(`/story/${e.id}`)}>
                <div className={styles.itemNumber}>{e.chapter_number}</div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{e.title}</div>
                  <div className={styles.itemSummary}>{e.summary}</div>
                </div>
                <div className={styles.itemRight}>
                  <Badge variant={e.status === 'final' ? 'success' : e.status === 'archived' ? 'muted' : 'warning'} size="sm">
                    {t(`status.story.${e.status}`)}
                  </Badge>
                  <div className={styles.date}>
                    {formatDate(e.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
