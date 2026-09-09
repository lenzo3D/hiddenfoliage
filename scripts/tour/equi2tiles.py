#!/usr/bin/env python
"""equi2tiles.py IN OUT_DIR [--vaov DEG] [--tile 512] [--quality 90] [--cube N] [--bg 7,11,8]

Turn an equirectangular panorama (full 360 wide; vertically either full 180 or a
centred strip of --vaov degrees) into a Pannellum multires tile set: six cube
faces in Pannellum's orientation (f b u d l r), a pyramid of levels halving down
to one tile, JPEG tiles. Prints the JSON the viewer needs. Pure OpenCV, no nona.
Face orientation follows libpannellum.js createCube(): side faces upright with
+y up, the up face's bottom edge and the down face's top edge touch the front
face, image left = world -x on both. Yaw 0 = image centre, +90 = right of it.
"""
import argparse, json, math, os
import cv2, numpy as np
ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--vaov", type=float, default=180.0)
ap.add_argument("--tile", type=int, default=512)
ap.add_argument("--quality", type=int, default=90)
ap.add_argument("--cube", type=int, default=0)
ap.add_argument("--bg", default="7,11,8")
ap.add_argument("--chroma444", action="store_true")
a = ap.parse_args()
img = cv2.imread(a.inp, cv2.IMREAD_COLOR); H, W = img.shape[:2]
bg = np.array([int(v) for v in a.bg.split(",")][::-1], np.uint8)  # BGR
cube = a.cube or 8 * int(W / math.pi / 8)
tile = min(a.tile, cube)
levels = int(math.ceil(math.log(cube / tile, 2))) + 1
FACES = {  # forward, right, up  (camera basis per face; see docstring)
    "f": ((0, 0, -1), (1, 0, 0), (0, 1, 0)),
    "b": ((0, 0, 1), (-1, 0, 0), (0, 1, 0)),
    "l": ((-1, 0, 0), (0, 0, -1), (0, 1, 0)),
    "r": ((1, 0, 0), (0, 0, 1), (0, 1, 0)),
    "u": ((0, 1, 0), (1, 0, 0), (0, 0, 1)),
    "d": ((0, -1, 0), (1, 0, 0), (0, 0, -1)),
}
enc = [cv2.IMWRITE_JPEG_QUALITY, a.quality]
if a.chroma444 and hasattr(cv2, "IMWRITE_JPEG_SAMPLING_FACTOR"):
    enc += [cv2.IMWRITE_JPEG_SAMPLING_FACTOR, cv2.IMWRITE_JPEG_SAMPLING_FACTOR_444]
os.makedirs(a.out, exist_ok=True)
n_tiles = 0; total = 0
# pixel-centre grid in [-1, 1]
g = (np.arange(cube, dtype=np.float64) + 0.5) / cube * 2 - 1
u, v = np.meshgrid(g, g)  # u: left->right, v: top->bottom
for name, (F, Rt, U) in FACES.items():
    F, Rt, U = map(np.array, (F, Rt, U))
    d = F[None, None, :] + u[..., None] * Rt[None, None, :] - v[..., None] * U[None, None, :]
    x, y, z = d[..., 0], d[..., 1], d[..., 2]
    yaw = np.degrees(np.arctan2(x, -z))          # -z -> 0, +x -> +90
    pitch = np.degrees(np.arcsin(y / np.linalg.norm(d, axis=-1)))
    map_x = ((yaw / 360.0 + 0.5) * W - 0.5).astype(np.float32)
    map_y = ((0.5 - pitch / a.vaov) * H - 0.5).astype(np.float32)
    face = cv2.remap(img, map_x, map_y, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_WRAP)
    outside = np.abs(pitch) > a.vaov / 2
    if outside.any():
        face[outside] = bg
    size = cube
    for level in range(levels, 0, -1):
        if level < levels:
            face = cv2.resize(face, (size, size), interpolation=cv2.INTER_AREA)
        ld = os.path.join(a.out, str(level)); os.makedirs(ld, exist_ok=True)
        nt = int(math.ceil(size / tile))
        for i in range(nt):
            for j in range(nt):
                t = face[i * tile:min((i + 1) * tile, size), j * tile:min((j + 1) * tile, size)]
                p = os.path.join(ld, f"{name}{i}_{j}.jpg")
                cv2.imwrite(p, t, enc); n_tiles += 1; total += os.path.getsize(p)
        size = int(math.ceil(size / 2))
    print(f"face {name} done", flush=True)
cfg = {"type": "multires", "multiRes": {"basePath": "<BASE>", "path": "/%l/%s%y_%x", "extension": "jpg",
       "tileResolution": tile, "maxLevel": levels, "cubeResolution": cube}}
json.dump(cfg, open(os.path.join(a.out, "config.json"), "w"), indent=1)
print(f"{a.inp} {W}x{H} vaov {a.vaov} -> cube {cube}, {levels} levels, {n_tiles} tiles, {total/1e6:.1f} MB")
