#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Syncing Bilaal Clock web assets to Android app..."
mkdir -p android-app/app/src/main/assets/audio
cp index.html styles.css app.js manifest.json android-app/app/src/main/assets/
cp audio/*.mp3 android-app/app/src/main/assets/audio/ 2>/dev/null || true
echo "Done! Assets synced successfully."
