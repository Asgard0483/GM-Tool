#!/bin/bash

# Wechsle in das Verzeichnis, in dem dieses Skript liegt
cd "$(dirname "$0")"

echo "======================================"
echo "    Starte Ultimate GM Tool...        "
echo "======================================"

# Versuche Node-Umgebung (NVM) zu laden, falls Node nicht direkt verfügbar ist
if ! command -v npm &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

if ! command -v npm &> /dev/null; then
    echo "Fehler: 'npm' konnte nicht gefunden werden. Bitte stelle sicher, dass Node.js installiert ist."
    read -p "Drücke Enter zum Beenden..."
    exit 1
fi

# Installiere Module, falls sie fehlen
if [ ! -d "node_modules" ]; then
    echo "Installiere fehlende Abhängigkeiten (dies passiert nur beim ersten Mal)..."
    npm install
fi

echo "Entwicklungsserver wird gestartet. Der Browser öffnet sich gleich automatisch!"
echo "Zum Beenden einfach dieses Fenster schließen oder Strg+C drücken."
echo "--------------------------------------"

# Starte den Vite-Server und öffne den Browser direkt (--open)
npm run dev -- --open
