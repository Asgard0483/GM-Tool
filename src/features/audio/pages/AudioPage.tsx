import { useState, useMemo } from 'react';
import { Plus, Music, Volume2, Radio, Play, ExternalLink, Trash2 } from 'lucide-react';
import { useCampaignStore } from '@/store/campaignStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAudioStore } from '../store/audioStore';
import { fantasyAudio, cthulhuAudio, sciFiAudio, cyberpunkAudio, modernAudio } from '@/seed/audio.seed';
import { useToast } from '@/shared/components/atoms/Toast';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import EmptyState from '@/shared/components/atoms/EmptyState';
import { FormField, Input } from '@/shared/components/atoms/FormField';
import styles from './AudioPage.module.css';

export default function AudioPage() {
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId);
  const theme = useSettingsStore(s => s.settings.theme);
  const { toast } = useToast();
  const allTracks = useAudioStore(s => s.tracks || []);
  const tracks = useMemo(() => allTracks.filter(t => t.campaignId === activeCampaignId), [allTracks, activeCampaignId]);
  const deleteTrack = useAudioStore(s => s.deleteTrack);
  const addTrack = useAudioStore(s => s.addTrack);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'music' | 'ambience' | 'sfx'>('music');
  const [newTags, setNewTags] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    addTrack({
      campaignId: activeCampaignId!,
      title: newTitle,
      type: newType,
      url: newUrl,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsAdding(false);
    setNewTitle('');
    setNewUrl('');
    setNewTags('');
  };

  /**
   * Lädt ein vordefiniertes Audio-Paket basierend auf dem aktuell
   * ausgewählten Theme in den Einstellungen. Fügt die Tracks
   * der aktuellen Kampagne hinzu.
   */
  const handleLoadThemePack = () => {
    let pack: any[] = [];
    if (theme.includes('fantasy')) pack = fantasyAudio;
    else if (theme.includes('scifi')) pack = sciFiAudio;
    else if (theme.includes('cyberpunk')) pack = cyberpunkAudio;
    else if (theme.includes('modern')) pack = modernAudio;
    else pack = modernAudio; // fallback

    pack.forEach(t => {
      addTrack({ ...t, campaignId: activeCampaignId! });
    });
    toast('Theme-Paket erfolgreich geladen!', 'success');
  };

  const music = useMemo(() => tracks.filter(t => t.type === 'music'), [tracks]);
  const ambience = useMemo(() => tracks.filter(t => t.type === 'ambience'), [tracks]);
  const sfx = useMemo(() => tracks.filter(t => t.type === 'sfx'), [tracks]);

  const TrackList = ({ items, icon: Icon, title }: { items: any[], icon: any, title: string }) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <Icon size={18} /> {title} ({items.length})
      </h2>
      <div className={styles.grid}>
        {items.map(track => (
          <div key={track.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <button className={styles.deleteBtn} onClick={() => deleteTrack(track.id)}>
                <Trash2 size={14} />
              </button>
            </div>
            {track.tags.length > 0 && (
              <div className={styles.tags}>
                {track.tags.map((tag: string) => <span key={tag} className={styles.tag}>{tag}</span>)}
              </div>
            )}
            <div className={styles.cardActions}>
              <a href={track.url} target="_blank" rel="noopener noreferrer" className={styles.playLink}>
                <Play size={14} /> Abspielen
              </a>
              <a href={track.url} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Audio & Sounds"
        subtitle="Musik, Ambiente und Geräusche für deine Kampagne"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="secondary" icon={<Radio size={16} />} onClick={handleLoadThemePack}>
              Theme-Paket laden
            </Button>
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsAdding(!isAdding)}>
              Neuer Track
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        {isAdding && (
          <div className={styles.addForm}>
            <h3 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>Neuen Track hinzufügen</h3>
            <div className={styles.formGrid}>
              <FormField label="Titel" required>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="z.B. Düsterer Wald" />
              </FormField>
              <FormField label="Kategorie">
                <select className={styles.select} value={newType} onChange={e => setNewType(e.target.value as any)}>
                  <option value="music">Musik</option>
                  <option value="ambience">Ambiente</option>
                  <option value="sfx">Soundeffekt</option>
                </select>
              </FormField>
              <FormField label="URL (YouTube, Spotify, etc.)" required>
                <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." />
              </FormField>
              <FormField label="Tags (Komma getrennt)">
                <Input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="Gruselig, Wald, Nacht" />
              </FormField>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-4)' }}>
              <Button variant="primary" onClick={handleAdd}>Speichern</Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Abbrechen</Button>
            </div>
          </div>
        )}

        {tracks.length === 0 && !isAdding ? (
          <EmptyState
            title="Keine Sounds gefunden"
            description="Füge Musik, Hintergrundgeräusche oder Effekte hinzu, um sie griffbereit zu haben."
            action={<Button variant="primary" onClick={() => setIsAdding(true)}>Ersten Track hinzufügen</Button>}
          />
        ) : (
          <div className={styles.trackSections}>
            {music.length > 0 && <TrackList items={music} icon={Music} title="Musik" />}
            {ambience.length > 0 && <TrackList items={ambience} icon={Radio} title="Ambiente" />}
            {sfx.length > 0 && <TrackList items={sfx} icon={Volume2} title="Soundeffekte" />}
          </div>
        )}
      </div>
    </div>
  );
}
