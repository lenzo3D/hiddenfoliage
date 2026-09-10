"""trace_water.py SRC.png TRACES_IN.json TRACES_OUT.json x0 x1 y0 y1 suffix
Replace water_near_<suffix>, far_edge_<suffix>, rail_<suffix> with colour-based traces: per column in [x0,x1),
the longest blue run within rows [y0,y1) gives the water's top (far edge) and bottom (near edge); the first
dark run below the near edge gives the rail's top edge."""
import sys, json, cv2, numpy as np
src = cv2.imread(sys.argv[1]); tr = json.load(open(sys.argv[2])); x0, x1, y0, y1 = map(int, sys.argv[4:8]); sfx = sys.argv[8]
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV); H, S, V = hsv[...,0], hsv[...,1], hsv[...,2]
water = (H > 85) & (H < 130) & (S > 50) & (V > 35)
water = cv2.morphologyEx(water.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 3), np.uint8)) > 0
dark = V < 70
near, far, rail = [], [], []
for x in range(x0, x1, 2):
    col = water[y0:y1, x]
    if col.sum() < 15: continue
    # longest run of water
    runs, start = [], None
    for i, v in enumerate(np.append(col, False)):
        if v and start is None: start = i
        if not v and start is not None: runs.append((i - start, start, i)); start = None
    ln, s, e = max(runs)
    if ln < 15: continue
    far.append([x, float(y0 + s)]); near.append([x, float(y0 + e)])
    d = dark[y0 + e: y0 + e + 80, x]
    if d.any():
        k = int(np.argmax(d))
        if 3 <= k <= 70: rail.append([x, float(y0 + e + k)])
def smooth(pts):
    if len(pts) < 8: return pts
    P = np.array(pts); y = cv2.GaussianBlur(P[:,1].astype(np.float32).reshape(-1,1), (0,0), 2.5).ravel()
    keep = np.abs(P[:,1] - y) <= 3.0
    return [[int(a), float(b)] for a, b in P[keep]]
for name, pts in (("water_near_"+sfx, near), ("far_edge_"+sfx, far), ("rail_"+sfx, rail)):
    tr[name] = smooth(pts); print(f"{name:14s} {len(tr[name]):3d} pts")
json.dump(tr, open(sys.argv[3], "w"))
