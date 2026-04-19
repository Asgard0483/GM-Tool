import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { GameplayEntity, GameplayEntityType } from '@/shared/types';
import styles from './NewGameplayEntityPage.module.css';

const ENTITY_TYPES: GameplayEntityType[] = ['quest', 'scene', 'encounter', 'reward', 'session_log', 'mechanic'];

export default function NewGameplayEntityPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addEntity = useGameplayStore(s => s.addEntity);
  const characters = useCharacterStore(s => s.characters);
  const worldEntities = useWorldStore(s => s.entities);
  const { t } = useTranslation();

  const [entityType, setEntityType] = useState<GameplayEntityType>('quest');
  const [form, setForm] = useState({
    title: '', summary: '', description: '',
    status: 'open' as GameplayEntity['status'],
    difficulty: 'medium' as GameplayEntity['difficulty'],
    goal: '', giver: '', progress: '', consequences: '',
    scene_goal: '', conflict_type: '', participants: '', possible_twist: '',
    encounter_type: '', enemies_or_participants: '', possible_outcomes: '',
    session_number: '', session_date: '', open_threads: '', new_hooks: '',
    tags: [] as string[], notes: '',
  });

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    const entity = addEntity({
      entityType,
      title: form.title, summary: form.summary, description: form.description,
      status: form.status, difficulty: form.difficulty,
      related_character_ids: [], related_faction_ids: [], related_place_ids: [],
      consequences: form.consequences, related_reward_ids: [], related_scene_ids: [],
      // type-specific
      goal: form.goal, giver: form.giver, progress: form.progress, outcome: '',
      scene_goal: form.scene_goal, conflict_type: form.conflict_type,
      participants: form.participants, possible_twist: form.possible_twist,
      encounter_type: form.encounter_type, enemies_or_participants: form.enemies_or_participants,
      possible_outcomes: form.possible_outcomes,
      session_number: form.session_number ? parseInt(form.session_number) : undefined,
      session_date: form.session_date, open_threads: form.open_threads, new_hooks: form.new_hooks,
      affected_entity_ids: [],
      tags: form.tags, notes: form.notes, metadata: {},
    });
    toast(`${t('gameplay.new')} "${entity.title}" OK.`, 'success');
    navigate(`/gameplay/${entity.id}`);
  };

  const places = worldEntities.filter(e => e.entityType === 'place' || e.entityType === 'region');
  const factions = worldEntities.filter(e => e.entityType === 'faction');
  void characters; void places; void factions;

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('gameplay.new')}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/gameplay')}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>
              {t('common.save')}
            </Button>
          </>
        }
      />

      <div className={styles.formBody}>
        {/* Allgemein */}
        <div className={styles.formGrid}>
          <FormField label={t('common.type')} required>
            <Select value={entityType} onChange={e => setEntityType(e.target.value as GameplayEntityType)}>
              {ENTITY_TYPES.map(tOption => <option key={tOption} value={tOption}>{t(`types.game.${tOption}`)}</option>)}
            </Select>
          </FormField>
          <FormField label={t('common.title')} required>
            <Input value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>
          <FormField label={t('common.status')}>
            <Select value={form.status} onChange={e => set('status', e.target.value as GameplayEntity['status'])}>
              <option value="open">{t('status.game.open')}</option>
              <option value="active">{t('status.game.active')}</option>
              <option value="completed">{t('status.game.completed')}</option>
              <option value="failed">{t('status.game.failed')}</option>
              <option value="draft">{t('status.game.draft')}</option>
            </Select>
          </FormField>
          <FormField label={t('common.difficulty')}>
            <Select value={form.difficulty} onChange={e => set('difficulty', e.target.value as GameplayEntity['difficulty'])}>
              <option value="trivial">{t('diff.trivial')}</option>
              <option value="easy">{t('diff.easy')}</option>
              <option value="medium">{t('diff.medium')}</option>
              <option value="hard">{t('diff.hard')}</option>
              <option value="deadly">{t('diff.deadly')}</option>
            </Select>
          </FormField>
        </div>

        <div className={styles.formStack}>
          <FormField label={t('common.summary')}>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} />
          </FormField>
          <FormField label={t('common.description')}>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5} />
          </FormField>
          <FormField label={t('gameplay.consequences')}>
            <Textarea value={form.consequences} onChange={e => set('consequences', e.target.value)} rows={2} />
          </FormField>
        </div>

        {/* Type-specific */}
        {entityType === 'quest' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.goal')}><Input value={form.goal} onChange={e => set('goal', e.target.value)} /></FormField>
            <FormField label={t('gameplay.giver')}><Input value={form.giver} onChange={e => set('giver', e.target.value)} /></FormField>
            <FormField label={t('gameplay.progress')}><Textarea value={form.progress} onChange={e => set('progress', e.target.value)} rows={2} /></FormField>
          </div>
        )}
        {entityType === 'scene' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.sceneGoal')}><Input value={form.scene_goal} onChange={e => set('scene_goal', e.target.value)} /></FormField>
            <FormField label={t('gameplay.conflictType')}><Input value={form.conflict_type} onChange={e => set('conflict_type', e.target.value)} /></FormField>
            <FormField label={t('gameplay.participants')}><Input value={form.participants} onChange={e => set('participants', e.target.value)} /></FormField>
            <FormField label={t('gameplay.possibleTwist')}><Textarea value={form.possible_twist} onChange={e => set('possible_twist', e.target.value)} rows={2} /></FormField>
          </div>
        )}
        {entityType === 'encounter' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.encounterType')}><Input value={form.encounter_type} onChange={e => set('encounter_type', e.target.value)} /></FormField>
            <FormField label={t('gameplay.enemies')}><Input value={form.enemies_or_participants} onChange={e => set('enemies_or_participants', e.target.value)} /></FormField>
            <FormField label={t('gameplay.outcomes')}><Textarea value={form.possible_outcomes} onChange={e => set('possible_outcomes', e.target.value)} rows={2} /></FormField>
          </div>
        )}
        {entityType === 'session_log' && (
          <div className={styles.formGrid}>
            <FormField label={t('gameplay.sessionNumber')}><Input type="number" value={form.session_number} onChange={e => set('session_number', e.target.value)} /></FormField>
            <FormField label={t('gameplay.date')}><Input type="date" value={form.session_date} onChange={e => set('session_date', e.target.value)} /></FormField>
            <FormField label={t('gameplay.openThreads')}><Textarea value={form.open_threads} onChange={e => set('open_threads', e.target.value)} rows={3} /></FormField>
            <FormField label={t('gameplay.newHooks')}><Textarea value={form.new_hooks} onChange={e => set('new_hooks', e.target.value)} rows={3} /></FormField>
          </div>
        )}

        <div className={styles.formStack}>
          <FormField label={t('common.tags')}>
            <Input
              value={form.tags.join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            />
          </FormField>
          <FormField label={`${t('common.notes')} (GM)`}>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
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
