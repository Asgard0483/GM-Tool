# Ultimate GM Tool ⚔️📜

![Ultimate GM Tool Hero Banner](gm_tool_hero_banner_1776603175782.png)

**Ultimate GM Tool** ist ein hochmodernes, systemneutrales Web-Werkzeug für Pen-&-Paper-Spielleiter. Es wurde entwickelt, um komplexe Kampagnen, lebendige Charaktere und immersive Welten mit Leichtigkeit zu verwalten.

## 🌟 Highlights

- **🗺️ Interaktive Karten:** Lade deine eigenen Weltkarten hoch, platziere Pins und verknüpfe sie direkt mit Lexikoneinträgen.
- **👥 Charakter-Management:** Tiefgreifende Verwaltung von NSCs und Helden, inklusive Beziehungs-Netzwerken und Portraits.
- **🌍 Weltbau-Lexikon:** Organisiere Orte, Fraktionen, Religionen und Lore in einem strukturierten Wiki-System.
- **📅 Kampagnen-Kalender:** Tracke die Zeit in deiner Spielwelt mit einem anpassbaren Kalender und einer integrierten Weltuhr.
- **🎲 Game Master Toolkit:** Ein integrierter Dice-Roller, Quest-Tracker und Session-Logs halten deinen Spielfluss aufrecht.
- **🖨️ Professioneller Export:** Drucke wunderschöne Handouts im "Legendär"-Stil (Pergament) oder exportiere alles als JSON/Markdown/CSV.
- **🚀 Multi-Kampagnen:** Verwalte mehrere Projekte gleichzeitig mit dem integrierten Campaign Switcher.
- **📱 PWA-Ready:** Installiere das Tool auf deinem Desktop oder Smartphone für Offline-Zugriff und App-Feeling.

## 🛠️ Tech Stack

- **Framework:** React 18 mit TypeScript
- **State Management:** Zustand (mit lokaler Persistenz)
- **Styling:** Premium Vanilla CSS mit CSS-Modulen
- **Icons:** Lucide React
- **Build Tool:** Vite

## 🚀 Schnellstart

### Online nutzen
Das Tool ist direkt im Browser einsatzbereit:
**[Demo-Link hier einfügen]**

### Lokal entwickeln
1. Repository klonen:
   ```bash
   git clone https://github.com/[DEIN-NAME]/Ultimate-GM-Tool.git
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Entwicklungs-Server starten:
   ```bash
   npm run dev
   ```

## 🔒 Datenschutz & Hosting
Alle Daten werden **lokal im Browser** (LocalStorage/IndexedDB) gespeichert. Es findet kein Tracking und keine Cloud-Speicherung statt. Deine Kampagnen gehören dir!

---

## 🚀 So bringst du dein Tool online (GitHub Deployment)

Da das Tool für **GitHub Pages** optimiert ist, kannst du es in wenigen Augenblicken weltweit (nur für dich oder deine Gruppe) online schalten:

### 1. Repository erstellen
Erstelle ein neues Projekt auf [GitHub](https://github.com/new). Nenne es z.B. `ultimate-gm-tool`.

### 2. Dateien hochladen 
**WICHTIG:** Lade **NICHT** den Ordner `node_modules` hoch. Dieser ist viel zu groß und wird nicht benötigt.
- Nutze entweder Git (empfohlen):
  ```bash
  git init
  git remote add origin https://github.com/[DEIN-NAME]/[REPO-NAME].git
  git add .
  git commit -m "Initial GM Tool Release"
  git push -u origin main
  ```
- Oder ziehe einfach alle Dateien (außer `node_modules` und `dist`) per Drag-and-Drop in dein GitHub-Fenster.

### 3. Online-Funktion aktivieren
1. Gehe in deinem GitHub-Repository auf **Settings** > **Pages**.
2. Wähle unter "Build and deployment" > "Source" die Option **"GitHub Actions"** aus.
3. Das war's! In ca. 1 Minute ist dein Tool unter `https://[DEIN-NAME].github.io/[REPO-NAME]/` online.

### 🔒 Deine Daten sind sicher
Auch wenn das Tool online läuft: Deine Kampagnen-Daten werden **niemals** auf einen Server hochgeladen. Sie werden verschlüsselt in der Datenbank deines eigenen Browsers (IndexedDB) gespeichert.

---

*Erstellt mit ❤️ für die Pen-&-Paper Community.*
