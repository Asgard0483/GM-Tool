import { ArrowLeft, Edit2, Trash2, Copy, Network, Eye, EyeOff, Lock, Printer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useItemStore } from '@/features/items/store/itemStore';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge, { characterTypeBadge, characterStatusBadge } from '@/shared/components/atoms/Badge';
import RichText from '@/shared/components/atoms/RichText';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { formatDate } from '@/shared/utils/helpers';
import EntityTimeline from '@/shared/components/molecules/EntityTimeline';
import PrintCharacterSheet from '@/features/export/components/PrintCharacterSheet';
import PrintLayout from '@/features/export/components/PrintLayout';
import styles from './CharacterDetailPage.module.css';

const VIS_ICONS: Record<string, typeof Eye> = { public: Eye, gm_only: EyeOff, secret: Lock };

function Section({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldValue}><RichText content={value} /></div>
    </div>
  );
}

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const getCharacterById = useCharacterStore(s => s.getCharacterById);
  const deleteCharacter = useCharacterStore(s => s.deleteCharacter);
  const duplicateCharacter = useCharacterStore(s => s.duplicateCharacter);
  const getRelationshipsForCharacter = useRelationshipStore(s => s.getRelationshipsForCharacter);
  const characters = useCharacterStore(s => s.characters);
  const worldEntities = useWorldStore(s => s.entities);
  const items = useItemStore(s => s.entities);

  const character = id ? getCharacterById(id) : undefined;
  const relationships = id ? getRelationshipsForCharacter(id) : [];
  const characterItems = items.filter(i => i.ownerId === id);

  if (!character) {
    return (
      <div className={styles.notFound}>
        <h2>{t('common.notFound')}</h2>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/characters')}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const VisIcon = VIS_ICONS[character.visibility] ?? Eye;
  const faction = worldEntities.find(e => e.id === character.faction_id);
  const location = worldEntities.find(e => e.id === character.location_id);

  const handleDelete = () => {
    if (confirm(t('common.confirmDeleteChar').replace('{{name}}', character.name))) {
      deleteCharacter(character.id);
      toast(`„${character.name}" wurde gelöscht.`, 'info');
      navigate('/characters');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateCharacter(character.id);
    toast(`„${dup.name}" wurde erstellt.`, 'success');
    navigate(`/characters/${dup.id}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={character.name}
        badge={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant={characterTypeBadge(character.type)}>{t(`types.char.${character.type}`)}</Badge>
            <Badge variant={characterStatusBadge(character.status)} dot>{t(`status.char.${character.status}`)}</Badge>
            <span className={styles.visIndicator} title={`${t('common.status')}: ${character.visibility}`}>
              <VisIcon size={14} />
            </span>
          </div>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/characters')}>
              {t('common.back')}
            </Button>
            <Button variant="ghost" size="sm" icon={<Network size={15} />}
              onClick={() => navigate('/characters/network')}>
              {t('characters.network')}
            </Button>
            <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={handleDuplicate}>
              {t('common.duplicate')}
            </Button>
            <Button variant="secondary" size="sm" icon={<Edit2 size={15} />}
              onClick={() => navigate(`/characters/${character.id}/edit`)}>
              {t('common.edit')}
            </Button>
            <Button variant="secondary" size="sm" icon={<Printer size={15} />} onClick={() => window.print()}>
              {t('common.print') || 'Drucken'}
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={15} />} onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </>
        }
      />

      <div className={styles.body}>
        <div className={styles.main}>
          {/* Portrait */}
          {character.portraitUrl && (
            <div className={styles.portraitSection}>
              <img src={character.portraitUrl} alt={character.name} className={styles.portrait} />
            </div>
          )}

          {/* Basisdaten */}
          <Section title={t('characters.baseData')}>
            <div className={styles.fieldGrid}>
              <Field label={t('characters.species')} value={character.species} />
              <Field label={t('characters.class')} value={character.profession_class} />
              <Field label={t('characters.age')} value={character.age} />
              <Field label={t('characters.gender')} value={character.gender} />
              <Field label={t('characters.origin')} value={character.origin} />
              <Field label={t('characters.role')} value={character.role} />
            </div>
            {character.short_description && (
              <div className={styles.summary}><RichText content={character.short_description} /></div>
            )}
          </Section>

          {/* Personality */}
          {(character.personality || character.ideals || character.fears || character.weaknesses) && (
            <Section title={t('characters.personality')}>
              <div className={styles.fieldStack}>
                <Field label={t('characters.personality')} value={character.personality} />
                <Field label={t('characters.ideals')} value={character.ideals} />
                <Field label={t('characters.fears')} value={character.fears} />
                <Field label={t('characters.weaknesses')} value={character.weaknesses} />
              </div>
            </Section>
          )}

          {/* Ziele & Geheimnisse */}
          {(character.goals || character.secrets) && (
            <Section title={t('characters.goals') + " & " + t('characters.secrets')}>
              <div className={styles.fieldStack}>
                <Field label={t('characters.goals')} value={character.goals} />
                {character.visibility !== 'public' && (
                  <div className={styles.secretBlock}>
                    <Lock size={14} />
                    <div className={styles.fieldStack}>
                      <Field label={`${t('characters.secrets')} (GM Only)`} value={character.secrets} />
                    </div>
                  </div>
                )}
                {character.visibility === 'public' && (
                  <Field label={t('characters.secrets')} value={character.secrets} />
                )}
              </div>
            </Section>
          )}

          {/* Background */}
          {(character.background || character.important_events) && (
            <Section title={t('characters.background')}>
              <div className={styles.fieldStack}>
                <Field label={t('characters.background')} value={character.background} />
                <Field label={t('characters.importantEvents')} value={character.important_events} />
              </div>
            </Section>
          )}

          {/* Equipment & Stats */}
          {(character.equipment || character.skills_stats_notes || characterItems.length > 0) && (
            <Section title={t('characters.equipment')}>
              <div className={styles.fieldStack}>
                {characterItems.length > 0 && (
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Inventar / Gegenstände</div>
                    <div className={styles.fieldValue} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {characterItems.map(item => (
                        <div key={item.id} className={styles.link} onClick={() => navigate(`/items/${item.id}`)} style={{ border: '1px solid var(--color-border)', padding: 'var(--space-2)', display: 'inline-flex', width: 'fit-content' }}>
                          <Badge variant="default" size="sm">{item.rarity}</Badge>
                          <span style={{ fontWeight: 500 }}>{item.title}</span>
                          {item.stats && <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>({item.stats})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Field label={t('characters.equipment')} value={character.equipment} />
                <Field label={t('characters.stats')} value={character.skills_stats_notes} />
              </div>
            </Section>
          )}

          {/* Notizen */}
          {character.notes && (
            <Section title={t('common.notes')}>
              <div className={styles.notes}><RichText content={character.notes} /></div>
            </Section>
          )}

          {/* Zeitleiste */}
          <EntityTimeline 
            entityId={character.id} 
            entityType="character" 
            entityName={character.name} 
          />
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Tags */}
          {character.tags.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('common.tags')}</div>
              <div className={styles.tagList}>
                {character.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          )}

          {/* Connections */}
          {(faction || location) && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('characters.connections')}</div>
              {faction && (
                <div className={styles.link} onClick={() => navigate(`/worldbuilding/${faction.id}`)}>
                  <Badge variant="info" size="sm">{t('types.world.faction')}</Badge>
                  <span>{faction.title}</span>
                </div>
              )}
              {location && (
                <div className={styles.link} onClick={() => navigate(`/worldbuilding/${location.id}`)}>
                  <Badge variant="default" size="sm">{t('types.world.place')}</Badge>
                  <span>{location.title}</span>
                </div>
              )}
            </div>
          )}

          {/* Beziehungen */}
          {relationships.length > 0 && (
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>{t('characters.relationshipsCount', { count: relationships.length })}</div>
              <div className={styles.relList}>
                {relationships.map(rel => {
                  const otherId = rel.source_character_id === id
                    ? rel.target_character_id : rel.source_character_id;
                  const other = characters.find(c => c.id === otherId);
                  return (
                    <div key={rel.id} className={styles.relItem}
                      onClick={() => other && navigate(`/characters/${other.id}`)}>
                      <div className={styles.relOther}>{other?.name ?? '?'}</div>
                      <Badge variant="accent" size="sm">{t(`rels.${rel.relationship_type}`)}</Badge>
                      <div className={styles.relIntensity}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`${styles.dot} ${i < rel.intensity ? styles.dotActive : ''}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>{t('common.metadata')}</div>
            <div className={styles.meta}>
              <span>{t('common.createdAt')}</span><span>{formatDate(character.createdAt)}</span>
              <span>{t('common.updatedAt')}</span><span>{formatDate(character.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Only Content */}
      <div className="print-only">
        <PrintLayout theme="legendary" title={character.name}>
          <PrintCharacterSheet character={character} />
        </PrintLayout>
      </div>
    </div>
  );
}
