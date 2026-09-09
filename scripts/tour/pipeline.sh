#!/bin/sh
# Tour panoramas: seam-fixed cylindrical drawings -> Pannellum multires tile sets.
#
#   scripts/tour/pipeline.sh SRC_DIR WORK_DIR
#
# SRC_DIR holds one PNG per room (living, living-day, dining, bedroom, bathroom,
# porch) in the site's yaw frame, seam-inpainted; WORK_DIR gets the
# intermediates. Needs the GPU toolchain from docs/HANDOFF.md (Films section):
# a venv with torch (MPS), spandrel, opencv-python, pillow, numpy — set PY to
# its python — and the two model files (Phhofm/models releases on GitHub):
#   4xNomos8kDAT.pth                       first pass, 4x
#   2xBHI_small_realplksr_large_pretrain.pth  second pass, 2x (fidelity model)
# Steps per room:
#   1. sr.py 4x (DAT, wrap-padded so the seam stays continuous)   1774x887 -> 7096x3548
#   2. sr.py 2x (RealPLKSR large, pretrain)                        -> 14192x7096
#   3. cyl2equi.py: cylindrical -> true equirectangular strip, +-57.5 deg  -> 14192x4536
#   4. equi2tiles.py: six 4512 px cube faces, 512 px JPEG q90 tiles, 5 levels
#      -> public/images/360/<room>-v4/  (+ config.json for reference)
set -e
SRC=$1; WORK=$2; HERE=$(cd "$(dirname "$0")" && pwd); SITE=$HERE/../../public/images/360
PY=${PY:-python}; MODELS=${MODELS:-$WORK/models}
mkdir -p "$WORK/x4" "$WORK/x8" "$WORK/equi"
for n in living living-day dining bedroom bathroom porch; do
  echo "== $n $(date +%T)"
  [ -f "$WORK/x4/$n.png" ] || $PY "$HERE/sr.py" "$MODELS/4xNomos8kDAT.pth" "$SRC/$n.png" "$WORK/x4/$n.png" --tile 256 --pad 24 --wrap
  [ -f "$WORK/x8/$n.png" ] || $PY "$HERE/sr.py" "$MODELS/2xBHI_small_realplksr_large_pretrain.pth" "$WORK/x4/$n.png" "$WORK/x8/$n.png" --tile 1024 --pad 32 --wrap
  $PY "$HERE/cyl2equi.py" "$WORK/x8/$n.png" "$WORK/equi/$n.png"
  rm -rf "$SITE/$n-v4"; $PY "$HERE/equi2tiles.py" "$WORK/equi/$n.png" "$SITE/$n-v4" --vaov 115 --tile 512 --quality 90 | tail -1
done
echo "pipeline done $(date +%T)"
