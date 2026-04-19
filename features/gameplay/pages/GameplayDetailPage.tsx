import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Copy } from 'lucide-react';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge, { gameplayStatusBadge } from '@/shared/components/atoms/Badge';
import RichText from '@/shared/components/atoms/RichText';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { formatDate } from '@/shared/utils/helpers';
import styles from './GameplayDetailPage.module.css';

const TYPE_VARIANTS: Record<string, 'default'|'info'|'accent'|'warning'|'success'|'muted'> = {
  quest: 'info', scene: 'accent', encounter: 'warning',
  reward: 'success', session_log: 'muted', mechanic: 'default',
};

function Field({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldValue}><RichText content={String(value)} /></div>
    </div>
  );
}

export default function GameplayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const getEntityById = useGameplayStore(s => s.getEntityById);
  const deleteEntity = useGameplayStore(s => s.deleteEntity);
  const duplicateEntity = useGameplayStore(s => s.duplicateEntity);
  const characters = useCharacterStore(s => s.characters);
  const worldEntities = useWorldStore(s => s.entities);
  const { t } = useTranslation();

  const entity = id ? getEntityById(id) : undefined;

  if (!entity) {
    return (
      <div className={styles.notFound}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/gameplay')}>{t('common.back')}</Button>
      </div>
    );
  }

  const relatedChars = characters.filter(c => entity.related_character_ids.includes(c.id));
  const relatedPlaces = worldEntities.filter(e => entity.related_place_ids.includes(e.id));
  const relatedFactions = worldEntities.filter(e => entity.related_faction_ids.includes(e.id));

  const handleDelete = () => {
    if (confirm(t('common.confirmDeleteGeneric').replace('{{name}}', entity.title))) {
      deleteEntity(entity.id);
      toast(t('common.deletedGeneric').replace('{{name}}', entity.title), 'info');
      navigate('/gameplay');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateEntity(entity.id);
    toast(`„${dup.title}" wurde erstellt.`, 'success');
    navigate(`/gameplay/${dup.id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={entity.title}
        badge={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant={TYPE_VARIANTS[entity.entityType] ?? 'default'}>{t(`types.game.${entity.entityType}`)}</Badge>
            <Badge variant={gameplayStatusBadge(entity.status)} dot>{t(`status.game.${entity.status}`)}</Badge>
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/gameplay')}>{t('common.back')}</Button>
            <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={handleDuplicate}>{t('common.duplicate')}</Button>
            <Button variant="secondary" size="sm" icon={<Edit2 size={15} />} onClick={() => navigate(`/gameplay/${entity.id}/edit`)}>{t('common.edit')}</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={handleDelete}>{t('common.delete')}</Button>
          </>
        }
      />


      <div className={styles.body}>
        <div className={styles.main}>
          {entity.summary && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.summary')}</h3>
              <div className={styles.text}><RichText content={entity.summary} /></div>
            </div>
          )}
          {entity.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.description')}</h3>
              <div className={styles.text}><RichText content={entity.description} /></div>
            </div>
          )}

          {/* Quest fields */}
          {entity.entityType === 'quest' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('gameplay.questDetails')}</h3>
              <div className={styles.fieldGrid}>
                <Field label={t('gameplay.goal')} value={entity.goal} />
                <Field label={t('gameplay.giver')} value={entity.giver} />
                <Field label={t('gameplay.progress')} value={entity.progress} />
                <Field label={t('gameplay.outcome')} value={entity.outcome} />
                <Field label={t('gameplay.consequences')} value={entity.consequences} />
              </div>
            </div>
          )}

          {/* Scene fields */}
          {entity.entityType === 'scene' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('gameplay.sceneDetails')}</h3>
              <div className={styles.fieldGrid}>
                <Field label={t('gameplay.sceneGoal')} value={entity.scene_goal} />
                <Field label={t('gameplay.conflictType')} value={entity.conflict_type} />
                <Field label={t('gameplay.participants')} value={entity.participants} />
                <Field label={t('gameplay.possibleTwist')} value={entity.possible_twist} />
              </div>
            </div>
          )}

          {/* Encounter fields */}
          {entity.entityType === 'encounter' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('gameplay.encounterDetails')}</h3>
              <div className={styles.fieldGrid}>
                <Field label={t('gameplay.encounterType')} value={entity.encounter_type} />
                <Field label={t('gameplay.enemies')} value={entity.enemies_or_participants} />
                <Field label={t('gameplay.outcomes')} value={entity.possible_outcomes} />
              </div>
            </div>
          )}

          {/* Session Log fields */}
          {entity.entityType === 'session_log' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('gameplay.sessionDetails')}</h3>
              <div className={styles.fieldGrid}>
                <Field label={t('gameplay.sessionNumber')} value={entity.session_number} />
                <Field label={t('gameplay.date')} value={entity.session_date} />
                <Field label={t('gameplay.openThreads')} value={entity.open_threads} />
                <Field label={t('gameplay.newHooks')} value={entity.new_hooks} />
              </div>
            </div>
          )}

          {entity.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('common.notes')} (GM)</h3>
              <div className={styles.text}><RichText content={entity.notes} /></div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {entity.tags.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('common.tags')}</div>
              <div className={styles.tagList}>
                {entity.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          )}

          {relatedChars.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('sidebar.characters')} ({relatedChars.length})</div>
              {relatedChars.map(c => (
                <div key={c.id} className={styles.link} onClick={() => navigate(`/characters/${c.id}`)}>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          )}

          {relatedPlaces.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('sidebar.worldbuilding')} ({relatedPlaces.length})</div>
              {relatedPlaces.map(p => (
                <div key={p.id} className={styles.link} onClick={() => navigate(`/worldbuilding/${p.id}`)}>
                  <span>{p.title}</span>
                </div>
              ))}
            </div>
          )}

          {relatedFactions.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('types.world.faction')} ({relatedFactions.length})</div>
              {relatedFactions.map(f => (
                <div key={f.id} className={styles.link} onClick={() => navigate(`/worldbuilding/${f.id}`)}>
                  <span>{f.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>{t('common.metadata')}</div>
            <div className={styles.meta}>
              <span>{t('common.createdAt')}</span><span>{formatDate(entity.createdAt)}</span>
              <span>{t('common.updatedAt')}</span><span>{formatDate(entity.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
