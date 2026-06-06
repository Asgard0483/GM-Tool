import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function NewStoryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const addEntity = useStoryStore(s => s.addEntity);
  const entities = useStoryStore(s => s.entities);
  const addCalendarEvent = useCalendarStore(s => s.addEvent);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const calendarConfig = useCalendarStore(s => s.getConfigForCampaign(activeCampaignId || ''));

  const nextChapter = entities.length > 0 ? Math.max(...entities.map(e => e.chapter_number)) + 1 : 1;

  const [form, setForm] = useState<Partial<StoryEntity>>({
    title: '',
    chapter_number: nextChapter,
    summary: '',
    content: '',
    status: 'draft',
    inGameDate: undefined,
  });

  const [inGameDateDay, setInGameDateDay] = useState('');
  const [inGameDateMonth, setInGameDateMonth] = useState('0');
  const [inGameDateYear, setInGameDateYear] = useState('');

  const set = <K extends keyof StoryEntity>(k: K, v: StoryEntity[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.title?.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    
    const entity = addEntity({
      title: form.title,
      chapter_number: form.chapter_number ?? 1,
      summary: form.summary ?? '',
      content: form.content ?? '',
      status: form.status as StoryEntity['status'],
      inGameDate: inGameDateDay && inGameDateYear ? {
        day: parseInt(inGameDateDay),
        month: parseInt(inGameDateMonth),
        year: parseInt(inGameDateYear)
      } : undefined,
      tags: [],
      notes: '',
      metadata: {},
    campaignId: ''
    });

    // Auto-Sync Calendar
    if (inGameDateDay && inGameDateYear) {
      addCalendarEvent({
        title: form.title || '',
        description: form.summary || `Automatischer Eintrag: Kapitel ${form.chapter_number}`,
        day: parseInt(inGameDateDay),
        month: parseInt(inGameDateMonth),
        year: parseInt(inGameDateYear),
        linkedEntityId: entity.id,
        linkedEntityType: 'story',
        color: 'var(--color-primary)',
        status: 'active',
        tags: [],
        notes: '',
        metadata: {}
      });
    }
    
    toast(`${t('story.new')} "${form.title}" OK.`, 'success');
    navigate(`/story`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('story.new')}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/story')}>{t('common.cancel')}</Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>{t('common.save')}</Button>
          </>
        }
      />

      <div className={styles.formBody}>
        <div className={styles.topRow}>
          <FormField label={t('story.chapterTitle')} required>
            <Input value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
          </FormField>
          <FormField label={t('story.number')}>
            <Input type="number" value={form.chapter_number} onChange={e => set('chapter_number', parseInt(e.target.value) || 1)} />
          </FormField>
          <FormField label={t('common.status')}>
            <Select value={form.status} onChange={e => set('status', e.target.value as StoryEntity['status'])}>
              <option value="draft">{t('status.story.draft')}</option>
              <option value="final">{t('status.story.final')}</option>
              <option value="archived">{t('status.story.archived')}</option>
            </Select>
          </FormField>
        </div>

        <FormField label={t('common.summary')}>
          <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} />
        </FormField>

        <div className={styles.topRow}>
          <FormField label="In-Game Datum (optional)">
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Input type="number" placeholder="Tag" value={inGameDateDay} onChange={e => setInGameDateDay(e.target.value)} style={{ width: '4rem' }} />
              <Select value={inGameDateMonth} onChange={e => setInGameDateMonth(e.target.value)}>
                {calendarConfig.months.map((m, i) => (
                  <option key={i} value={i}>{m.name}</option>
                ))}
              </Select>
              <Input type="number" placeholder="Jahr" value={inGameDateYear} onChange={e => setInGameDateYear(e.target.value)} style={{ width: '5rem' }} />
            </div>
          </FormField>
        </div>

        <div className={styles.editor}>
          <FormField label={t('story.historyTitle')} hint="Nutze [[Name]] um Charaktere, Orte oder Quests direkt zu verlinken.">
            <Textarea
              className={styles.textarea}
              value={form.content}
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
