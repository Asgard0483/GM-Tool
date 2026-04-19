import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { Character } from '@/shared/types';
import styles from './NewCharacterPage.module.css';

type FormData = Omit<Character, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>;

export default function EditCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getCharacterById = useCharacterStore(s => s.getCharacterById);
  const updateCharacter = useCharacterStore(s => s.updateCharacter);
  const worldEntities = useWorldStore(s => s.entities);

  const character = id ? getCharacterById(id) : undefined;

  const [form, setForm] = useState<FormData | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (character) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, entityType: _et, createdAt: _ca, updatedAt: _ua, ...rest } = character;
      setForm(rest as FormData);
    }
  }, [character]);

  if (!character || !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)' }}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/characters')}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => prev ? { ...prev, [key]: value } : prev);

  const handleSave = () => {
    if (!form.name.trim()) { toast(`${t('common.name')} ${t('common.required_err')}`, 'error'); return; }
    updateCharacter(id!, form);
    toast(`${t('characters.character')} "${form.name}" OK.`, 'success');
    navigate(`/characters/${id}`);
  };

  const factions = worldEntities.filter(e => e.entityType === 'faction');
  const places = worldEntities.filter(e => e.entityType === 'place' || e.entityType === 'region');
  const steps = [t('characters.baseData'), t('characters.personality'), t('characters.background'), t('characters.connections')];

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${t('common.edit')}: ${character.name}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />}
              onClick={() => navigate(`/characters/${id}`)}>{t('common.cancel')}</Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>
              {t('common.save')}
            </Button>
          </>
        }
      />

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
            <FormField label={t('common.name')} required>
              <Input value={form.name} onChange={e => set('name', e.target.value)} />
            </FormField>
            <FormField label={t('common.type')} required>
              <Select value={form.typ} onChange={e => set('typ', e.target.value as FormData['typ'])}>
                <option value="pc">{t('types.char.pc')}</option>
                <option value="nsc">{t('types.char.nsc')}</option>
                <option value="enemy">{t('types.char.enemy')}</option>
                <option value="contact">{t('types.char.contact')}</option>
                <option value="faction_rep">{t('types.char.faction_rep')}</option>
                <option value="creature">{t('types.char.creature')}</option>
                <option value="other">{t('types.char.other')}</option>
              </Select>
            </FormField>
            <FormField label={t('common.status')} required>
              <Select value={form.status} onChange={e => set('status', e.target.value as FormData['status'])}>
                <option value="active">{t('status.char.active')}</option>
                <option value="inactive">{t('status.char.inactive')}</option>
                <option value="dead">{t('status.char.dead')}</option>
                <option value="unknown">{t('status.char.unknown')}</option>
                <option value="draft">{t('status.char.draft')}</option>
              </Select>
            </FormField>
            <FormField label={t('common.status')}>
              <Select value={form.sichtbarkeit} onChange={e => set('sichtbarkeit', e.target.value as FormData['sichtbarkeit'])}>
                <option value="public">Public</option>
                <option value="gm_only">GM Only</option>
                <option value="secret">Secret</option>
              </Select>
            </FormField>
            <FormField label={t('characters.role')}><Input value={form.rolle} onChange={e => set('rolle', e.target.value)} /></FormField>
            <FormField label={t('characters.species')}><Input value={form.volk_spezies} onChange={e => set('volk_spezies', e.target.value)} /></FormField>
            <FormField label={t('characters.class')}><Input value={form.beruf_klasse} onChange={e => set('beruf_klasse', e.target.value)} /></FormField>
            <FormField label={t('characters.age')}><Input value={form.alter} onChange={e => set('alter', e.target.value)} /></FormField>
            <FormField label={t('characters.gender')}><Input value={form.geschlecht} onChange={e => set('geschlecht', e.target.value)} /></FormField>
            <FormField label={t('characters.origin')}><Input value={form.herkunft} onChange={e => set('herkunft', e.target.value)} /></FormField>
            <FormField label="Portrait URL" hint="URL zu einem Bild">
              <Input value={form.portraitUrl || ''} onChange={e => set('portraitUrl', e.target.value)} placeholder="https://..." />
            </FormField>
            <div className={styles.fullWidth}>
              <FormField label={t('common.summary')}>
                <Textarea value={form.kurzbeschreibung} onChange={e => set('kurzbeschreibung', e.target.value)} rows={3} />
              </FormField>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className={styles.formStack}>
            <FormField label={t('characters.personality')}><Textarea value={form.persoenlichkeit} onChange={e => set('persoenlichkeit', e.target.value)} rows={4} /></FormField>
            <FormField label={t('characters.ideals')}><Textarea value={form.ideale} onChange={e => set('ideale', e.target.value)} rows={3} /></FormField>
            <FormField label={t('characters.fears')}><Textarea value={form.aengste} onChange={e => set('aengste', e.target.value)} rows={3} /></FormField>
            <FormField label={t('characters.weaknesses')}><Textarea value={form.schwaechen} onChange={e => set('schwaechen', e.target.value)} rows={3} /></FormField>
          </div>
        )}
        {step === 2 && (
          <div className={styles.formStack}>
            <FormField label={t('characters.goals')}><Textarea value={form.ziele} onChange={e => set('ziele', e.target.value)} rows={3} /></FormField>
            <FormField label={`${t('characters.secrets')} (GM Only)`}><Textarea value={form.geheimnisse} onChange={e => set('geheimnisse', e.target.value)} rows={3} /></FormField>
            <FormField label={t('characters.background')}><Textarea value={form.hintergrund} onChange={e => set('hintergrund', e.target.value)} rows={4} /></FormField>
            <FormField label={t('characters.importantEvents')}><Textarea value={form.wichtige_ereignisse} onChange={e => set('wichtige_ereignisse', e.target.value)} rows={3} /></FormField>
            <FormField label={t('characters.equipment')}><Textarea value={form.ausruestung} onChange={e => set('ausruestung', e.target.value)} rows={2} /></FormField>
            <FormField label={t('characters.stats')}><Textarea value={form.faehigkeiten_werte_notizen} onChange={e => set('faehigkeiten_werte_notizen', e.target.value)} rows={2} /></FormField>
          </div>
        )}
        {step === 3 && (
          <div className={styles.formStack}>
            <FormField label={t('types.world.faction')}>
              <Select value={form.fraktion_id} onChange={e => set('fraktion_id', e.target.value)}>
                <option value="">-</option>
                {factions.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
              </Select>
            </FormField>
            <FormField label={t('types.world.place')}>
              <Select value={form.ort_id} onChange={e => set('ort_id', e.target.value)}>
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
          {step > 0 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← {t('common.back')}</Button>}
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
