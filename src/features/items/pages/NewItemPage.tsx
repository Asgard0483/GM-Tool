import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useItemStore, createEmptyItem } from '../store/itemStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import type { ItemEntity, ItemRarity } from '@/shared/types';
import styles from './ItemForm.module.css';

type FormData = Omit<ItemEntity, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>;

export default function NewItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addEntity = useItemStore(s => s.addEntity);
  const characters = useCharacterStore(s => s.characters);

  const baseEmpty = createEmptyItem();
  const [form, setForm] = useState<FormData>({
    title: baseEmpty.title,
    rarity: baseEmpty.rarity,
    stats: baseEmpty.stats,
    description: baseEmpty.description,
    background: baseEmpty.background,
    ownerId: baseEmpty.ownerId,
    tags: baseEmpty.tags,
    status: baseEmpty.status,
    notes: baseEmpty.notes,
    metadata: baseEmpty.metadata,
    campaignId: '',
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) { toast('Titel ist erforderlich', 'error'); return; }
    const entity = addEntity({ ...form, entityType: 'item' });
    toast(`Gegenstand "${entity.title}" erstellt.`, 'success');
    navigate(`/items/${entity.id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Neuer Gegenstand"
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/items')}>Abbrechen</Button>
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
