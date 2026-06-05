import type { Relationship } from '@/shared/types';
import { generateId } from '@/shared/utils/helpers';

export const cthulhuRelationships: Relationship[] = [
  {
    id: generateId(),
    entityType: 'relationship',
    source_character_id: 'cth-char-001',
    target_character_id: 'cth-char-002',
    relationship_type: 'acquaintance',
    direction: 'directed',
    intensity: 3,
    attitude: 'neutral',
    visibility: 'public',
    status: 'active',
    description: 'Vance wurde von Margaret angeheuert, um das Verschwinden des Professors diskret zu untersuchen.',
    history: '',
    tags: [], notes: '', metadata: {}, createdAt: '1925-09-02T12:00:00Z', updatedAt: '1925-09-02T12:00:00Z',
    campaignId: 'cthulhu'
  },
  {
    id: generateId(),
    entityType: 'relationship',
    source_character_id: 'cth-char-003',
    target_character_id: 'cth-char-004',
    relationship_type: 'secret_connection',
    direction: 'directed',
    intensity: 5,
    attitude: 'positive',
    visibility: 'gm_only',
    status: 'active',
    description: 'Thorne hat das Ding gebunden und opfert ihm frisches Fleisch.',
    history: '',
    tags: [], notes: '', metadata: {}, createdAt: '1925-09-02T12:00:00Z', updatedAt: '1925-09-02T12:00:00Z',
    campaignId: 'cthulhu'
  },
  {
    id: generateId(),
    entityType: 'relationship',
    source_character_id: 'cth-char-001',
    target_character_id: 'cth-char-003',
    relationship_type: 'enmity',
    direction: 'symmetric',
    intensity: 4,
    attitude: 'negative',
    visibility: 'public',
    status: 'active',
    description: 'Vance vermutet, dass Thorne tief in kriminelle Machenschaften verwickelt ist, kann es aber (noch) nicht beweisen.',
    history: '',
    tags: [], notes: '', metadata: {}, createdAt: '1925-09-02T12:00:00Z', updatedAt: '1925-09-02T12:00:00Z',
    campaignId: 'cthulhu'
  }
];
