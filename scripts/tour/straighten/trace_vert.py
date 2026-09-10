"""trace_vert.py SRC.png OUT.json OUT.jpg [min_height]
Find vertical edges automatically: seed from LSD near-vertical segments, grow each one row by row along the
strongest horizontal gradient (+-3 px per row), keep tracks taller than min_height. A bowed 'vertical' comes
out as one curved track; the warp then straightens it."""
import sys, json, cv2, numpy as np
src = cv2.imread(sys.argv[1]); minh = int(sys.argv[4]) if len(sys.argv) > 4 else 110
g = cv2.GaussianBlur(cv2.cvtColor(src, cv2.COLOR_BGR2GRAY).astype(np.float32), (0,0), 1.0)
gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3); H, W = g.shape
lsd = cv2.createLineSegmentDetector(cv2.LSD_REFINE_STD)
L = lsd.detect(cv2.cvtColor(src, cv2.COLOR_BGR2GRAY))[0].reshape(-1, 4)
dx, dy = L[:,2]-L[:,0], L[:,3]-L[:,1]; ln = np.hypot(dx, dy); ang = np.degrees(np.arctan2(np.abs(dx), np.abs(dy)))
seeds = L[(ln >= 30) & (ang < 10)]
tracks = []; occupied = np.zeros((H, W), bool)
def grow(x0, y0, sgn):
    pts = {}
    for direction in (1, -1):
        x = x0; y = y0; weak = 0
        while 0 <= y < H:
            lo, hi = max(0, int(round(x)) - 3), min(W, int(round(x)) + 4)
            seg = gx[y, lo:hi] * sgn; i = int(np.argmax(seg))
            if seg[i] < 10: 
                weak += 1
                if weak > 3: break
            else:
                weak = 0; x = lo + i
                if 0 < i < len(seg) - 1:
                    a, b, c = seg[i-1], seg[i], seg[i+1]; den = a - 2*b + c
                    x = x + (0.5*(a - c)/den if den != 0 else 0)
                pts[y] = float(x)
            y += direction
    ys = sorted(pts); return [[pts[y], y] for y in ys]
for x0, y0, x1, y1 in seeds:
    xm, ym = int(round((x0 + x1)/2)), int(round((y0 + y1)/2))
    if occupied[ym, max(0, xm-2):xm+3].any(): continue
    sgn = 1 if gx[ym, xm] >= 0 else -1
    t = grow(xm, ym, sgn)
    if len(t) < minh: continue
    P = np.array(t); bow = float(P[:,0].max() - P[:,0].min())
    if bow > 60: continue                        # not a vertical at all (sofa arm, plant)
    for x, y in t: occupied[int(y), max(0, int(round(x))-2):int(round(x))+3] = True
    tracks.append({"pts": [[float(x), int(y)] for x, y in t], "bow": bow})
tracks.sort(key=lambda t: -len(t["pts"]))
json.dump(tracks, open(sys.argv[2], "w"))
vis = src.copy()
for t in tracks:
    col = (0, 255, 0) if t["bow"] < 6 else ((0, 165, 255) if t["bow"] < 15 else (0, 0, 255))
    for x, y in t["pts"][::2]: cv2.circle(vis, (int(round(x)), int(y)), 1, col, -1)
cv2.imwrite(sys.argv[3], vis, [cv2.IMWRITE_JPEG_QUALITY, 88])
bows = [t["bow"] for t in tracks]
print(f"{len(tracks)} vertical tracks >= {minh}px; bow px: median {np.median(bows):.1f}, max {max(bows):.1f}; tracks with bow>6px: {sum(b>6 for b in bows)}")
