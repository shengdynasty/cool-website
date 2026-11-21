# Grades rendered frames (render.mjs) into sheng-yan.com's palette and halves them (2x supersampled render -> 1200x800).
#   neutral pixels -> their luminance on the black -> cream ramp (#000 -> #F5F2EA): white tops out at cream
#   green pixels (the recoloured accent parts) -> the site's green #2CA942, shaded by their luminance
# Anything with another hue would be pulled onto the cream ramp too, so no other colour can survive.
# usage: python3 -I scripts/modula-cover/grade.py <in dir> <out dir> [width]
import os
import sys
from concurrent.futures import ProcessPoolExecutor

import numpy as np
from PIL import Image

CREAM = np.array([245, 242, 234], np.float32) / 255
GREEN = np.array([44, 169, 66], np.float32) / 255
L_REF = 0.74  # luminance of a fully lit accent in the render; it lands exactly on GREEN


def grade(im: np.ndarray) -> np.ndarray:
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    mx = im.max(-1)
    mn = im.min(-1)
    c = mx - mn
    d = np.maximum(c, 1e-6)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    # green weight: chroma above the neutral noise floor, hue in the green band
    band = np.clip(1 - np.abs(hue - 125) / 45, 0, 1) * 1.6
    w = np.clip((c - 0.05) / 0.12, 0, 1) * np.clip(band, 0, 1)
    neutral = np.clip(lum, 0, 1)[..., None] * CREAM
    k = np.clip(lum / L_REF, 0, 1)[..., None]
    green = GREEN * k
    out = neutral * (1 - w[..., None]) + green * w[..., None]
    return np.clip(out, 0, 1)


def one(args):
    src, dst, width = args
    im = Image.open(src).convert('RGB')
    if im.size[0] != width:
        im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    Image.fromarray((grade(a) * 255 + 0.5).astype(np.uint8)).save(dst, compress_level=1)
    return dst


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
    os.makedirs(dst, exist_ok=True)
    jobs = [(os.path.join(src, n), os.path.join(dst, n), width) for n in sorted(os.listdir(src)) if n.endswith('.png')]
    with ProcessPoolExecutor() as ex:
        for _ in ex.map(one, jobs, chunksize=4):
            pass
    print(f'graded {len(jobs)} frames -> {dst}')
