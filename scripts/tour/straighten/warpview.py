"""warpview.py SRC.png DY.npy OUT.jpg WARPED_OUT.png : warp the (site-frame) drawing and show seam views before/after"""
import sys, numpy as np, cv2, math
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from recut import view_dirs
src = cv2.imread(sys.argv[1]); dy = np.load(sys.argv[2]); H, W = src.shape[:2]; R = W/(2*math.pi)
def warp_image(img, dy):
    vs = np.arange(H, dtype=np.float32); mapy = np.zeros((H, W), np.float32)
    for x in range(W):
        vp = vs + dy[:, x]; mapy[:, x] = np.interp(vs, vp, vs, left=0, right=H-1)
    mapx = np.tile(np.arange(W, dtype=np.float32)[None, :], (H, 1))
    return cv2.remap(img, mapx, mapy, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_WRAP)
def render_equi(img, yaw, pitch, hfov, w, h):
    d = view_dirs(yaw, pitch, hfov, w, h); x, y, z = d[...,0], d[...,1], d[...,2]
    th = np.arctan2(x, -z); phi = np.arctan2(y, np.hypot(x, z))
    mx = ((th/(2*np.pi) + 0.5)*W - 0.5).astype(np.float32); my = (H/2 - R*np.tan(phi) - 0.5).astype(np.float32)
    return cv2.remap(img, mx, my, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_WRAP)
def lab(im, t): cv2.putText(im, t, (8, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2, cv2.LINE_AA); return im
w = warp_image(src, dy); cv2.imwrite(sys.argv[4], w)
heat = cv2.resize(cv2.applyColorMap(np.clip((dy + 90) / 180 * 255, 0, 255).astype(np.uint8), cv2.COLORMAP_JET), (756, 378)); lab(heat, "dy (blue -90 .. red +90)")
wr, sr = np.roll(w, W//2, axis=1), np.roll(src, W//2, axis=1)
row1 = np.hstack([heat] + [cv2.resize(lab(render_equi(wr, y, -8, 68, 1008, 655), f"warped seam{y:+d}"), (756, 378)) for y in (0, 40, -40)])
row2 = np.hstack([np.zeros((378, 756, 3), np.uint8)] + [cv2.resize(lab(render_equi(sr, y, -8, 68, 1008, 655), f"raw seam{y:+d}"), (756, 378)) for y in (0, 40, -40)])
cv2.imwrite(sys.argv[3], np.vstack([row1, row2]), [cv2.IMWRITE_JPEG_QUALITY, 86]); print(sys.argv[3])
