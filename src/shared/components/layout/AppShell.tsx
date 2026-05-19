import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
