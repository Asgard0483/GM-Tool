# Changelog - Ultimate GM Tool ⚔️📜

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [1.4.0] - 2026-06-06 (Smart Editing & Previews)
### Hinzugefügt
- **Mitdenkende Autocomplete-Vorschläge:** Automatische Vorschlagsliste beim Schreiben von Texten. Erkennt Kampagnen-Entitäten schon ab 3 getippten Buchstaben und erlaubt blitzschnelles Einfügen.
- **Hover-Karten (Previews):** Fährt man mit der Maus über einen verlinkten Namen im Text, öffnet sich eine elegante kleine Vorschau-Karte im Glassmorphism-Design mit Bild, Kurzbeschreibung und Tags.
- **Dropdown-Design:** Premium-Design für Auswahlmenüs mit Typ-Badges, Akzentrahmen und verbesserter Typografie.

## [1.3.0] - 2026-06-05 (Premium UI & Content Update)
- **Premium UI/UX Overhaul:** Komplettes Redesign mit Glassmorphismus, fließenden CSS-Animationen, taktilen Klick-Feedbacks und einer schwebenden Sidebar.
- **Image Lightbox:** Bilder von Charakteren, Gegenständen und Orten können nun per Klick vergrößert betrachtet werden.
- **Neue Demo-Kampagnen:** "Cthulhu Demo" (1920er Jahre Noir/Horror) und umfangreiche Erweiterung der bestehenden Fantasy-Kampagne mit generierten Assets (Portraits, Karten, Gegenstände).
- **Seed-Data Automatisierung:** Automatische Kalender-Einträge für Events in Demo-Kampagnen generiert.
- **Optimierung:** Kleinere Bugfixes, Anpassungen im Dark Mode und Lokalisierungs-Verbesserungen (Umbenennung von Sidebar-Tabs).

## [1.0.0] - 2026-04-19 (Gold Release)
### Hinzugefügt
- **Dedizierte Datenbank (IndexedDB):** Umstellung von LocalStorage auf IndexedDB für unbegrenzten Speicherplatz und höhere Datensicherheit.
- **PWA-Support:** Die App ist nun als Progressive Web App auf Desktop und Mobilgeräten installierbar und offline-fähig.
- **Backup & Restore:** Funktion zum Exportieren und Importieren der gesamten Datenbank als JSON-Datei.
- **Druck-Themes:** Zwei neue CSS-Print-Layouts ("Legendär" auf Pergament und "Minimalistisch").
- **SEO & Social Media:** OpenGraph Tags für professionelle Link-Vorschauen auf Discord/WhatsApp.
- **Bereinigung:** Entfernung von Boilerplate-Code und Optimierung der Start-Skripte.

## [0.8.0] - Worldbuilding & Immersion
### Hinzugefügt
- **Interaktive Karten:** Upload von Weltkarten mit setzbaren Pins, die direkt mit Lexikon-Einträgen verknüpft sind.
- **Kampagnen-Kalender:** Ein anpassbares Kalender-System mit integrierter Weltuhr (Tracken von Tagen und Stunden).
- **Dice Roller:** Globales Würfel-Tool mit Historie, Favoriten und Dashboard-Widget.
- **Portrait-Support:** Charaktere können nun Bilder via URL oder Upload (base64) erhalten.

## [0.5.0] - Multi-Kampagnen & Enrichment
### Hinzugefügt
- **Kampagnen-Management:** Unterstützung für mehrere unabhängige Kampagnen mit einem zentralen Campaign Switcher.
- **Story-Log:** Ein chronologisches Tagebuch für die Kampagnen-Ereignisse (Kapitel-basiert).
- **Mention-Linking:** Automatisches Verlinken von Entitäten in Textfeldern mittels `[[Name]]` Syntax.

## [0.2.0] - Globalization & Gameplay
### Hinzugefügt
- **Internationalisierung (i18n):** Vollständige Unterstützung für Deutsch und Englisch.
- **Gameplay-Tracking:** Module für Quests, Szenen und Begegnungen.
- **Export Center:** Erste Version des Exports für Charaktere und Weltbau (JSON/Markdown).
- **Beziehungs-Netzwerk:** Graph-Visualisierung der Charakterbeziehungen (React Flow).

## [0.1.0] - Initial Core
### Hinzugefügt
- **Basis-Architektur:** Grundgerüst mit React, Vite, TypeScript und Zustand.
- **Kern-Module:** Erste Versionen von Charakter-Verwaltung und Weltbau-Lexikon.
- **Global Search:** Schnellsuch-Funktion (Cmd+K).
- **Seed-System:** "Die Eiserne Krone" Demo-Daten.

---
*Dokumentiert für die Ewigkeit am 19. April 2026.*
