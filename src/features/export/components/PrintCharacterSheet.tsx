import React from 'react';
import type { Character } from '@/shared/types';
import styles from './PrintSheets.module.css';

interface PrintCharacterSheetProps {
  character: Character;
}

export default function PrintCharacterSheet({ character }: PrintCharacterSheetProps) {
  return (
    <div className="print-page print-card">
      <div className={styles.characterHeader}>
        {character.portraitUrl && (
          <img src={character.portraitUrl} alt={character.name} className={styles.portrait} />
        )}
        <div className={styles.headerCore}>
          <h2 className={styles.name}>{character.name}</h2>
          <div className={styles.metaRow}>
            <span>{character.type.toUpperCase()}</span>
            <span>·</span>
            <span>{character.species}</span>
            <span>·</span>
            <span>{character.profession_class}</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Personality & Ziele</h3>
          <p>{character.short_description}</p>
          <p><strong>Personality:</strong> {character.personality}</p>
          <p><strong>Ziele:</strong> {character.goals}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Background</h3>
          <p>{character.background}</p>
        </div>
        
        {character.equipment && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Equipment</h3>
            <p>{character.equipment}</p>
          </div>
        )}

        {character.notes && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notizen</h3>
            <p>{character.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
