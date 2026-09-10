"""seamfix.py IN.png OUT.png ROLL [BAND]
Roll the panorama so its wrap seam is central, inpaint a BAND-px vertical strip across it with LaMa,
roll back, then roll by ROLL columns into the site's yaw frame (tile yaw 0 = source column 887-ROLL)."""
import sys, numpy as np, cv2
from PIL import Image
import os as _o, sys as _s; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__))); from lama_cpu import lama
inp, out, roll = sys.argv[1], sys.argv[2], int(sys.argv[3]); band = int(sys.argv[4]) if len(sys.argv) > 4 else 32
img = cv2.imread(inp); H, W = img.shape[:2]
r = np.roll(img, W//2, axis=1)                       # seam to the centre
mask = np.zeros((H, W), np.uint8); mask[:, W//2 - band//2 : W//2 + band//2] = 255
res = lama(r, mask)
fixed = np.roll(res, -(W//2), axis=1)                # back to the source frame
cv2.imwrite(out, np.roll(fixed, roll, axis=1))       # into the site frame
print(out, "band", band, "roll", roll)
