"""apply2d.py SRC.png PREFIX OUT.png : apply the 2-D warp (x' = x + dx, v' = v + dy) by fixed-point inverse mapping."""
import sys, cv2, numpy as np
src = cv2.imread(sys.argv[1]); dx = np.load(sys.argv[2] + "-dx.npy"); dy = np.load(sys.argv[2] + "-dy.npy"); H, W = src.shape[:2]
X, V = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
sx, sv = X.copy(), V.copy()
for _ in range(4):   # source = target - d(source)
    mx = sx % W; my = np.clip(sv, 0, H - 1)
    sx = X - cv2.remap(dx, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP); sv = V - cv2.remap(dy, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
out = cv2.remap(src, (sx % W).astype(np.float32), np.clip(sv, 0, H - 1).astype(np.float32), cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_WRAP)
cv2.imwrite(sys.argv[3], out); print("warped", sys.argv[3])
