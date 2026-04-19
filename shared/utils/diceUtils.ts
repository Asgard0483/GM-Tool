/**
 * Simple dice rolling utility
 */

export interface RollResult {
  formula: string;
  total: number;
  rolls: number[];
  modifier: number;
}

export function rollDice(formula: string): RollResult {
  // Normalize formula: "2d20 + 5" -> "2d20+5"
  const cleanFormula = formula.toLowerCase().replace(/\s+/g, '');
  
  // Regex for "XdY+Z" or "XdY-Z" or just "XdY"
  const diceRegex = /^(\d*)d(\d+)([+-]\d+)?$/;
  const match = cleanFormula.match(diceRegex);
  
  if (!match) {
    // Fallback or simple number
    const num = parseInt(cleanFormula, 10);
    return { formula, total: isNaN(num) ? 0 : num, rolls: [], modifier: num || 0 };
  }
  
  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = parseInt(match[3] || '0', 10);
  
  const rolls: number[] = [];
  let total = 0;
  
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }
  
  total += modifier;
  
  return {
    formula: cleanFormula,
    total,
    rolls,
    modifier
  };
}

export function getDieIcon(sides: number): string {
  if (sides <= 4) return 'D4';
  if (sides <= 6) return 'D6';
  if (sides <= 8) return 'D8';
  if (sides <= 10) return 'D10';
  if (sides <= 12) return 'D12';
  if (sides <= 20) return 'D20';
  return 'Dx';
}
