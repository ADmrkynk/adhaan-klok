#!/bin/bash
set -e

FFMPEG="/opt/homebrew/bin/ffmpeg"
OUT_DIR="/Users/arda/Desktop/project/audio"
mkdir -p "$OUT_DIR"

# Download latest standalone yt-dlp_macos to /tmp/yt-dlp so YouTube signatures are up-to-date
if [ ! -x "/tmp/yt-dlp" ]; then
  echo "Fetching latest yt-dlp binary to /tmp/yt-dlp..."
  curl -sL "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos" -o /tmp/yt-dlp
  chmod +x /tmp/yt-dlp
fi

YTDLP="/tmp/yt-dlp"
echo "Using yt-dlp version: $("$YTDLP" --version)"

IDS=("JMjQ9n2NuzU" "mHEubpJMHBc" "7XN62fyoF6s" "G9k_wBGVhwg" "3VLcIowpiJs")

for id in "${IDS[@]}"; do
  if [ -s "$OUT_DIR/${id}.mp3" ]; then
    echo "Already exists: $OUT_DIR/${id}.mp3"
    continue
  fi
  echo "Downloading $id ..."
  "$YTDLP" --ffmpeg-location "$FFMPEG" \
    -x --audio-format mp3 --audio-quality 128K \
    -o "$OUT_DIR/${id}.%(ext)s" \
    "https://www.youtube.com/watch?v=${id}" || \
  "$YTDLP" --ffmpeg-location "$FFMPEG" \
    --cookies-from-browser chrome \
    -x --audio-format mp3 --audio-quality 128K \
    -o "$OUT_DIR/${id}.%(ext)s" \
    "https://www.youtube.com/watch?v=${id}"
done

ls -lh "$OUT_DIR"
