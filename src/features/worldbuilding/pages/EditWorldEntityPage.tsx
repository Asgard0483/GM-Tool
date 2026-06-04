import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import ImageUploadField from '@/shared/components/molecules/ImageUploadField';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { WorldEntity } from '@/shared/types';
import styles from './NewWorldEntityPage.module.css';

export default function EditWorldEntityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getEntityById = useWorldStore(s => s.getEntityById);
  const updateEntity = useWorldStore(s => s.updateEntity);
  const allEntities = useWorldStore(s => s.entities);

  const entity = id ? getEntityById(id) : undefined;

  type FormData = Omit<WorldEntity, 'id' | 'entityType' | 'createdAt' | 'updatedAt' | 'related_character_ids' | 'related_gameplay_ids' | 'historical_references'>;

  const [form, setForm] = useState<FormData | null>(null);

  useEffect(() => {
    if (entity) {
      setForm({
        title: entity.title,
        category: entity.category,
        summary: entity.summary,
        description: entity.description,
        status: entity.status,
        region_id: entity.region_id,
        faction_id: entity.faction_id,
        tags: entity.tags,
        notes: entity.notes,
        imageUrl: entity.imageUrl || '',
        metadata: entity.metadata,
        campaignId: '',
      });
    }
  }, [entity]);

  if (!entity || !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)' }}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/worldbuilding')}>{t('common.back')}</Button>
      </div>
    );
  }

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => prev ? { ...prev, [key]: value } : prev);

  const handleSave = () => {
    if (!form!.title.trim()) { toast(`${t('common.title')} ${t('common.required_err')}`, 'error'); return; }
    updateEntity(id!, { ...form!, entityType: form!.category as WorldEntity['entityType'] });
    toast(`${t('common.edit')} "${form!.title}" OK.`, 'success');
    navigate(`/worldbuilding/${id}`);
  };

  const regions = allEntities.filter(e => e.entityType === 'region' && e.id !== id);
  const factions = allEntities.filter(e => e.entityType === 'faction' && e.id !== id);

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${t('common.edit')}: ${entity.title}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate(`/worldbuilding/${id}`)}>
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
          <FormField label={t('common.type')}>
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
          <ImageUploadField 
            label="Bild / Karten-URL" 
            value={form.imageUrl} 
            onChange={val => set('imageUrl', val)} 
          />
          <FormField label={t('common.summary')}>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} />
          </FormField>
          <FormField label={t('common.description')}>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={7} />
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
