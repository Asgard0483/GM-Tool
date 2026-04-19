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
            <span>{character.typ.toUpperCase()}</span>
            <span>·</span>
            <span>{character.volk_spezies}</span>
            <span>·</span>
            <span>{character.beruf_klasse}</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Persönlichkeit & Ziele</h3>
          <p>{character.kurzbeschreibung}</p>
          <p><strong>Persönlichkeit:</strong> {character.persoenlichkeit}</p>
          <p><strong>Ziele:</strong> {character.ziele}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Hintergrund</h3>
          <p>{character.hintergrund}</p>
        </div>
        
        {character.ausruestung && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ausrüstung</h3>
            <p>{character.ausruestung}</p>
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
