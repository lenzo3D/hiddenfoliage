#!/usr/bin/env python
"""cyl2equi.py IN OUT [--width W] [--vaov DEG] [--quality Q]

Re-project a cylindrical panorama (horizontal = longitude, vertical =
R*tan(latitude) with R = width / 2*pi, i.e. matched horizontal and vertical
scale) into a true equirectangular strip covering latitude +-vaov/2, which a
spherical viewer such as Pannellum renders with straight lines straight.

The input's own vertical coverage is atan((H/2) / R); the output vaov must not
exceed twice that or the strip would sample outside the image.
"""
import argparse, math
import cv2, numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--width", type=int, default=0, help="output width (default: input width)")
ap.add_argument("--vaov", type=float, default=0.0, help="output vertical coverage in degrees (default: the input's own)")
ap.add_argument("--quality", type=int, default=90)
a = ap.parse_args()

img = cv2.imread(a.inp, cv2.IMREAD_COLOR)
H, W = img.shape[:2]
R = W / (2 * math.pi)
lat_max = math.atan((H / 2) / R)           # the cylinder's true vertical reach
vaov = a.vaov if a.vaov else 2 * math.degrees(lat_max)
assert vaov <= 2 * math.degrees(lat_max) + 1e-6, f"input only covers {2*math.degrees(lat_max):.1f} degrees"

ow = a.width or W
oh = int(round(ow * (vaov / 360.0)))       # equirect: rows are linear in latitude
lat = (0.5 - (np.arange(oh) + 0.5) / oh) * math.radians(vaov)   # +top .. -bottom
v = (H / 2) - R * np.tan(lat)              # cylindrical row for each output row
u = (np.arange(ow) + 0.5) / ow * W - 0.5   # longitude maps 1:1
map_x = np.tile(u[None, :].astype(np.float32), (oh, 1))
map_y = np.tile(v[:, None].astype(np.float32), (1, ow))
out = cv2.remap(img, map_x, map_y, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_WRAP)
if a.out.lower().endswith((".jpg", ".jpeg")):
    cv2.imwrite(a.out, out, [cv2.IMWRITE_JPEG_QUALITY, a.quality, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
else:
    cv2.imwrite(a.out, out)
print(f"{a.inp} {W}x{H} (cyl, +-{math.degrees(lat_max):.1f} deg) -> {a.out} {ow}x{oh} (equirect, vaov {vaov:.1f})")
