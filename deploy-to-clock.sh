#!/bin/bash
set -e

ADB="/Users/arda/Library/Android/sdk/platform-tools/adb"
TARGET_HTML_DIR="/data/data/com.yij.outdoor/files/html"
PREFS_FILE="/data/data/com.yij.outdoor/shared_prefs/html_status.xml"

echo "=== [1/5] Preparing target directories & locking update version on Adhaan Clock ==="
"$ADB" shell "mkdir -p $TARGET_HTML_DIR/audio $TARGET_HTML_DIR/fonts $TARGET_HTML_DIR/img && setprop persist.sys.timezone Europe/Amsterdam"
"$ADB" shell "printf '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?>\n<map>\n    <int name=\"CURRENT_VERSION\" value=\"2147483647\" />\n    <boolean name=\"IS_FIRST\" value=\"false\" />\n</map>\n' > $PREFS_FILE"

echo "=== [2/5] Pushing updated UI files (index.html, styles.css, diyanet-lahey.js, app.js, manifest.json) ==="
"$ADB" push /Users/arda/Desktop/project/index.html "$TARGET_HTML_DIR/index.html"
"$ADB" push /Users/arda/Desktop/project/styles.css "$TARGET_HTML_DIR/styles.css"
"$ADB" push /Users/arda/Desktop/project/diyanet-lahey.js "$TARGET_HTML_DIR/diyanet-lahey.js"
"$ADB" push /Users/arda/Desktop/project/app.js "$TARGET_HTML_DIR/app.js"
"$ADB" push /Users/arda/Desktop/project/manifest.json "$TARGET_HTML_DIR/manifest.json"

echo "=== [3/5] Pushing local fonts (Cormorant Garamond, Plus Jakarta Sans, Amiri) & pre-blurred backdrops ==="
for f in /Users/arda/Desktop/project/fonts/*.ttf /Users/arda/Desktop/project/fonts/*.woff; do
  fname=$(basename "$f")
  if ! "$ADB" shell "[ -s $TARGET_HTML_DIR/fonts/$fname ]"; then
    "$ADB" push "$f" "$TARGET_HTML_DIR/fonts/$fname"
  fi
done

for img in /Users/arda/Desktop/project/img/*-blur.jpg; do
  iname=$(basename "$img")
  "$ADB" push "$img" "$TARGET_HTML_DIR/img/$iname"
done

echo "=== [4/5] Checking 5 Turkish Makam YouTube MP3s & Adhan audio files ==="
for mp3 in /Users/arda/Desktop/project/audio/*.mp3; do
  fname=$(basename "$mp3")
  if ! "$ADB" shell "[ -s $TARGET_HTML_DIR/audio/$fname ]"; then
    echo "Pushing $fname..."
    "$ADB" push "$mp3" "$TARGET_HTML_DIR/audio/$fname"
  fi
done

echo "=== [5/5] Setting permissions, restarting Adhaan Clock Launcher & capturing live screenshot ==="
"$ADB" logcat -c || true
"$ADB" shell "chown -R u0_a6:u0_a6 /data/data/com.yij.outdoor/files /data/data/com.yij.outdoor/shared_prefs && chmod -R 755 $TARGET_HTML_DIR"
"$ADB" shell "am force-stop com.yij.outdoor && am start -n com.yij.outdoor/.MainActivity"
sleep 4
"$ADB" logcat -d | grep -iE "chromium|WebView|CONSOLE" | tail -n 25 || true
"$ADB" shell "screencap -p /sdcard/clock_home.png"
"$ADB" pull /sdcard/clock_home.png /tmp/clock_home.png

echo "=== Deployment Complete! ==="
