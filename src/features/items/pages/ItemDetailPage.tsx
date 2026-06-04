import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Copy, User } from 'lucide-react';
import { useItemStore } from '../store/itemStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import RichText from '@/shared/components/atoms/RichText';
import { formatDate } from '@/shared/utils/helpers';
import styles from './ItemDetailPage.module.css';

const RARITY_VARIANTS: Record<string, 'default'|'info'|'success'|'warning'|'accent'|'danger'|'muted'> = {
  common: 'default', uncommon: 'success', rare: 'info', epic: 'accent', legendary: 'warning', unique: 'danger'
};

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const getEntityById = useItemStore(s => s.getEntityById);
  const deleteEntity = useItemStore(s => s.deleteEntity);
  const duplicateEntity = useItemStore(s => s.duplicateEntity);
  const getCharacterById = useCharacterStore(s => s.getCharacterById);

  const entity = id ? getEntityById(id) : undefined;
  const owner = entity?.ownerId ? getCharacterById(entity.ownerId) : null;

  if (!entity) {
    return (
      <div className={styles.notFound}>
        <h2>Gegenstand nicht gefunden</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/items')}>Zurück</Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Gegenstand "${entity.title}" wirklich löschen?`)) {
      deleteEntity(entity.id);
      toast(`"${entity.title}" gelöscht.`, 'info');
      navigate('/items');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateEntity(entity.id);
    toast(`"${dup.title}" wurde erstellt.`, 'success');
    navigate(`/items/${dup.id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={entity.title}
        badge={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant={RARITY_VARIANTS[entity.rarity] ?? 'default'} size="sm">{entity.rarity}</Badge>
            {entity.stats && <Badge variant="muted" size="sm">{entity.stats}</Badge>}
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/items')}>Zurück</Button>
            <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={handleDuplicate}>Duplizieren</Button>
            <Button variant="secondary" size="sm" icon={<Edit2 size={15} />} onClick={() => navigate(`/items/${entity.id}/edit`)}>Bearbeiten</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={handleDelete}>Löschen</Button>
          </>
        }
      />

      <div className={styles.body}>
        <div className={styles.main}>
          {entity.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Beschreibung</h3>
              <div className={styles.text}><RichText content={entity.description} /></div>
            </div>
          )}
          {entity.background && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Hintergrund / Geschichte</h3>
              <div className={styles.text}><RichText content={entity.background} /></div>
            </div>
          )}
          {entity.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notizen (GM)</h3>
              <div className={styles.text}><RichText content={entity.notes} /></div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {owner && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Besitzer</div>
              <div className={styles.link} onClick={() => navigate(`/characters/${owner.id}`)}>
                <User size={16} />
                <span>{owner.name}</span>
              </div>
            </div>
          )}

          {entity.tags.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Tags</div>
              <div className={styles.tagList}>
                {entity.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          )}

          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Metadaten</div>
            <div className={styles.meta}>
              <span>Erstellt</span><span>{formatDate(entity.createdAt)}</span>
              <span>Aktualisiert</span><span>{formatDate(entity.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
