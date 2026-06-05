import type { StoryEntity } from '@/shared/types';

export const cthulhuStories: StoryEntity[] = [
  {
    id: 'cth-story-001', entityType: 'story',
    title: 'Kapitel 1: Ein Schatten über Arkham',
    chapter_number: 1,
    status: 'final',
    content: 'Alles begann mit dem Verschwinden von Professor Armitage. Detective Vance wurde von Margaret Finch angeheuert, um diskret nach ihm zu suchen. Die ersten Spuren führten in den Hafen, wo zwielichtige Gestalten Kisten mit seltsamen ägyptischen Relikten in Blackwood Manor lieferten.',
    summary: 'Die Einführung der Ermittler und die Entdeckung des Kults.',
    tags: ['intro', 'arkham', 'ermittlung'],
    notes: 'Die Spieler sollten früh merken, dass die normale Polizei ihnen nicht helfen wird.',
    metadata: {}, createdAt: '1925-09-01T12:00:00Z', updatedAt: '1925-09-05T14:00:00Z', campaignId: 'cthulhu',
  },
  {
    id: 'cth-story-002', entityType: 'story',
    title: 'Kapitel 2: Schreie im Manor',
    chapter_number: 2,
    status: 'draft',
    content: 'Nachdem die Ermittler in Blackwood Manor eingebrochen sind, stießen sie auf das Geheimlabor von Silas Thorne. Im Keller wartet eine Konfrontation mit einer Monstrosität, die Thorne durch Blutopfer kontrolliert.',
    summary: 'Der Klimax im Herrenhaus.',
    tags: ['klimax', 'kampf', 'horror'],
    notes: 'Dies ist der erste Stabilitäts-Test für das Monster. Wenn die Ermittler keinen Fluchtweg haben, könnte es ein TPK werden.',
    metadata: {}, createdAt: '1925-09-01T13:00:00Z', updatedAt: '1925-09-05T15:00:00Z', campaignId: 'cthulhu',
  }
];
