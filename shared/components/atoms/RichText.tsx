import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Swords } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import styles from './RichText.module.css';

interface RichTextProps {
  content: string;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function RichText({ content }: RichTextProps) {
  const characters = useCharacterStore(s => s.characters);
  const worldEntities = useWorldStore(s => s.entities);
  const gameplayEntities = useGameplayStore(s => s.entities);

  // Build a lookup map of all valid entities, lowercased, length > 2
  const entityMap = useMemo(() => {
    const map = new Map<string, any>();
    
    characters.forEach(c => {
      if (c.name.trim().length > 2) {
        map.set(c.name.trim().toLowerCase(), { type: 'character', route: `/characters/${c.id}`, icon: <Users size={12} /> });
      }
    });
    worldEntities.forEach(w => {
      if (w.title.trim().length > 2) {
        map.set(w.title.trim().toLowerCase(), { type: 'world', route: `/worldbuilding/${w.id}`, icon: <Globe size={12} /> });
      }
    });
    gameplayEntities.forEach(g => {
      if (g.title.trim().length > 2) {
        map.set(g.title.trim().toLowerCase(), { type: 'gameplay', route: `/gameplay/${g.id}`, icon: <Swords size={12} /> });
      }
    });
    
    return map;
  }, [characters, worldEntities, gameplayEntities]);

  // Build the unified regex for auto-highlighting
  const autoRegex = useMemo(() => {
    if (entityMap.size === 0) return null;
    const names = Array.from(entityMap.keys())
      .sort((a, b) => b.length - a.length) // Longest first to avoid partial matches
      .map(escapeRegExp);
    
    // Use Unicode property escapes for punctuation boundaries
    return new RegExp(`(?<=^|[\\s\\p{P}])(${names.join('|')})(?=[\\s\\p{P}]|$)`, 'giu');
  }, [entityMap]);

  if (!content) return null;

  // Split out explicit [[Name]] blocks first
  const blocks = content.split(/(\[\[.*?\]\])/g);

  return (
    <span className={styles.wrapper}>
      {blocks.map((block, i) => {
        // Explicit Mention (e.g. [[Lady Vane]])
        if (block.startsWith('[[') && block.endsWith(']]')) {
          const innerName = block.slice(2, -2);
          const match = entityMap.get(innerName.trim().toLowerCase());
          
          if (match) {
            return (
              <Link key={`exp-${i}`} to={match.route} className={`${styles.link} ${styles[match.type]}`}>
                <span className={styles.icon}>{match.icon}</span>
                {innerName}
              </Link>
            );
          }
          return <span key={`exp-${i}`} className={styles.brokenLink}>{innerName}</span>;
        }
        
        // Normal text -> apply auto-highlighting if regex exists
        if (autoRegex) {
          const autoParts = block.split(autoRegex);
          return (
            <React.Fragment key={`block-${i}`}>
              {autoParts.map((part, j) => {
                // Odd indexes are our regex matches!
                if (j % 2 !== 0) {
                  const match = entityMap.get(part.toLowerCase());
                  if (match) {
                    return (
                      <Link key={`auto-${i}-${j}`} to={match.route} className={`${styles.link} ${styles[match.type]}`}>
                        {part}
                      </Link>
                    );
                  }
                }
                return <React.Fragment key={`text-${i}-${j}`}>{part}</React.Fragment>;
              })}
            </React.Fragment>
          );
        }

        // If no regex, just return the raw text block
        return <React.Fragment key={`block-${i}`}>{block}</React.Fragment>;
      })}
    </span>
  );
}
