import type { ItemEntity } from '@/shared/types';

export const cthulhuItems: ItemEntity[] = [
  {
    id: 'cth-item-001', entityType: 'item',
    title: 'Fragment des Necronomicon',
    rarity: 'legendary',
    ownerId: 'cth-char-002',
    description: 'Diese Seiten enthalten rituelle Formeln zur Beschwörung von Kreaturen, die "außerhalb" wandeln. Das Lesen kostet 1D4 Stabilität.',
    stats: 'Cthulhu-Mythos +2% beim Lesen.',
    background: 'Von Margaret Finch im Giftschrank der Bibliothek entdeckt und heimlich entwendet.',
    tags: ['mythos', 'buch', 'gefährlich'],
    status: 'active', notes: '',
    imageUrl: '/images/necronomicon_fragment.png',
    metadata: {}, createdAt: '1925-09-02T10:00:00Z', updatedAt: '1925-09-02T10:00:00Z', campaignId: 'cthulhu',
  },
  {
    id: 'cth-item-002', entityType: 'item',
    title: 'Vance\'s .38 Special',
    rarity: 'common',
    ownerId: 'cth-char-001',
    description: 'Diese Waffe hat Vance durch den Krieg begleitet. Zuverlässig, auch wenn sie manchmal Ladehemmungen hat, wenn es regnet.',
    stats: 'Schaden: 1D10. Reichweite: 15m. Kapazität: 6.',
    background: 'Dienstwaffe aus dem Großen Krieg.',
    tags: ['waffe', 'feuerwaffe'],
    status: 'active', notes: '',
    imageUrl: '/images/vance_revolver.png',
    metadata: {}, createdAt: '1925-09-02T11:00:00Z', updatedAt: '1925-09-02T11:00:00Z', campaignId: 'cthulhu',
  },
  {
    id: 'cth-item-003', entityType: 'item',
    title: 'Obsidian-Dolch',
    rarity: 'rare',
    ownerId: 'cth-char-003',
    description: 'Dieser Dolch wird in Ritualen des Kultes verwendet, um Blutopfer zu erbringen. Die Klinge scheint Licht zu schlucken.',
    stats: 'Schaden: 1D4+2+DB. Kann als magische Waffe gegen Mythos-Kreaturen eingesetzt werden.',
    background: 'Von Silas Thorne aus einer ägyptischen Ausgrabungsstätte gestohlen.',
    tags: ['waffe', 'ritual', 'magisch'],
    status: 'active', notes: '',
    imageUrl: '/images/obsidian_dagger.png',
    metadata: {}, createdAt: '1925-09-02T12:00:00Z', updatedAt: '1925-09-02T12:00:00Z', campaignId: 'cthulhu',
  }
];
