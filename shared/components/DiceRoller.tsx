import { useState, useRef } from 'react';
import { History, Star, X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { useDiceStore } from '@/features/gameplay/store/diceStore';
import { rollDice } from '@/shared/utils/diceUtils';
import Button from '@/shared/components/atoms/Button';
import styles from './DiceRoller.module.css';

const COMMON_DICE = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRoller() {
  const { history, favorites, addRoll, clearHistory, removeFavorite } = useDiceStore();
  const [customFormula, setCustomFormula] = useState('');
  const [activeTab, setActiveTab] = useState<'roll' | 'history' | 'favs'>('roll');
  const [lastResult, setLastResult] = useState<{ total: number; detail: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = (formula: string, label?: string) => {
    setIsRolling(true);
    setLastResult(null);
    
    // Simulate animation delay
    setTimeout(() => {
      const res = rollDice(formula);
      addRoll({
        formula: res.formula,
        result: res.total,
        individualResults: res.rolls,
        label
      });
      setLastResult({
        total: res.total,
        detail: res.rolls.length > 1 
          ? `(${res.rolls.join(' + ')})${res.modifier ? (res.modifier > 0 ? ' + ' + res.modifier : ' - ' + Math.abs(res.modifier)) : ''}` 
          : formula
      });
      setIsRolling(false);
    }, 400);
  };

  return (
    <div className={styles.roller}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'roll' ? styles.tabActive : ''}`} onClick={() => setActiveTab('roll')}>Würfeln</button>
        <button className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`} onClick={() => setActiveTab('history')}>Verlauf</button>
        <button className={`${styles.tab} ${activeTab === 'favs' ? styles.tabActive : ''}`} onClick={() => setActiveTab('favs')}>Favoriten</button>
      </div>

      <div className={styles.content}>
        {activeTab === 'roll' && (
          <div className={styles.rollTab}>
            <div className={styles.diceGrid}>
              {COMMON_DICE.map(d => (
                <button key={d} className={styles.dieBtn} onClick={() => handleRoll(`1d${d}`)}>
                  <span className={styles.dieType}>D{d}</span>
                </button>
              ))}
            </div>

            <div className={styles.inputArea}>
              <input 
                className={styles.input}
                placeholder="z.B. 2d6 + 3"
                value={customFormula}
                onChange={e => setCustomFormula(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRoll(customFormula)}
              />
              <Button variant="primary" size="sm" onClick={() => handleRoll(customFormula)} disabled={!customFormula}>
                Roll
              </Button>
            </div>

            <div className={`${styles.resultArea} ${isRolling ? styles.rolling : ''}`}>
              {isRolling ? (
                <div className={styles.rollingText}>Wird gewürfelt...</div>
              ) : lastResult ? (
                <>
                  <div className={styles.total}>{lastResult.total}</div>
                  <div className={styles.detail}>{lastResult.detail}</div>
                </>
              ) : (
                <div className={styles.placeholder}>Wähle einen Würfel</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historyTab}>
            <div className={styles.listHeader}>
              <span>Letzte Würfe</span>
              <button className={styles.clearBtn} onClick={clearHistory}><Trash2 size={12} /></button>
            </div>
            <div className={styles.list}>
              {history.length === 0 ? <div className={styles.empty}>Noch keine Würfe</div> : 
                history.map(r => (
                  <div key={r.id} className={styles.listItem}>
                    <div className={styles.listMain}>
                      <span className={styles.listFormula}>{r.formula}</span>
                      {r.label && <span className={styles.listLabel}>{r.label}</span>}
                    </div>
                    <div className={styles.listResult}>{r.result}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'favs' && (
          <div className={styles.favsTab}>
             <div className={styles.list}>
              {favorites.length === 0 ? <div className={styles.empty}>Keine Favoriten gespeichert</div> : 
                favorites.map(f => (
                  <div key={f.id} className={styles.favItem} onClick={() => handleRoll(f.formula, f.label)}>
                    <div className={styles.favInfo}>
                      <div className={styles.favLabel}>{f.label}</div>
                      <div className={styles.favFormula}>{f.formula}</div>
                    </div>
                    <button className={styles.favDelete} onClick={(e) => { e.stopPropagation(); removeFavorite(f.id); }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
