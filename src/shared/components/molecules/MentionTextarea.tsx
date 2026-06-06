import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import { Users, Globe, Swords, Package } from 'lucide-react';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';
import { useItemStore } from '@/features/items/store/itemStore';
import { BaseTextarea } from '@/shared/components/atoms/FormField';
import type { TextareaProps } from '@/shared/components/atoms/FormField';
import styles from './MentionTextarea.module.css';

type EntitySuggestion = {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
};

// Use getCaretCoordinates package if we wanted exact pixel position. 
// For simplicity, we just position the dropdown relative to the wrapper 
// but slightly offset depending on the height, or fixed below.
// A very simple approximation is just bottom-left of the textarea.

export const MentionTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Merge refs so react-hook-form and our internal logic can both access the textarea
    const setRefs = (node: HTMLTextAreaElement) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const characters = useCharacterStore(s => s.characters);
    const worldEntities = useWorldStore(s => s.entities);
    const gameplayEntities = useGameplayStore(s => s.entities);
    const items = useItemStore(s => s.entities);

    const allEntities = useMemo(() => {
      const list: EntitySuggestion[] = [];
      characters.forEach(c => list.push({ id: c.id, name: c.name, type: 'character', icon: <Users size={14} /> }));
      worldEntities.forEach(w => list.push({ id: w.id, name: w.title, type: 'world', icon: <Globe size={14} /> }));
      gameplayEntities.forEach(g => list.push({ id: g.id, name: g.title, type: 'gameplay', icon: <Swords size={14} /> }));
      items.forEach(i => list.push({ id: i.id, name: i.title, type: 'item', icon: <Package size={14} /> }));
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }, [characters, worldEntities, gameplayEntities, items]);

    const [mentionState, setMentionState] = useState<{
      active: boolean;
      query: string;
      startIndex: number;
    }>({ active: false, query: '', startIndex: -1 });

    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredOptions = useMemo(() => {
      if (!mentionState.active) return [];
      const q = mentionState.query.toLowerCase();
      // For explicit matches, we just use includes.
      // For implicit, maybe we want to filter exactly what we checked (startsWith).
      // To keep it simple, we just use includes here, but sort the best matches first.
      return allEntities
        .filter(e => e.name.toLowerCase().includes(q))
        .sort((a, b) => {
          // prioritize those starting with the query
          const aStarts = a.name.toLowerCase().startsWith(q) ? -1 : 1;
          const bStarts = b.name.toLowerCase().startsWith(q) ? -1 : 1;
          return aStarts - bStarts;
        })
        .slice(0, 8);
    }, [mentionState.active, mentionState.query, allEntities]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const cursor = e.target.selectionStart;
      
      const textBeforeCursor = val.slice(0, cursor);
      
      // 1. Check for explicit match (e.g. "[[Sera")
      const explicitMatch = textBeforeCursor.match(/\[\[([^\]]*)$/);

      if (explicitMatch) {
        setMentionState({
          active: true,
          query: explicitMatch[1],
          startIndex: explicitMatch.index!
        });
        setSelectedIndex(0);
      } else {
        // 2. Check for implicit match
        // Get the recent text before cursor, stopping at newlines or major punctuation
        const recentTextMatch = textBeforeCursor.match(/([a-zA-ZäöüÄÖÜß\s-]{1,30})$/);
        
        let foundImplicitMatch = false;

        if (recentTextMatch) {
          const recentText = recentTextMatch[1];
          const tokens = recentText.split(/\s+/);
          
          let matchQuery = '';
          let matchStartIndex = -1;

          // Check up to the last 3 words
          for (let i = Math.min(3, tokens.length); i >= 1; i--) {
            const candidate = tokens.slice(-i).join(' ').trim();
            if (candidate.length >= 3) {
              const qLower = candidate.toLowerCase();
              // Check if any entity name starts with this candidate, or has a word starting with it
              const hasMatch = allEntities.some(e => {
                const parts = e.name.toLowerCase().split(/\s+/);
                return parts.some(p => p.startsWith(qLower)) || e.name.toLowerCase().startsWith(qLower);
              });

              if (hasMatch) {
                const lastIndex = textBeforeCursor.lastIndexOf(candidate);
                if (lastIndex !== -1 && lastIndex >= cursor - candidate.length - 2) {
                  matchQuery = candidate;
                  matchStartIndex = lastIndex;
                  break;
                }
              }
            }
          }

          if (matchQuery) {
            setMentionState({
              active: true,
              query: matchQuery,
              startIndex: matchStartIndex
            });
            setSelectedIndex(0);
            foundImplicitMatch = true;
          }
        }

        if (!foundImplicitMatch) {
          setMentionState(s => ({ ...s, active: false }));
        }
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    const insertMention = (entityName: string) => {
      if (!internalRef.current) return;
      const el = internalRef.current;
      const val = el.value;
      
      const textBefore = val.slice(0, mentionState.startIndex);
      const textAfter = val.slice(el.selectionStart);
      const replacement = `[[${entityName}]] `;
      
      const newVal = textBefore + replacement + textAfter;
      
      // We must manually dispatch a change event so react-hook-form picks it up
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(el, newVal);
      const ev = new Event('input', { bubbles: true });
      el.dispatchEvent(ev);

      setMentionState({ active: false, query: '', startIndex: -1 });
      
      // Set cursor
      setTimeout(() => {
        const newCursorPos = textBefore.length + replacement.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
        el.focus();
      }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (mentionState.active) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredOptions.length));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % Math.max(1, filteredOptions.length));
        } else if (e.key === 'Enter') {
          if (filteredOptions.length > 0) {
            e.preventDefault();
            insertMention(filteredOptions[selectedIndex].name);
          }
        } else if (e.key === 'Escape') {
          setMentionState(s => ({ ...s, active: false }));
        }
      }
      
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    // Click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setMentionState(s => ({ ...s, active: false }));
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll active item into view
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (listRef.current) {
        const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
        if (activeEl) {
          activeEl.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [selectedIndex]);

    return (
      <div className={styles.wrapper} ref={wrapperRef}>
        <BaseTextarea 
          {...props} 
          ref={setRefs}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        
        {mentionState.active && (
          <div 
            className={styles.dropdown}
            style={{ 
              // Basic positioning below the textarea
              top: '100%', 
              left: 0,
              marginTop: '4px'
            }}
          >
            {filteredOptions.length > 0 ? (
              <div ref={listRef}>
                {filteredOptions.map((opt, i) => (
                  <button
                    key={opt.id}
                    className={`${styles.item} ${i === selectedIndex ? styles.itemActive : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      insertMention(opt.name);
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className={styles.itemIcon}>{opt.icon}</span>
                    <span>{opt.name}</span>
                    <span className={styles.itemType}>{opt.type}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>Keine passenden Einträge...</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

MentionTextarea.displayName = 'MentionTextarea';
