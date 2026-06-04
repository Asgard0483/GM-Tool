import { useItemStore } from '@/features/items/store/itemStore';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { generateId, now } from '@/shared/utils/helpers';
import type { ItemEntity } from '@/shared/types';

export const seedItems = (campaignId: string) => {
  const characters = useCharacterStore.getState().characters;
  const thorvald = characters.find(c => c.name === 'Thorvald Eichenschild');
  const elara = characters.find(c => c.name === 'Elara Sternenweber');

  const items: ItemEntity[] = [
    {
      id: generateId(),
      entityType: 'item',
      title: 'Axt der zerschmetterten Berge',
      rarity: 'rare',
      stats: '+2 Angriff, 1W12 Schaden',
      description: 'Eine schwere Kriegsaxt aus Zwergenstahl. Die Klinge ist mit Runen verziert, die leicht bläulich schimmern.',
      background: 'Geschmiedet von den Zwergenmeistern in Kar-Dun. Thorvald gewann sie in einem ehrbaren Kampf gegen einen Orkhäuptling.',
      ownerId: thorvald?.id || '',
      tags: ['Waffe', 'Zweihändig', 'Nahkampf'],
      status: 'active',
      notes: 'Wenn ein kritischer Treffer gewürfelt wird, erzeugt die Axt ein donnerndes Geräusch, das Gegner in 3m Umkreis für eine Runde taub machen kann.',
      metadata: {},
      createdAt: now(),
      updatedAt: now(),
      campaignId
    },
    {
      id: generateId(),
      entityType: 'item',
      title: 'Amulett des verborgenen Wissens',
      rarity: 'epic',
      stats: '+1 auf alle Wissenswürfe',
      description: 'Ein unscheinbares Silberamulett in Form eines Auges.',
      background: 'Ein Erbstück aus den alten Tagen des Elfenreichs. Es soll dem Träger Flüstern der Vergangenheit einhauchen.',
      ownerId: elara?.id || '',
      tags: ['Amulett', 'Magisch', 'Wissen'],
      status: 'active',
      notes: 'Kann einmal am Tag verwendet werden, um eine Information über einen historischen Gegenstand zu erhalten.',
      metadata: {},
      createdAt: now(),
      updatedAt: now(),
      campaignId
    },
    {
      id: generateId(),
      entityType: 'item',
      title: 'Heiltrank (Einfach)',
      rarity: 'common',
      stats: 'Heilt 2W4+2 HP',
      description: 'Eine kleine Phiole mit einer rötlich leuchtenden Flüssigkeit, die nach Erdbeeren riecht.',
      background: 'Von einer Händlerin in Kerlothaven erworben.',
      ownerId: '',
      tags: ['Trank', 'Heilung', 'Verbrauchsgegenstand'],
      status: 'active',
      notes: '',
      metadata: {},
      createdAt: now(),
      updatedAt: now(),
      campaignId
    }
  ];

  useItemStore.setState({ entities: items });
};
