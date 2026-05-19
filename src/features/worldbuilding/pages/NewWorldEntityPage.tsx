import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useWorldStore, createEmptyWorldEntity } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { WorldEntity } from '@/shared/types';
import styles from './NewWorldEntityPage.module.css';

type FormData = Omit<WorldEntity, 'id' | 'entityType' | 'createdAt' | 'updatedAt' | 'related_character_ids' | 'related_gameplay_ids' | 'historical_references'>;

export default function NewWorldEntityPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const addEntity = useWorldStore(s => s.addEntity);
  const allEntities = useWorldStore(s => s.entities);

  const baseEmpty = createEmptyWorldEntity();
  const [form, setForm] = useState<FormData>({
    title: baseEmpty.title,
    category: baseEmpty.category,
    summary: baseEmpty.summary,
    description: baseEmpty.description,
    status: baseEmpty.status,
    region_id: baseEmpty.region_id,
    faction_id: baseEmpty.faction_id,
    tags: baseEmpty.tags,
    notes: baseEmpty.notes,
    metadata: baseEmpty.metadata,
    campaignId: '',
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    const entity = addEntity({
      ...form,
      entityType: form.category as WorldEntity['entityType'],
      related_character_ids: [],
      related_gameplay_ids: [],
      historical_references: [],
    });
    toast(`${t('worldbuilding.new')} "${entity.title}" OK.`, 'success');
    navigate(`/worldbuilding/${entity.id}`);
  };

  const regions = allEntities.filter(e => e.entityType === 'region');
  const factions = allEntities.filter(e => e.entityType === 'faction');

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('worldbuilding.new')}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/worldbuilding')}>
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
            <Input value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>
          <FormField label={t('common.type')} required>
            <Select value={form.category} onChange={e => set('category', e.target.value as FormData['category'])}>
              <option value="place">{t('types.world.place')}</option>
              <option value="region">{t('types.world.region')}</option>
              <option value="faction">{t('types.world.faction')}</option>
              <option value="culture">{t('types.world.culture')}</option>
              <option value="history">{t('types.world.history')}</option>
              <option value="religion">{t('types.world.religion')}</option>
              <option value="magic_tech">{t('types.world.magic_tech')}</option>
              <option value="artifact">{t('types.world.artifact')}</option>
              <option value="lore">{t('types.world.lore')}</option>
            </Select>
          </FormField>
          <FormField label={t('common.status')}>
            <Select value={form.status} onChange={e => set('status', e.target.value as FormData['status'])}>
              <option value="active">{t('status.world.active')}</option>
              <option value="ruined">{t('status.world.ruined')}</option>
              <option value="mythical">{t('status.world.mythical')}</option>
              <option value="draft">{t('status.world.draft')}</option>
              <option value="inactive">{t('status.world.inactive')}</option>
            </Select>
          </FormField>
          <FormField label={t('types.world.region')}>
            <Select value={form.region_id} onChange={e => set('region_id', e.target.value)}>
              <option value="">-</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </Select>
          </FormField>
          <FormField label={t('types.world.faction')}>
            <Select value={form.faction_id} onChange={e => set('faction_id', e.target.value)}>
              <option value="">-</option>
              {factions.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </Select>
          </FormField>
          <FormField label={t('common.tags')}>
            <Input
              value={form.tags.join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            />
          </FormField>
        </div>

        <div className={styles.formStack}>
          <FormField label={t('common.summary')}>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} />
          </FormField>
          <FormField label={t('common.description')}>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={6} />
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
