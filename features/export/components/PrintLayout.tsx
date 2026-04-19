import React from 'react';
import styles from './PrintLayout.module.css';

interface PrintLayoutProps {
  theme: 'legendary' | 'minimalist' | 'dark-digital';
  title: string;
  children: React.ReactNode;
}

export default function PrintLayout({ theme, title, children }: PrintLayoutProps) {
  return (
    <div className={styles.wrapper} data-print-theme={theme}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          GM Tool Export · {new Date().toLocaleDateString('de-DE')}
        </div>
      </header>
      
      <main className={styles.content}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        Seite <span className={styles.pageNumber}></span>
      </footer>
    </div>
  );
}
