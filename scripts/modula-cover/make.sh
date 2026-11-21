#!/bin/bash
# Rebuilds Project Modula's cover loop and poster from Modula's own V8 (the checkout is only read):
#   render.mjs  frames, 2400×1600, no interface    →  grade.py  1200×800 in black, cream and green
#   encode.sh   public/videos/modula-loop.mp4 + .webm   →   poster  public/images/projects/modula.webp (frame 0)
# Needs a Project Modula checkout with node_modules (MODULA_DIR, default ../project-modula), ffmpeg with libx264 and
# libvpx, and Python 3 with numpy and Pillow. WORK keeps the frames (default: a new temp folder).
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
root=$(cd "$here/../.." && pwd)
work=${WORK:-$(mktemp -d -t modula-cover)}

node "$here/render.mjs" "$work/frames" --wrap
python3 -I "$here/grade.py" "$work/frames" "$work/graded"
# the frame after the last must match the first, or the loop jumps
python3 -I -c '
import sys
import numpy as np
from PIL import Image
a, b = (np.asarray(Image.open(p).convert("L")).astype(int) for p in sys.argv[1:])
d = np.abs(a - b)
print(f"loop seam: max {d.max()}, mean {d.mean():.3f} (levels of 255)")
sys.exit(1 if d.mean() > 0.5 else 0)
' "$work/graded/f00000.png" "$work/graded/wrap.png"
"$here/encode.sh" "$work/graded" "$root/public/videos/modula-loop"
(cd "$root" && node -e "require('sharp')(process.argv[1]).webp({ quality: 86, effort: 6 }).toFile('public/images/projects/modula.webp').then((i) => console.log('poster', i.size, 'bytes'))" "$work/graded/f00000.png")
echo "frames in $work"
