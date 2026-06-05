import type { CalendarEvent, CalendarConfig } from '@/shared/types';
import { generateId, now } from '@/shared/utils/helpers';

export const cthulhuCalendarConfig: CalendarConfig = {
  daysPerWeek: 7,
  weekDays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  months: [
    { name: 'Januar', days: 31 }, { name: 'Februar', days: 28 }, { name: 'März', days: 31 },
    { name: 'April', days: 30 }, { name: 'Mai', days: 31 }, { name: 'Juni', days: 30 },
    { name: 'Juli', days: 31 }, { name: 'August', days: 31 }, { name: 'September', days: 30 },
    { name: 'Oktober', days: 31 }, { name: 'November', days: 30 }, { name: 'Dezember', days: 31 }
  ],
  yearOffset: 1900,
  yearName: 'A.D.'
};

export const cthulhuEvents: CalendarEvent[] = [
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Geburt von Arthur Vance',
    description: 'Arthur erblickt in den Gassen von Boston das Licht der Welt.',
    day: 14, month: 4, year: 1891,
    status: 'active',
    linkedEntityId: 'cth-char-001', linkedEntityType: 'character',
    tags: ['geburtstag', 'vergangenheit'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  },
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Die Schlacht an der Somme',
    description: 'Vance überlebt ein grauenhaftes Artilleriefeuer, das seine Einheit dezimiert. Der Beginn seiner PTBS.',
    day: 1, month: 6, year: 1916,
    status: 'active',
    linkedEntityId: 'cth-char-001', linkedEntityType: 'character',
    tags: ['krieg', 'trauma'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  },
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Gründung der Miskatonic University',
    description: 'Ein Meilenstein für die Stadt Arkham. Die Universität öffnet ihre Pforten.',
    day: 5, month: 8, year: 1765,
    status: 'active',
    linkedEntityId: 'cth-world-002', linkedEntityType: 'place',
    tags: ['historie', 'bildung'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  },
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Erwerb von Blackwood Manor',
    description: 'Silas Thorne kauft das verlassene Anwesen auf dem Klippenrand über Arkham.',
    day: 23, month: 10, year: 1922,
    status: 'active',
    linkedEntityId: 'cth-char-003', linkedEntityType: 'character',
    tags: ['immobilie', 'kult'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  },
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Verschwinden von Professor Armitage',
    description: 'Der Bibliothekar wird zuletzt lebend im Orne-Archiv gesehen. Danach verliert sich seine Spur.',
    day: 12, month: 9, year: 1925,
    status: 'active',
    linkedEntityId: 'cth-world-002', linkedEntityType: 'place',
    tags: ['verbrechen', 'ermittlung'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  },
  {
    id: generateId(),
    entityType: 'calendar_event',
    campaignId: 'cthulhu',
    title: 'Blutmond-Ritual',
    description: 'Das geplante Ritual des Kultes des schwarzen Pharao, um das Tor vollständig zu öffnen. Die Ermittler müssen dies verhindern!',
    day: 31, month: 9, year: 1925,
    status: 'active',
    linkedEntityId: 'cth-world-004', linkedEntityType: 'faction',
    tags: ['ritual', 'klimax'], notes: '', metadata: {}, createdAt: now(), updatedAt: now(),
  }
];
