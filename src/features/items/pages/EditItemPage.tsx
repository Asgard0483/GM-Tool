import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useItemStore } from '../store/itemStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import type { ItemEntity, ItemRarity } from '@/shared/types';
import styles from './ItemForm.module.css';

type FormData = Omit<ItemEntity, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>;

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const getEntityById = useItemStore(s => s.getEntityById);
  const updateEntity = useItemStore(s => s.updateEntity);
  const characters = useCharacterStore(s => s.characters);

  const entity = id ? getEntityById(id) : undefined;
  const [form, setForm] = useState<FormData | null>(null);

  useEffect(() => {
    if (entity) {
      setForm({
        title: entity.title,
        rarity: entity.rarity,
        stats: entity.stats,
        description: entity.description,
        background: entity.background,
        ownerId: entity.ownerId,
        tags: entity.tags,
        status: entity.status,
        notes: entity.notes,
        metadata: entity.metadata,
        campaignId: '',
      });
    }
  }, [entity]);

  if (!entity || !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)' }}>
        <h2>Nicht gefunden</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/items')}>Zurück</Button>
      </div>
    );
  }

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => prev ? { ...prev, [key]: value } : prev);

  const handleSave = () => {
    if (!form.title.trim()) { toast('Titel ist erforderlich', 'error'); return; }
    updateEntity(id!, { ...form, entityType: 'item' });
    toast(`Gegenstand "${form.title}" gespeichert.`, 'success');
    navigate(`/items/${id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Bearbeiten: ${entity.title}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate(`/items/${id}`)}>Abbrechen</Button>
            <Button variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave}>Speichern</Button>
          </>
        }
      />

      <div className={styles.formBody}>
        <div className={styles.formGrid}>
          <FormField label="Titel / Name" required>
            <Input value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>
          <FormField label="Seltenheit / Wichtigkeit">
            <Select value={form.rarity} onChange={e => set('rarity', e.target.value as ItemRarity)}>
              <option value="common">Gewöhnlich</option>
              <option value="uncommon">Ungewöhnlich</option>
              <option value="rare">Selten</option>
              <option value="epic">Episch</option>
              <option value="legendary">Legendär</option>
              <option value="unique">Einzigartig</option>
            </Select>
          </FormField>
          <FormField label="Besitzer (Charakter)">
            <Select value={form.ownerId || ''} onChange={e => set('ownerId', e.target.value)}>
              <option value="">- Niemand -</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Werte / Stats" hint="z.B. +2 Schaden, AC +1">
            <Input value={form.stats} onChange={e => set('stats', e.target.value)} />
          </FormField>
          <FormField label="Tags">
            <Input
              value={form.tags.join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            />
          </FormField>
        </div>

        <div className={styles.formStack}>
          <FormField label="Beschreibung / Funktion">
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} />
          </FormField>
          <FormField label="Hintergrund / Geschichte">
            <Textarea value={form.background} onChange={e => set('background', e.target.value)} rows={4} />
          </FormField>
          <FormField label="Geheime Notizen (GM)">
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
          </FormField>
        </div>

        <div className={styles.nav}>
          <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>Speichern</Button>
        </div>
      </div>
    </div>
  );
}
