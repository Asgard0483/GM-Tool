import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useCalendarStore } from '@/features/calendar/store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { GameplayEntity } from '@/shared/types';
import styles from './NewGameplayEntityPage.module.css';

export default function EditGameplayEntityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getEntityById = useGameplayStore(s => s.getEntityById);
  const updateEntity = useGameplayStore(s => s.updateEntity);
  const addCalendarEvent = useCalendarStore(s => s.addEvent);
  const updateCalendarEvent = useCalendarStore(s => s.updateEvent);
  const getEventsForEntity = useCalendarStore(s => s.getEventsForEntity);
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const calendarConfig = useCalendarStore(s => s.getConfigForCampaign(activeCampaignId || ''));

  const entity = id ? getEntityById(id) : undefined;

  const [form, setForm] = useState<Partial<GameplayEntity> | null>(null);

  useEffect(() => {
    if (entity) setForm({ ...entity });
  }, [entity]);

  if (!entity || !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)' }}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/gameplay')}>{t('common.back')}</Button>
      </div>
    );
  }

  const set = <K extends keyof GameplayEntity>(k: K, v: GameplayEntity[K]) =>
    setForm(prev => prev ? { ...prev, [k]: v } : prev);

  const handleSave = () => {
    if (!form.title?.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    
    // Auto-Sync Calendar
    if (form.inGameDate) {
      const existingEvents = getEventsForEntity(id!);
      const eventData = {
        title: form.title,
        description: form.summary || `Automatischer Eintrag: ${t(`types.game.${form.entityType}`)}`,
        day: form.inGameDate.day,
        month: form.inGameDate.month,
        year: form.inGameDate.year,
        linkedEntityId: id,
        linkedEntityType: form.entityType || entity.entityType,
        color: 'var(--color-accent)',
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
    navigate(`/gameplay/${id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${t('common.edit')}: ${entity.title}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate(`/gameplay/${id}`)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>
              {t('common.save')}
            </Button>
          </>
        }
      />

      <div className={styles.formBody}>
        <div className={styles.formGrid}>
          <FormField label={t('common.title')} required>
            <Input value={form.title ?? ''} onChange={e => set('title', e.target.value)} />
          </FormField>
          <FormField label={t('common.status')}>
            <Select value={form.status ?? 'open'} onChange={e => set('status', e.target.value as GameplayEntity['status'])}>
              <option value="open">{t('status.game.open')}</option>
              <option value="active">{t('status.game.active')}</option>
              <option value="completed">{t('status.game.completed')}</option>
              <option value="failed">{t('status.game.failed')}</option>
              <option value="draft">{t('status.game.draft')}</option>
            </Select>
          </FormField>
          <FormField label={t('common.difficulty')}>
            <Select value={form.difficulty ?? 'medium'} onChange={e => set('difficulty', e.target.value as GameplayEntity['difficulty'])}>
              <option value="trivial">{t('diff.trivial')}</option>
              <option value="easy">{t('diff.easy')}</option>
              <option value="medium">{t('diff.medium')}</option>
              <option value="hard">{t('diff.hard')}</option>
              <option value="deadly">{t('diff.deadly')}</option>
            </Select>
          </FormField>
          <FormField label={t('common.tags')}>
            <Input
              value={(form.tags ?? []).join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            />
          </FormField>
        </div>

        <div className={styles.formGrid}>
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

        <div className={styles.formStack}>
          <FormField label={t('common.summary')}>
            <Textarea value={form.summary ?? ''} onChange={e => set('summary', e.target.value)} rows={2} />
          </FormField>
          <FormField label={t('common.description')}>
            <Textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={6} />
          </FormField>
          <FormField label={t('gameplay.consequences')}>
            <Textarea value={form.consequences ?? ''} onChange={e => set('consequences', e.target.value)} rows={2} />
          </FormField>
        </div>

        {/* Quest-specific */}
        {entity.entityType === 'quest' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.goal')}>
              <Input value={form.goal ?? ''} onChange={e => set('goal', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.giver')}>
              <Input value={form.giver ?? ''} onChange={e => set('giver', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.progress')}>
              <Textarea value={form.progress ?? ''} onChange={e => set('progress', e.target.value)} rows={2} />
            </FormField>
            <FormField label={t('gameplay.outcome')}>
              <Textarea value={form.outcome ?? ''} onChange={e => set('outcome', e.target.value)} rows={2} />
            </FormField>
          </div>
        )}

        {/* Scene-specific */}
        {entity.entityType === 'scene' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.sceneGoal')}>
              <Input value={form.scene_goal ?? ''} onChange={e => set('scene_goal', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.conflictType')}>
              <Input value={form.conflict_type ?? ''} onChange={e => set('conflict_type', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.participants')}>
              <Input value={form.participants ?? ''} onChange={e => set('participants', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.possibleTwist')}>
              <Textarea value={form.possible_twist ?? ''} onChange={e => set('possible_twist', e.target.value)} rows={2} />
            </FormField>
          </div>
        )}

        {/* Session-specific */}
        {entity.entityType === 'session_log' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.sessionNumber')}>
              <Input type="number" value={String(form.session_number ?? '')}
                onChange={e => set('session_number', parseInt(e.target.value) || undefined)} />
            </FormField>
            <FormField label={t('gameplay.date')}>
              <Input type="date" value={form.session_date ?? ''} onChange={e => set('session_date', e.target.value)} />
            </FormField>
            <FormField label={t('gameplay.openThreads')}>
              <Textarea value={form.open_threads ?? ''} onChange={e => set('open_threads', e.target.value)} rows={3} />
            </FormField>
            <FormField label={t('gameplay.newHooks')}>
              <Textarea value={form.new_hooks ?? ''} onChange={e => set('new_hooks', e.target.value)} rows={3} />
            </FormField>
          </div>
        )}

        <div className={styles.formStack}>
          <FormField label={`${t('common.notes')} (GM)`}>
            <Textarea value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} rows={3} />
          </FormField>
        </div>

        <div className={styles.nav}>
          <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} style={{ marginLeft: 'auto' }}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
