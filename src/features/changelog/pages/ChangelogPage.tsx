import { Sparkles, Bug } from 'lucide-react';
import PageHeader from '@/shared/components/layout/PageHeader';
import { changelogData } from '@/shared/data/changelogData';
import styles from './ChangelogPage.module.css';

export default function ChangelogPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Changelog"
        subtitle="Alle Updates und Neuerungen im GM Tool"
      />

      <div className={styles.content}>
        {changelogData.map(entry => (
          <div key={entry.version} className={styles.entry}>
            <div className={styles.header}>
              <div className={styles.versionGroup}>
                <span className={styles.version}>v{entry.version}</span>
                <span className={styles.date}>{new Date(entry.date).toLocaleDateString('de-DE')}</span>
              </div>
              <div className={styles.title}>{entry.title}</div>
            </div>

            <div className={styles.description}>{entry.description}</div>

            {entry.features.length > 0 && (
              <div className={styles.section}>
                <div className={`${styles.sectionTitle} ${styles.featuresTitle}`}>
                  <Sparkles size={16} /> Neue Features & Verbesserungen
                </div>
                <ul className={styles.list}>
                  {entry.features.map((feature, i) => (
                    <li key={i} className={styles.listItem}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {entry.fixes.length > 0 && (
              <div className={styles.section}>
                <div className={`${styles.sectionTitle} ${styles.fixesTitle}`}>
                  <Bug size={16} /> Fehlerbehebungen
                </div>
                <ul className={styles.list}>
                  {entry.fixes.map((fix, i) => (
                    <li key={i} className={styles.listItem}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
