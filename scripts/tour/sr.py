#!/usr/bin/env python
"""sr.py MODEL.pth IN OUT [--tile T] [--pad P] [--wrap]
Run one image (or a directory) through a spandrel-loadable SR model on the
Metal GPU, tiled with overlap. --wrap pads the left/right edges with the
opposite side so a 360 panorama's seam is upscaled continuously.
Saves PNG. Prints scale and timing."""
import argparse, os, time
import numpy as np, torch
from PIL import Image
from spandrel import ModelLoader
Image.MAX_IMAGE_PIXELS = None
ap = argparse.ArgumentParser()
ap.add_argument("model"); ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--tile", type=int, default=512); ap.add_argument("--pad", type=int, default=32)
ap.add_argument("--wrap", action="store_true"); ap.add_argument("--fp16", action="store_true")
a = ap.parse_args()
dev = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = ModelLoader().load_from_file(a.model).eval().to(dev)
if a.fp16: model = model.half()
scale = model.scale

def run(x):
    with torch.no_grad():
        y = model(x.half() if a.fp16 else x)
    return y.float()

def upscale(img):  # img: HxWx3 float32 0..1 -> HxWx3 uint8 (accumulated on the CPU, so the GPU only ever holds one tile)
    H, W = img.shape[:2]; t, p = a.tile, a.pad
    if a.wrap:  # pad horizontally with the opposite edge, so the seam stays continuous
        img = np.concatenate([img[:, -p:], img, img[:, :p]], 1)
    Hp, Wp = img.shape[:2]
    out = np.zeros((Hp * scale, Wp * scale, 3), np.uint8)
    for y0 in range(0, Hp, t):
        for x0 in range(0, Wp, t):
            y1, x1 = min(y0 + t, Hp), min(x0 + t, Wp)
            py0, px0 = max(y0 - p, 0), max(x0 - p, 0); py1, px1 = min(y1 + p, Hp), min(x1 + p, Wp)
            x = torch.from_numpy(np.ascontiguousarray(img[py0:py1, px0:px1])).permute(2, 0, 1)[None].to(dev)
            o = run(x).clamp(0, 1)
            oy, ox = (y0 - py0) * scale, (x0 - px0) * scale
            o = o[0, :, oy:oy + (y1 - y0) * scale, ox:ox + (x1 - x0) * scale].permute(1, 2, 0)
            out[y0 * scale:y1 * scale, x0 * scale:x1 * scale] = (o * 255.0 + 0.5).to(torch.uint8).cpu().numpy()
            del x, o
        if dev.type == "mps":
            torch.mps.empty_cache()
    if a.wrap:
        out = out[:, p * scale:(p + W) * scale]
    return out

files = [a.inp] if os.path.isfile(a.inp) else sorted(os.path.join(a.inp, f) for f in os.listdir(a.inp) if f.lower().endswith((".png", ".jpg")))
if not os.path.isfile(a.inp): os.makedirs(a.out, exist_ok=True)
for f in files:
    t0 = time.time()
    img = np.asarray(Image.open(f).convert("RGB")).astype(np.float32) / 255.0
    y = upscale(img)
    o = a.out if os.path.isfile(a.inp) else os.path.join(a.out, os.path.splitext(os.path.basename(f))[0] + ".png")
    Image.fromarray(y).save(o, compress_level=1)
    print(f"{os.path.basename(f)} x{scale} {img.shape[1]}x{img.shape[0]} -> {y.shape[1]}x{y.shape[0]} in {time.time()-t0:.1f}s", flush=True)
