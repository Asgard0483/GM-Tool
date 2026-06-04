export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  features: string[];
  fixes: string[];
}

export const changelogData: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2026-06-05',
    title: 'Design-Upgrade & Kalender-Navigation',
    description: 'Diese Version bringt ein modernes Apple Glass Design sowie starke Verbesserungen in der Bedienbarkeit des Kalenders.',
    features: [
      'Apple Glass Design: Neues, elegantes UI-Design mit Milchglas-Effekten (Glassmorphism) in der gesamten App.',
      'Zeitleisten-Integration: Neue vertikale Zeitleisten für Charaktere und Orte, die alle Kalenderereignisse übersichtlich darstellen.',
      'Kalender-Navigation: Direktes Anspringen von Jahren im Kalender per Eingabefeld hinzugefügt.',
      'Alle Ereignisse: Neuer Tab im Kalender, um alle Kampagnen-Ereignisse chronologisch aufzulisten.',
      'Schnell-Navigation: Klicks auf Ereignisse in Zeitleisten leiten nun direkt zum entsprechenden Datum im Kalender weiter und öffnen den Editor.',
      'Erweiterte Demo-Daten: 8 neue Kalender-Ereignisse wurden in den Demo-Daten ("Seed") hinzugefügt und mit Charakteren verknüpft.'
    ],
    fixes: [
      'Behebung des Übersetzungsfehlers für "sidebar.calendar" in der Navigation.',
      'Vollständige englische Code-Dokumentation (JSDoc) für neu erstellte Komponenten.'
    ]
  },
  {
    version: '1.1.0',
    date: '2026-06-05',
    title: 'Items, Kalender-Update & Bilder',
    description: 'Dieses Update bringt ein komplett neues Inventarsystem, mehr Flexibilität im Kalender und visuelle Verbesserungen für den Weltbau.',
    features: [
      'Gegenstände-Modul: Komplett neues System für Items mit Seltenheit, Werten und Hintergrund.',
      'Charakter-Inventar: Gegenstände können direkt Charakteren zugewiesen werden.',
      'Weltbau-Bilder: Orts- und Fraktionseinträge können jetzt mit Bild-URLs ausgestattet werden, die als Banner und Thumbnails dienen.',
      'Erweiterter Kalender: Das Jahr ist nun direkt editierbar. Wochentage und Monatsnamen können frei konfiguriert werden.',
      'Neue Demo-Inhalte: Umfangreichere Seed-Daten, um die neuen Story- und Item-Funktionen zu demonstrieren.',
      'Changelog: Diese Übersichtsseite hinzugefügt.'
    ],
    fixes: [
      'Behebung von TypeScript-Fehlern in der StoryEntity-Typisierung.',
      'Behebung fehlender Pflichtfelder beim Speichern von Formularen.'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-06-04',
    title: 'Initialer Release',
    description: 'Die erste Version des Ultimate GM Tools.',
    features: [
      'Charakterverwaltung: Vollständige Verwaltung von PCs und NPCs.',
      'Beziehungsnetzwerk: Visualisierung von Charakter-Verbindungen.',
      'Weltbau-Wiki: Verwaltung von Orten, Regionen und Fraktionen.',
      'Gameplay-Tracker: Quests, Szenen und Session-Logs.',
      'Story-Modul: Schreiben und Verwalten von Kapiteln und Lore.',
      'Karten-Modul: Hochladen und Pinnen von interaktiven Karten.',
      'Export-Funktion: Generierung von Charakterbögen als PDF.'
    ],
    fixes: []
  }
];
