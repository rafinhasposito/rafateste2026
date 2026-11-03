#!/bin/bash
set -euo pipefail
export LC_ALL=C          # <-- corrige o bug do vírgula/decimal

ROOT="/Users/rafaelsposito/Desktop/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/public/assets"
BACKUP="$HOME/Desktop/videos_backup_$(date +%Y%m%d_%H%M%S)"
TARGET_MB=4.5
AUDIO_KBPS=64
MIN_VIDEO_KBPS=120
MAX_W=1280

command -v ffmpeg  >/dev/null || { echo "ERRO: ffmpeg não encontrado no PATH"; exit 1; }
command -v ffprobe >/dev/null || { echo "ERRO: ffprobe não encontrado no PATH"; exit 1; }

mkdir -p "$BACKUP"
echo "→ Backup em: $BACKUP"; echo

find "$ROOT" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.m4v" \) -print0 |
while IFS= read -r -d '' IN; do
  SIZE_MB=$(awk -v b="$(stat -f%z "$IN")" 'BEGIN{printf "%.2f", b/1048576}')

  if awk -v s="$SIZE_MB" -v t="$TARGET_MB" 'BEGIN{exit (s<=t)?0:1}'; then
    echo "SKIP  ${SIZE_MB}MB  ${IN#$ROOT/}"
    continue
  fi

  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN" 2>/dev/null || true)
  if [ -z "${DUR:-}" ] || [ "$DUR" = "N/A" ]; then
    echo "SKIP (sem duração)  ${IN#$ROOT/}"
    continue
  fi

  VBPS=$(awk -v d="$DUR" -v t="$TARGET_MB" -v a="$AUDIO_KBPS" -v mn="$MIN_VIDEO_KBPS" \
    'BEGIN{b=t*8*1024/d - a; if(b<mn) b=mn; printf "%d", b}')

  REL="${IN#$ROOT/}"
  mkdir -p "$BACKUP/$(dirname "$REL")"
  cp "$IN" "$BACKUP/$REL"

  TMP="${IN%.*}.tmp.mp4"
  echo "▶ ${REL}  (${SIZE_MB}MB → alvo ${TARGET_MB}MB, dur=${DUR}s, vb=${VBPS}k)"

  ffmpeg -nostdin -y -loglevel error -i "$IN" -vf "scale='min(${MAX_W},iw)':-2" \
    -c:v libx264 -b:v ${VBPS}k -preset slow -pass 1 -an -f mp4 /dev/null
  ffmpeg -nostdin -y -loglevel error -i "$IN" -vf "scale='min(${MAX_W},iw)':-2" \
    -c:v libx264 -b:v ${VBPS}k -preset slow -pass 2 \
    -c:a aac -b:a ${AUDIO_KBPS}k -movflags +faststart "$TMP"

  NEW_MB=$(awk -v b="$(stat -f%z "$TMP")" 'BEGIN{printf "%.2f", b/1048576}')
  if awk -v s="$NEW_MB" -v t="$TARGET_MB" 'BEGIN{exit (s<=t)?0:1}'; then
    mv "$TMP" "$IN"; echo "  ✓ ${NEW_MB}MB"
  else
    echo "  ✗ ${NEW_MB}MB (não coube, mantendo original)"; rm -f "$TMP"
  fi
  echo
done

echo "✔ Fim. Backup: $BACKUP"
