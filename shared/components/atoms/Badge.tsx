import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'muted';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function Badge({ children, variant = 'default', size = 'md', dot }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

// Helpers for semantic mapping
export const characterTypeBadge = (typ: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    pc: 'accent', nsc: 'info', enemy: 'danger',
    contact: 'warning', faction_rep: 'success', creature: 'muted', other: 'default',
  };
  return map[typ] ?? 'default';
};

export const characterStatusBadge = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    active: 'success', inactive: 'muted', dead: 'danger', unknown: 'warning', draft: 'default',
  };
  return map[status] ?? 'default';
};

export const relationshipTypeBadge = (_: string): BadgeVariant => 'accent';

export const gameplayStatusBadge = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    open: 'info', active: 'accent', completed: 'success', failed: 'danger', draft: 'muted',
  };
  return map[status] ?? 'default';
};
