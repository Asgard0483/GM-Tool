import { useNavigate } from 'react-router-dom';
import { Users, Globe, Swords, Download, Plus, Database, Trash2, Clock, BookOpen } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useStoryStore } from '@/features/story/store/storyStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useCampaignStore } from '@/store/campaignStore';
import { loadSeedData, clearAllData, SEED_STATS } from '@/seed';
import { useToast } from '@/shared/components/atoms/Toast';
import { useTranslation } from '@/shared/i18n/useTranslation';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import { timeAgo } from '@/shared/utils/helpers';
import CalendarWidget from '@/features/calendar/components/CalendarWidget';
import DiceRoller from '@/shared/components/DiceRoller';
import styles from './DashboardPage.module.css';

interface ModuleTileProps {
  icon: typeof Users;
  label: string;
  count: number;
  color: string;
  to: string;
  description: string;
}

function ModuleTile({ icon: Icon, label, count, color, to, description }: ModuleTileProps) {
  const navigate = useNavigate();
  return (
    <div className={styles.tile} onClick={() => navigate(to)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(to)}>
      <div className={styles.tileIcon} style={{ background: color }}>
        <Icon size={22} color="white" />
      </div>
      <div className={styles.tileContent}>
        <div className={styles.tileLabel}>{label}</div>
        <div className={styles.tileCount}>{count}</div>
        <div className={styles.tileDesc}>{description}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const characters = useCharacterStore(s => s.characters);
  const relationships = useRelationshipStore(s => s.relationships);
  const worldEntities = useWorldStore(s => s.entities);
  const gameplayEntities = useGameplayStore(s => s.entities);
  const storyEntities = useStoryStore(s => s.entities);
  const { settings } = useSettingsStore();
  const { getActiveCampaign, activeCampaignId } = useCampaignStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const activeCampaign = getActiveCampaign();
  
  // Filter everything by campaign
  const campaignChars = characters.filter(c => c.campaignId === activeCampaignId);
  const campaignWorld = worldEntities.filter(e => e.campaignId === activeCampaignId);
  const campaignGameplay = gameplayEntities.filter(e => e.campaignId === activeCampaignId);
  const campaignStory = storyEntities.filter(e => e.campaignId === activeCampaignId);

  const isEmpty = campaignChars.length === 0 && campaignWorld.length === 0 && campaignGameplay.length === 0;

  const handleLoadSeed = (type: 'fantasy' | 'cthulhu') => {
    loadSeedData(type);
    const message = t('dashboard.seedStats')
      .replace('{{chars}}', SEED_STATS.characters.toString())
      .replace('{{rels}}', SEED_STATS.relationships.toString())
      .replace('{{world}}', SEED_STATS.worldEntities.toString())
      .replace('{{game}}', SEED_STATS.gameplayEntities.toString());
    toast(message, 'success');
  };

  const handleClear = () => {
    clearAllData();
    toast(t('dashboard.clearAll') + ' OK', 'info');
  };

  // Recent activity: combine all campaign entities, sort by updatedAt, take last 8
  type ActivityItem = { id: string; type: string; title: string; updatedAt: string; route: string };
  const allActivity: ActivityItem[] = [
    ...campaignChars.map(c => ({ id: c.id, type: t('sidebar.characters'), title: c.name, updatedAt: c.updatedAt, route: `/characters/${c.id}` })),
    ...campaignWorld.map(e => ({ id: e.id, type: t('sidebar.worldbuilding'), title: e.title, updatedAt: e.updatedAt, route: `/worldbuilding/${e.id}` })),
    ...campaignGameplay.map(e => ({ id: e.id, type: t('sidebar.gameplay'), title: e.title, updatedAt: e.updatedAt, route: `/gameplay/${e.id}` })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>{t('common.campaign')}</div>
          <h1 className={styles.heroTitle}>{activeCampaign?.name || settings.campaignName}</h1>
          <p className={styles.heroSub}>{t('dashboard.heroSub')}</p>
        </div>
        <div className={styles.heroActions}>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/characters/new')}>
            {t('dashboard.newCharacter')}
          </Button>
          <Button variant="secondary" icon={<Database size={16} />} onClick={() => handleLoadSeed('fantasy')}>
            Fantasy Demo
          </Button>
          <Button variant="secondary" icon={<Database size={16} />} onClick={() => handleLoadSeed('cthulhu')}>
            Cthulhu Demo
          </Button>
          {!isEmpty && (
            <Button variant="ghost" icon={<Trash2 size={16} />} onClick={handleClear}>
              {t('dashboard.clearAll')}
            </Button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.topGrid}>
            <div className={styles.topMain}>
                <CalendarWidget />
                <div className={styles.quickStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statVal}>{campaignChars.length}</span>
                        <span className={styles.statLab}>{t('sidebar.characters')}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statVal}>{campaignWorld.length}</span>
                        <span className={styles.statLab}>{t('sidebar.worldbuilding')}</span>
                    </div>
                </div>
            </div>
            <div className={styles.topSide}>
                <DiceRoller />
            </div>
        </div>

        {/* Module Tiles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('dashboard.modules')}</h2>
          <div className={styles.tilesGrid}>
            <ModuleTile icon={Users} label={t('sidebar.characters')} count={campaignChars.length}
              color="#6366f1" to="/characters" description={t('dashboard.descChar')} />
            <ModuleTile icon={Globe} label={t('sidebar.worldbuilding')} count={campaignWorld.length}
              color="#0284c7" to="/worldbuilding" description={t('dashboard.descWorld')} />
            <ModuleTile icon={BookOpen} label={t('sidebar.story')} count={campaignStory?.length || 0}
              color="#9333ea" to="/story" description={t('dashboard.descStory')} />
            <ModuleTile icon={Swords} label={t('sidebar.gameplay')} count={campaignGameplay.length}
              color="#16a34a" to="/gameplay" description={t('dashboard.descGame')} />
            <ModuleTile icon={Download} label={t('sidebar.export')} count={0}
              color="#d97706" to="/export" description={t('dashboard.descExport')} />
          </div>
        </section>

        {/* Empty State */}
        {isEmpty && (
          <div className={styles.emptyHero}>
            <div className={styles.emptyIcon}>📜</div>
            <h2 className={styles.emptyTitle}>{t('dashboard.emptyTitle')}</h2>
            <p className={styles.emptyDesc}>
              {t('dashboard.emptyDesc')}
            </p>
            <div className={styles.emptyActions}>
              <Button variant="primary" size="lg" icon={<Database size={18} />} onClick={() => handleLoadSeed('fantasy')}>
                {t('dashboard.loadFirst')}
              </Button>
              <Button variant="primary" size="lg" icon={<Database size={18} />} onClick={() => handleLoadSeed('cthulhu')}>
                Cthulhu Demo laden
              </Button>
              <Button variant="secondary" size="lg" icon={<Plus size={18} />} onClick={() => navigate('/characters/new')}>
                {t('dashboard.createFirst')}
              </Button>
            </div>
            <div className={styles.emptyStats}>
              <span>{SEED_STATS.characters} {t('dashboard.statsChars')}</span>
              <span>·</span>
              <span>{SEED_STATS.relationships} {t('dashboard.statsRels')}</span>
              <span>·</span>
              <span>{SEED_STATS.worldEntities} {t('dashboard.statsWorld')}</span>
              <span>·</span>
              <span>{SEED_STATS.gameplayEntities} {t('dashboard.statsGame')}</span>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {allActivity.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Clock size={16} />
              {t('dashboard.recentActivity')}
            </h2>
            <div className={styles.activityList}>
              {allActivity.map(item => (
                <div key={item.id} className={styles.activityItem}
                  onClick={() => navigate(item.route)}>
                  <Badge variant="default" size="sm">{item.type}</Badge>
                  <span className={styles.activityTitle}>{item.title}</span>
                  <span className={styles.activityTime}>{timeAgo(item.updatedAt)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('dashboard.quickActions')}</h2>
          <div className={styles.quickGrid}>
            <button className={styles.quickAction} onClick={() => navigate('/characters/new')}>
              <Users size={18} /> {t('dashboard.newCharacter')}
            </button>
            <button className={styles.quickAction} onClick={() => navigate('/worldbuilding')}>
              <Globe size={18} /> {t('worldbuilding.new')}
            </button>
            <button className={styles.quickAction} onClick={() => navigate('/gameplay')}>
              <Swords size={18} /> {t('gameplay.new')}
            </button>
            <button className={styles.quickAction} onClick={() => navigate('/characters/network')}>
              <Users size={18} /> {t('dashboard.networkGraph')}
            </button>
            <button className={styles.quickAction} onClick={() => navigate('/characters/relationships')}>
              <Users size={18} /> {t('dashboard.relationships')}
            </button>
            <button className={styles.quickAction} onClick={() => navigate('/export')}>
              <Download size={18} /> {t('sidebar.export')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
