import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, Network, Globe,
  Swords, Download, Sun, Moon, Scroll, Search, Settings, BookOpen, Map, Calendar, Package, Music
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useToast } from '@/shared/components/atoms/Toast';
import { useState } from 'react';
import styles from './Sidebar.module.css';

import { useTranslation } from '@/shared/i18n/useTranslation';

export default function Sidebar() {
  const { t } = useTranslation();
  const { settings, toggleTheme } = useSettingsStore();
  const { campaigns, activeCampaignId, setActiveCampaign, addCampaign, getActiveCampaign } = useCampaignStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSwitch, setShowSwitch] = useState(false);

  const activeCampaign = getActiveCampaign();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/characters', icon: Users, label: t('sidebar.characters') },
    { to: '/items', icon: Package, label: 'Gegenstände' },
    { to: '/story', icon: BookOpen, label: t('sidebar.story') },
    { to: '/worldbuilding', icon: Globe, label: t('sidebar.worldbuilding') },
    { to: '/maps', icon: Map, label: t('sidebar.maps') },
    { to: '/calendar', icon: Calendar, label: t('sidebar.calendar') || 'Kalender' },
    { to: '/audio', icon: Music, label: 'Audio & Sounds' },
    { to: '/gameplay', icon: Swords, label: t('sidebar.gameplay') },
    { to: '/export', icon: Download, label: t('sidebar.export') },
  ];

  const openSearch = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

  return (
    <aside className={styles.sidebar}>
      {/* Branding */}
      <div className={styles.logo} onClick={() => setShowSwitch(!showSwitch)}>
        <Scroll size={22} className={styles.logoIcon} />
        <div className={styles.logoCopy}>
          <span className={styles.logoText}>GM Tool</span>
          <span className={styles.logoCampaign}>{activeCampaign?.name || settings.campaignName}</span>
        </div>
      </div>

      {showSwitch && (
        <div className={styles.campaignList}>
          <div className={styles.campaignListHeader}>Meine Kampagnen</div>
          {campaigns.map(c => (
            <button key={c.id} 
              className={`${styles.campaignItem} ${c.id === activeCampaignId ? styles.campaignItemActive : ''}`}
              onClick={() => { setActiveCampaign(c.id); setShowSwitch(false); navigate('/'); }}
            >
              {c.name}
            </button>
          ))}
          <button className={styles.addCampaignBtn} onClick={() => {
            const name = prompt(t('common.name') + '?');
            if (name) {
              const c = addCampaign(name);
              setActiveCampaign(c.id);
              setShowSwitch(false);
              toast(`"${name}" erstellt.`, 'success');
              navigate('/');
            }
          }}>
            + {t('characters.new')}
          </button>
        </div>
      )}

      <div className={styles.searchTrigger} onClick={openSearch} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && openSearch()}>
        <Search size={14} className={styles.searchTriggerIcon} />
        <span className={styles.searchTriggerText}>{t('sidebar.search')}</span>
        <kbd className={styles.searchKbd}>⌘K</kbd>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.settingsLink} ${isActive ? styles.settingsLinkActive : ''}`
          }
        >
          <Settings size={16} />
          <span>{t('sidebar.settings')}</span>
        </NavLink>
        {(!settings.theme.startsWith('scifi') && !settings.theme.startsWith('cyberpunk')) && (
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={`Zu ${settings.theme.includes('dark') ? 'Hell' : 'Dunkel'}modus wechseln`}
          >
            {settings.theme.includes('dark') ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 'var(--space-4)' }}>
        <NavLink to="/changelog" style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
          v0.14.0 Alpha – Changelog
        </NavLink>
      </div>
    </aside>
  );
}
