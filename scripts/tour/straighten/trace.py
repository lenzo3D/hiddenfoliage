"""trace.py SRC.png LINES.json OUT.json OUT.jpg
Follow each line's strongest vertical-gradient edge within +-tol px of a hand-set waypoint path.
LINES.json: {name: {"pts": [[x,y],...], "tol": 5, "sign": 0|1|-1}}   (sign: +1 dark above/bright below)"""
import sys, json, cv2, numpy as np
src = cv2.imread(sys.argv[1]); lines = json.load(open(sys.argv[2]))
g = cv2.GaussianBlur(cv2.cvtColor(src, cv2.COLOR_BGR2GRAY).astype(np.float32), (0,0), 0.9)
gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3); H, W = g.shape
out = {}; vis = src.copy()
for name, spec in lines.items():
    P = np.array(spec["pts"], float); tol = spec.get("tol", 5); sgn = spec.get("sign", 0)
    xs = np.arange(int(P[0,0]), int(P[-1,0]) + 1, 2); path = np.interp(xs, P[:,0], P[:,1])
    rows = []
    for x, yw in zip(xs, path):
        lo, hi = int(max(0, yw - tol)), int(min(H - 1, yw + tol)) + 1
        col = gy[lo:hi, x % W]; val = col if sgn > 0 else (-col if sgn < 0 else np.abs(col))
        i = int(np.argmax(val))
        if 0 < i < len(val) - 1:
            a, b, c = val[i-1], val[i], val[i+1]; den = a - 2*b + c
            i = i + (0.5*(a - c)/den if den != 0 else 0)
        rows.append(lo + i)
    rows = np.array(rows)
    sm = cv2.GaussianBlur(rows.reshape(-1,1).astype(np.float32), (0,0), 3).ravel() if len(rows) > 6 else rows
    keep = np.abs(rows - sm) <= 2.0
    out[name] = [[int(x), float(y)] for x, y in zip(xs[keep], rows[keep])]
    for x, y in out[name]: cv2.circle(vis, (x % W, int(round(y))), 2, (0,255,0), -1)
    cv2.putText(vis, name, (int(P[0,0]) % W, int(P[0,1]) - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0,255,255), 1, cv2.LINE_AA)
    print(f"{name:14s} {keep.sum():3d}/{len(xs)} pts")
json.dump(out, open(sys.argv[3], "w")); cv2.imwrite(sys.argv[4], vis, [cv2.IMWRITE_JPEG_QUALITY, 90])
