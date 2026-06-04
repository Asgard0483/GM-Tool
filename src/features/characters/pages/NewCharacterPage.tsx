import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useCharacterStore, createEmptyCharacter } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import ImageUploadField from '@/shared/components/molecules/ImageUploadField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { Character } from '@/shared/types';
import styles from './NewCharacterPage.module.css';

type FormData = Omit<Character, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>;

export default function NewCharacterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const addCharacter = useCharacterStore(s => s.addCharacter);
  const worldEntities = useWorldStore(s => s.entities);

  const [form, setForm] = useState<FormData>(createEmptyCharacter());
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [step, setStep] = useState(0);

  const isGenMode = searchParams.get('mode') === 'generate';

  const factions = worldEntities.filter(e => e.entityType === 'faction');
  const places = worldEntities.filter(e => e.entityType === 'place' || e.entityType === 'region');

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = `${t('common.name')} ${t('common.required_err')}`;
    if (!form.type) errs.type = `${t('common.type')} ${t('common.required_err')}`;
    if (!form.status) errs.status = `${t('common.status')} ${t('common.required_err')}`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const char = addCharacter(form);
    toast(`${t('characters.character')} "${char.name}" OK.`, 'success');
    navigate(`/characters/${char.id}`);
  };

  const steps = [t('characters.baseData'), t('characters.personality'), t('characters.background'), t('characters.connections')];

  return (
    <div className={styles.page}>
      <PageHeader
        title={isGenMode ? t('characters.generate') : t('characters.new')}
        subtitle=""
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />}
              onClick={() => navigate('/characters')}>{t('common.cancel')}</Button>
            {isGenMode && (
              <Button variant="secondary" size="sm" icon={<Sparkles size={15} />}
                onClick={() => toast('Auto-Generator startet…', 'info')}>
                {t('characters.generate')}
              </Button>
            )}
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>
              {t('common.save')}
            </Button>
          </>
        }
      />

      {/* Step Indicator */}
      <div className={styles.steps}>
        {steps.map((s, i) => (
          <button key={s} className={`${styles.step} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
            onClick={() => setStep(i)}>
            <span className={styles.stepNum}>{i < step ? '✓' : i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      <div className={styles.formBody}>
        {step === 0 && (
          <div className={styles.formGrid}>
            <FormField label={t('common.name')} error={errors.name} required>
              <Input value={form.name} onChange={e => set('name', e.target.value)} />
            </FormField>
            <FormField label={t('common.type')} error={errors.type} required>
              <Select value={form.type} onChange={e => set('type', e.target.value as FormData['type'])}>
                <option value="pc">{t('types.char.pc')}</option>
                <option value="nsc">{t('types.char.nsc')}</option>
                <option value="enemy">{t('types.char.enemy')}</option>
                <option value="contact">{t('types.char.contact')}</option>
                <option value="faction_rep">{t('types.char.faction_rep')}</option>
                <option value="creature">{t('types.char.creature')}</option>
                <option value="other">{t('types.char.other')}</option>
              </Select>
            </FormField>
            <FormField label={t('common.status')} error={errors.status} required>
              <Select value={form.status} onChange={e => set('status', e.target.value as FormData['status'])}>
                <option value="active">{t('status.char.active')}</option>
                <option value="inactive">{t('status.char.inactive')}</option>
                <option value="dead">{t('status.char.dead')}</option>
                <option value="unknown">{t('status.char.unknown')}</option>
                <option value="draft">{t('status.char.draft')}</option>
              </Select>
            </FormField>
            <FormField label={t('common.status')}>
              <Select value={form.visibility} onChange={e => set('visibility', e.target.value as FormData['visibility'])}>
                <option value="public">Public</option>
                <option value="gm_only">GM Only</option>
                <option value="secret">Secret</option>
              </Select>
            </FormField>
            <FormField label={t('characters.role')}>
              <Input value={form.role} onChange={e => set('role', e.target.value)} />
            </FormField>
            <FormField label={t('characters.species')}>
              <Input value={form.species} onChange={e => set('species', e.target.value)} />
            </FormField>
            <FormField label={t('characters.class')}>
              <Input value={form.profession_class} onChange={e => set('profession_class', e.target.value)} />
            </FormField>
            <FormField label={t('characters.age')}>
              <Input value={form.age} onChange={e => set('age', e.target.value)} />
            </FormField>
            <FormField label={t('characters.gender')}>
              <Input value={form.gender} onChange={e => set('gender', e.target.value)} />
            </FormField>
            <FormField label={t('characters.origin')}>
              <Input value={form.origin} onChange={e => set('origin', e.target.value)} />
            </FormField>
            <div className={styles.fullWidth}>
              <ImageUploadField 
                label="Portrait Bild" 
                value={form.portraitUrl} 
                onChange={val => set('portraitUrl', val)} 
              />
            </div>
            <div className={styles.fullWidth}>
              <FormField label={t('common.summary')}>
                <Textarea value={form.short_description} onChange={e => set('short_description', e.target.value)} rows={3} />
              </FormField>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.formStack}>
            <FormField label={t('characters.personality')}>
              <Textarea value={form.personality} onChange={e => set('personality', e.target.value)} rows={4} />
            </FormField>
            <FormField label={t('characters.ideals')}>
              <Textarea value={form.ideals} onChange={e => set('ideals', e.target.value)} rows={3} />
            </FormField>
            <FormField label={t('characters.fears')}>
              <Textarea value={form.fears} onChange={e => set('fears', e.target.value)} rows={3} />
            </FormField>
            <FormField label={t('characters.weaknesses')}>
              <Textarea value={form.weaknesses} onChange={e => set('weaknesses', e.target.value)} rows={3} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formStack}>
            <FormField label={t('characters.goals')}>
              <Textarea value={form.goals} onChange={e => set('goals', e.target.value)} rows={3} />
            </FormField>
            <FormField label={`${t('characters.secrets')} (GM Only)`}>
              <Textarea value={form.secrets} onChange={e => set('secrets', e.target.value)} rows={3} />
            </FormField>
            <FormField label={t('characters.background')}>
              <Textarea value={form.background} onChange={e => set('background', e.target.value)} rows={4} />
            </FormField>
            <FormField label={t('characters.importantEvents')}>
              <Textarea value={form.important_events} onChange={e => set('important_events', e.target.value)} rows={3} />
            </FormField>
            <FormField label={t('characters.equipment')}>
              <Textarea value={form.equipment} onChange={e => set('equipment', e.target.value)} rows={2} />
            </FormField>
            <FormField label={t('characters.stats')}>
              <Textarea value={form.skills_stats_notes} onChange={e => set('skills_stats_notes', e.target.value)} rows={2} />
            </FormField>
          </div>
        )}

        {step === 3 && (
          <div className={styles.formStack}>
            <FormField label={t('types.world.faction')}>
              <Select value={form.faction_id} onChange={e => set('faction_id', e.target.value)}>
                <option value="">-</option>
                {factions.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
              </Select>
            </FormField>
            <FormField label={t('types.world.place')}>
              <Select value={form.location_id} onChange={e => set('location_id', e.target.value)}>
                <option value="">-</option>
                {places.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </Select>
            </FormField>
            <FormField label={t('common.tags')} hint="tag1, tag2">
              <Input
                value={form.tags.join(', ')}
                onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              />
            </FormField>
            <FormField label={`${t('common.notes')} (GM)`}>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
            </FormField>
          </div>
        )}

        <div className={styles.nav}>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← {t('common.back')}</Button>
          )}
          {step < steps.length - 1 && (
            <Button variant="primary" onClick={() => setStep(s => s + 1)} style={{ marginLeft: 'auto' }}>Next →</Button>
          )}
          {step === steps.length - 1 && (
            <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} style={{ marginLeft: 'auto' }}>
              {t('common.save')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
