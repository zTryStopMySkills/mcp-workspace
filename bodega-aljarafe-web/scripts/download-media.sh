#!/bin/bash
# ── Descarga de media Bodega Aljarafe ────────────────────────────
# REQUISITO: Chrome completamente cerrado antes de ejecutar
# Ejecutar desde: bodega-aljarafe-web/
#   bash scripts/download-media.sh

GALLERY="public/gallery"
VIDEOS="public/videos"
COOKIE_BROWSER="chrome"  # cambiar a "edge" si Chrome falla

mkdir -p "$GALLERY" "$VIDEOS"

YT="python -m yt_dlp --cookies-from-browser $COOKIE_BROWSER"

echo "====== DESCARGANDO FOTOS DE POSTS ======"

# Posts de @bodegasaljarafe — fotos de platos y local
declare -A POSTS=(
  ["post-1"]="https://www.instagram.com/p/DOgfIq9CGGE/"
  ["post-2"]="https://www.instagram.com/p/DOd1nEdiDoF/"
  ["post-3"]="https://www.instagram.com/p/DN827Y2iOF0/"
  ["post-4"]="https://www.instagram.com/p/DNOoC4UsHz0/"
  ["post-5"]="https://www.instagram.com/p/DMvz8a7MhhQ/"
  ["post-6"]="https://www.instagram.com/p/DOTogB7iBF8/"
  ["post-7"]="https://www.instagram.com/p/DTlxsmQiNv5/"
  ["post-8"]="https://www.instagram.com/p/DUGsjz0CCAw/"
  ["post-9"]="https://www.instagram.com/p/DUTD4DYiLe9/"
)

for NAME in "${!POSTS[@]}"; do
  URL="${POSTS[$NAME]}"
  echo "→ Descargando $NAME desde $URL"
  $YT \
    --write-thumbnail \
    --skip-download \
    -o "$GALLERY/$NAME.%(ext)s" \
    "$URL" 2>/dev/null || \
  $YT \
    --format "best[ext=jpg]/best" \
    -o "$GALLERY/$NAME.%(ext)s" \
    "$URL" 2>&1 | grep -E "(Downloading|ERROR|Destination)"
done

echo ""
echo "====== DESCARGANDO VÍDEOS ======"

# Reel del dueño (para sección Historia/Nosotros)
echo "→ Vídeo historia (dueño hablando)..."
$YT \
  --format "mp4/best[ext=mp4]/best" \
  -o "$VIDEOS/historia-dueno.%(ext)s" \
  "https://www.instagram.com/reel/DVdrvEejFXm/" 2>&1 | grep -E "(Downloading|ERROR|Destination|Merging)"

# Hero — intentar con el primer reel de comida que tenga vídeo
echo "→ Vídeo hero (brasa)..."
$YT \
  --format "mp4/best[ext=mp4]/best" \
  -o "$VIDEOS/hero-brasa.%(ext)s" \
  "https://www.instagram.com/p/DOgfIq9CGGE/" 2>&1 | grep -E "(Downloading|ERROR|Destination|Merging)"

echo ""
echo "====== LISTO ======"
ls -lh "$GALLERY/" 2>/dev/null
ls -lh "$VIDEOS/" 2>/dev/null
