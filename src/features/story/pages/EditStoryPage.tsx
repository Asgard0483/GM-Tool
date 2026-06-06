import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useCalendarStore } from '@/features/calendar/store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { StoryEntity } from '@/shared/types';
import styles from './StoryForm.module.css';

export default function EditStoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getEntityById = useStoryStore(s => s.getEntityById);
  const updateEntity = useStoryStore(s => s.updateEntity);
  const addCalendarEvent = useCalendarStore(s => s.addEvent);
  const updateCalendarEvent = useCalendarStore(s => s.updateEvent);
  const getEventsForEntity = useCalendarStore(s => s.getEventsForEntity);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const calendarConfig = useCalendarStore(s => s.getConfigForCampaign(activeCampaignId || ''));

  const entity = id ? getEntityById(id) : undefined;
  const [form, setForm] = useState<Partial<StoryEntity> | null>(null);

  useEffect(() => {
    if (entity) setForm({ ...entity });
  }, [entity]);

  if (!entity || !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)' }}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/story')}>{t('common.back')}</Button>
      </div>
    );
  }

  const set = <K extends keyof StoryEntity>(k: K, v: StoryEntity[K]) =>
    setForm(prev => prev ? { ...prev, [k]: v } : prev);

  const handleSave = () => {
    if (!form.title?.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    
    // Auto-Sync Calendar
    if (form.inGameDate) {
      const existingEvents = getEventsForEntity(id!);
      const eventData = {
        title: form.title,
        description: form.summary || `Automatischer Eintrag: Kapitel ${form.chapter_number}`,
        day: form.inGameDate.day,
        month: form.inGameDate.month,
        year: form.inGameDate.year,
        linkedEntityId: id,
        linkedEntityType: 'story' as const,
        color: 'var(--color-primary)',
        status: 'active' as const,
        tags: [],
        notes: '',
        metadata: {}
      };

      if (existingEvents.length > 0) {
        updateCalendarEvent(existingEvents[0].id, eventData);
      } else {
        addCalendarEvent(eventData);
      }
    }

    updateEntity(id!, form);
    
    toast(`${t('common.edit')} "${form.title}" OK.`, 'success');
    navigate(`/story/${id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${t('common.edit')}: ${entity.title}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate(`/story/${id}`)}>{t('common.cancel')}</Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>{t('common.save')}</Button>
          </>
        }
      />

      <div className={styles.formBody}>
        <div className={styles.topRow}>
          <FormField label={t('story.chapterTitle')} required>
            <Input value={form.title ?? ''} onChange={e => set('title', e.target.value)} />
          </FormField>
          <FormField label={t('story.number')}>
            <Input type="number" value={form.chapter_number ?? 1} onChange={e => set('chapter_number', parseInt(e.target.value) || 1)} />
          </FormField>
          <FormField label={t('common.status')}>
            <Select value={form.status ?? 'draft'} onChange={e => set('status', e.target.value as StoryEntity['status'])}>
              <option value="draft">{t('status.story.draft')}</option>
              <option value="final">{t('status.story.final')}</option>
              <option value="archived">{t('status.story.archived')}</option>
            </Select>
          </FormField>
        </div>

        <FormField label={t('common.summary')}>
          <Textarea value={form.summary ?? ''} onChange={e => set('summary', e.target.value)} rows={2} />
        </FormField>

        <div className={styles.topRow}>
          <FormField label="In-Game Datum (optional)">
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Input type="number" placeholder="Tag" value={form.inGameDate?.day ?? ''} 
                onChange={e => set('inGameDate', { ...form.inGameDate, day: parseInt(e.target.value) || 1 } as any)} style={{ width: '4rem' }} />
              <Select value={form.inGameDate?.month ?? 0} 
                onChange={e => set('inGameDate', { ...form.inGameDate, month: parseInt(e.target.value) } as any)}>
                {calendarConfig.months.map((m, i) => (
                  <option key={i} value={i}>{m.name}</option>
                ))}
              </Select>
              <Input type="number" placeholder="Jahr" value={form.inGameDate?.year ?? ''} 
                onChange={e => set('inGameDate', { ...form.inGameDate, year: parseInt(e.target.value) || 1000 } as any)} style={{ width: '5rem' }} />
            </div>
          </FormField>
        </div>

        <div className={styles.editor}>
          <FormField label={t('story.historyTitle')} hint="Nutze [[Name]] um Charaktere, Orte oder Quests direkt zu verlinken.">
            <Textarea
              className={styles.textarea}
              value={form.content ?? ''}
              onChange={e => set('content', e.target.value)}
            />
          </FormField>
        </div>

        <div className={styles.nav}>
          <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
