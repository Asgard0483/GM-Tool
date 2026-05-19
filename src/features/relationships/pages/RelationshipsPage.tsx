import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, GitBranch } from 'lucide-react';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import SearchBar from '@/shared/components/molecules/SearchBar';
import EmptyState from '@/shared/components/atoms/EmptyState';
import Modal from '@/shared/components/atoms/Modal';
import { FormField, Select } from '@/shared/components/atoms/FormField';
import { useToast } from '@/shared/components/atoms/Toast';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { Relationship, RelationshipType, RelationshipDirection, RelationshipAttitude, RelationshipStatus, VisibilityType } from '@/shared/types';
import styles from './RelationshipsPage.module.css';

const REL_TYPE_LABELS: Record<string, string> = {
  familie: 'Familie', freundschaft: 'Freundschaft', bekanntschaft: 'Bekanntschaft',
  allianz: 'Allianz', loyalitaet: 'Loyalität', schuld_verpflichtung: 'Schuld/Verpflichtung',
  rivalitaet: 'Rivalität', feindschaft: 'Feindschaft', mentor_schueler: 'Mentor/Schüler',
  liebe_affaere: 'Liebe/Affäre', geheimverbindung: 'Geheimverbindung',
};
const ATT_LABELS: Record<string, string> = { positive: 'Positiv', neutral: 'Neutral', negative: 'Negativ', mixed: 'Ambivalent' };
const ATT_VARIANTS: Record<string, 'success'|'default'|'danger'|'warning'> = {
  positive: 'success', neutral: 'default', negative: 'danger', mixed: 'warning',
};
const DIR_LABELS: Record<string, string> = { directed: 'Gerichtet →', symmetric: 'Gegenseitig ↔' };
const STATUS_LABELS: Record<string, string> = { active: 'Aktiv', broken: 'Gebrochen', ended: 'Beendet', unknown: 'Unbekannt' };

function IntensityBar({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i <= value ? 'var(--color-accent)' : 'var(--color-border)',
        }} />
      ))}
    </div>
  );
}

type NewRelForm = {
  source_character_id: string;
  target_character_id: string;
  relationship_type: RelationshipType;
  direction: RelationshipDirection;
  intensity: 1|2|3|4|5;
  attitude: RelationshipAttitude;
  visibility: VisibilityType;
  status: RelationshipStatus;
  description: string;
  history: string;
};

function emptyRelForm(): NewRelForm {
  return {
    source_character_id: '', target_character_id: '',
    relationship_type: 'acquaintance', direction: 'symmetric',
    intensity: 3, attitude: 'neutral', visibility: 'public', status: 'active',
    description: '', history: '',
  };
}

export default function RelationshipsPage() {
  const { t } = useTranslation();
  const relationships = useRelationshipStore(s => s.relationships);
  const { addRelationship, deleteRelationship } = useRelationshipStore();
  const characters = useCharacterStore(s => s.characters);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewRelForm>(emptyRelForm());
  const { toast } = useToast();
  const navigate = useNavigate();

  const setF = <K extends keyof NewRelForm>(k: K, v: NewRelForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const filtered = relationships.filter(r => {
    const src = characters.find(c => c.id === r.source_character_id);
    const tgt = characters.find(c => c.id === r.target_character_id);
    const q = search.toLowerCase();
    const matchSearch = !q || src?.name.toLowerCase().includes(q) || tgt?.name.toLowerCase().includes(q) || r.relationship_type.includes(q);
    const matchType = !typeFilter || r.relationship_type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCreate = () => {
    if (!form.source_character_id || !form.target_character_id) {
      toast('Bitte Quell- und Zielcharakter auswählen.', 'error');
      return;
    }
    if (form.source_character_id === form.target_character_id) {
      toast('Quell- und Zielcharakter müssen verschieden sein.', 'error');
      return;
    }
    addRelationship({ ...form, tags: [], notes: '', metadata: {}, campaignId: '' });
    toast('Beziehung wurde angelegt.', 'success');
    setShowModal(false);
    setForm(emptyRelForm());
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Beziehungen"
        subtitle={`${relationships.length} Beziehungen`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>
            Neue Beziehung
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchBar placeholder="Beziehungen durchsuchen…" onSearch={setSearch} />
        <select className={styles.filter} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Alle Typen</option>
          {Object.entries(REL_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<GitBranch size={28} />}
            title={t('characters.noRelationships')}
            description="Lege Beziehungen zwischen Charakteren an, um das Netzwerk zu befüllen."
            action={<Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>Neue Beziehung</Button>}
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Von</th><th>Zu</th><th>Typ</th><th>Richtung</th>
                <th>Intensität</th><th>Einstellung</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const src = characters.find(c => c.id === r.source_character_id);
                const tgt = characters.find(c => c.id === r.target_character_id);
                return (
                  <tr key={r.id} className={styles.row}>
                    <td>
                      <span className={styles.charLink} onClick={() => src && navigate(`/characters/${src.id}`)}>
                        {src?.name ?? '?'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.charLink} onClick={() => tgt && navigate(`/characters/${tgt.id}`)}>
                        {tgt?.name ?? '?'}
                      </span>
                    </td>
                    <td><Badge variant="accent" size="sm">{REL_TYPE_LABELS[r.relationship_type]}</Badge></td>
                    <td><span className={styles.muted}>{DIR_LABELS[r.direction]}</span></td>
                    <td><IntensityBar value={r.intensity} /></td>
                    <td><Badge variant={ATT_VARIANTS[r.attitude]} size="sm">{ATT_LABELS[r.attitude]}</Badge></td>
                    <td><span className={styles.muted}>{STATUS_LABELS[r.status]}</span></td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => {
                        if (confirm(t('common.confirmDelete'))) {
                          deleteRelationship(r.id);
                          toast('Beziehung gelöscht.', 'info');
                        }
                      }}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neue Beziehung" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleCreate}>Anlegen</Button>
          </>
        }>
        <div className={styles.formGrid}>
          <FormField label="Von (Quelle)" required>
            <Select value={form.source_character_id} onChange={e => setF('source_character_id', e.target.value)}>
              <option value="">Charakter wählen…</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Zu (Ziel)" required>
            <Select value={form.target_character_id} onChange={e => setF('target_character_id', e.target.value)}>
              <option value="">Charakter wählen…</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Beziehungstyp">
            <Select value={form.relationship_type} onChange={e => setF('relationship_type', e.target.value as RelationshipType)}>
              {Object.entries(REL_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </FormField>
          <FormField label="Richtung">
            <Select value={form.direction} onChange={e => setF('direction', e.target.value as RelationshipDirection)}>
              <option value="symmetric">Gegenseitig ↔</option>
              <option value="directed">Gerichtet →</option>
            </Select>
          </FormField>
          <FormField label="Intensität (1-5)">
            <Select value={form.intensity} onChange={e => setF('intensity', parseInt(e.target.value) as 1|2|3|4|5)}>
              {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} {'●'.repeat(i)}{'○'.repeat(5-i)}</option>)}
            </Select>
          </FormField>
          <FormField label="Einstellung">
            <Select value={form.attitude} onChange={e => setF('attitude', e.target.value as RelationshipAttitude)}>
              {Object.entries(ATT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </FormField>
          <FormField label="Sichtbarkeit">
            <Select value={form.visibility} onChange={e => setF('visibility', e.target.value as VisibilityType)}>
              <option value="public">Öffentlich</option>
              <option value="gm_only">Nur GM</option>
              <option value="secret">Geheim</option>
            </Select>
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={e => setF('status', e.target.value as RelationshipStatus)}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
