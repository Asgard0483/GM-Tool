import React, { useState, useRef } from 'react';
import styles from './HoverPreview.module.css';

export interface EntityPreviewData {
  title: string;
  icon: React.ReactNode;
  imageUrl?: string;
  description?: string;
  tags?: string[];
}

interface HoverPreviewProps {
  children: React.ReactNode;
  entity?: EntityPreviewData;
}

export default function HoverPreview({ children, entity }: HoverPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!entity) return <>{children}</>;

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsVisible(true), 400); // 400ms delay
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  return (
    <span 
      className={styles.wrapper} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={styles.tooltip}>
          {entity.imageUrl && (
            <img src={entity.imageUrl} alt={entity.title} className={styles.image} />
          )}
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.icon}>{entity.icon}</span>
              <span className={styles.title}>{entity.title}</span>
            </div>
            {entity.description && (
              <div className={styles.desc}>{entity.description}</div>
            )}
            {entity.tags && entity.tags.length > 0 && (
              <div className={styles.tags}>
                {entity.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
                {entity.tags.length > 3 && <span className={styles.tag}>+{entity.tags.length - 3}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
