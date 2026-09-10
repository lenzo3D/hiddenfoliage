"""warp2d.py HTRACES.json VTRACKS.json OUT_prefix [--lam 1.0] [--lamx 1.0] [--mu 0.005] [--maxbow 40]
2-D straightening warp: dy mesh (as warp.py, --nowrap) so every merged horizontal line is one cosine, plus a
dx mesh so every vertical track becomes a true vertical (x + dx = X_j).  dx is pinned to 0 at the seam columns
so the 360 wrap is kept.  IRLS (3 rounds) drops vertical tracks that refuse to straighten (not real verticals).
Writes OUT_prefix-dx.npy / -dy.npy (dense H x W float32) and prints residuals."""
import sys, json, math, numpy as np, scipy.sparse as sp, scipy.sparse.linalg as spl
W, H = 1774, 887; R = W/(2*math.pi); v0 = H/2
def arg(n, d): return float(sys.argv[sys.argv.index(n)+1]) if n in sys.argv else d
lam, lamx, mu, maxbow = arg("--lam", 1.0), arg("--lamx", 1.0), arg("--mu", 0.005), arg("--maxbow", 40)
htr = json.load(open(sys.argv[1])); vtr = [t for t in json.load(open(sys.argv[2])) if t["bow"] <= maxbow]; out = sys.argv[3]
nx, ny = 90, 45; NX = nx + 1; nm = NX * ny
def bilin(x, v):
    fx = (x % W) / (W / nx); i0 = np.floor(fx).astype(int); tx = fx - i0; i1 = np.minimum(i0 + 1, NX - 1)
    fy = np.clip(v / (H / (ny - 1)), 0, ny - 1 - 1e-9); j0 = np.floor(fy).astype(int); ty = fy - j0; j1 = j0 + 1
    return np.stack([j0*NX + i0, j0*NX + i1, j1*NX + i0, j1*NX + i1], 1), np.stack([(1-tx)*(1-ty), tx*(1-ty), (1-tx)*ty, tx*ty], 1)
hn = list(htr); nh = len(hn); nv = len(vtr)
# unknown layout: [dy mesh (nm)] [dx mesh (nm)] [A_j,B_j per horizontal (2*nh)] [X_j per vertical (nv)]
OFF_DX, OFF_H, OFF_V = nm, 2*nm, 2*nm + 2*nh; NU = OFF_V + nv
wv = np.ones(nv)   # IRLS weights per vertical track
for it in range(3):
    rows, cols, vals, rhs, r = [], [], [], [], 0
    def add(cs, vs, b):
        global r
        rows.extend([r]*len(cs)); cols.extend(cs); vals.extend(vs); rhs.append(b); r += 1
    for j, n in enumerate(hn):
        P = np.array(htr[n]); x, v = P[:,0], P[:,1]; th = (x/W - 0.5)*2*np.pi; w = 1/math.sqrt(len(P))
        idx, wts = bilin(x, v)
        for k in range(len(P)):
            add(list(idx[k]) + [OFF_H + 2*j, OFF_H + 2*j + 1], list(w*wts[k]) + [w*math.cos(th[k]), w*math.sin(th[k])], w*(v0 - v[k]))
    for j, t in enumerate(vtr):
        P = np.array(t["pts"]); x, v = P[:,0], P[:,1]; w = wv[j]/math.sqrt(len(P))
        idx, wts = bilin(x, v)
        w *= 3.0                  # verticals: few tracks, make them count
        for k in range(len(P)):   # x + dx(x,v) - X_j = 0
            add([OFF_DX + i for i in idx[k]] + [OFF_V + j], list(w*wts[k]) + [-w], -w*x[k])
    for jj in range(ny):
        for ii in range(NX):
            c = jj*NX + ii
            for off, l in ((0, lam), (OFF_DX, lamx)):
                if 0 < ii < NX - 1: add([off + c - 1, off + c, off + c + 1], [l, -2*l, l], 0)
                if 0 < jj < ny - 1: add([off + c - NX, off + c, off + c + NX], [l, -2*l, l], 0)
                add([off + c], [mu], 0)
            if ii in (0, NX - 1): add([OFF_DX + c], [5.0], 0)      # keep the wrap: no sideways shift at the seam
    A = sp.csr_matrix((vals, (rows, cols)), shape=(r, NU)); b = np.array(rhs)
    sol = spl.lsqr(A, b, atol=1e-10, btol=1e-10, iter_lim=30000)[0]
    dyм = sol[:nm].reshape(ny, NX); dxm = sol[OFF_DX:OFF_DX+nm].reshape(ny, NX)
    # residuals per vertical track (px) -> IRLS weights
    res = []
    for j, t in enumerate(vtr):
        P = np.array(t["pts"]); idx, wts = bilin(P[:,0], P[:,1]); xw = P[:,0] + (dxm.ravel()[idx]*wts).sum(1)
        res.append(float(np.sqrt(np.mean((xw - xw.mean())**2))))
    res = np.array(res); wv = np.where(res < 6, 1.0, np.where(res < 25, 0.5, 0.0))
    print(f"round {it}: vertical rms px median {np.median(res):.1f} max {res.max():.1f}; kept {int((wv>0).sum())}/{nv}; dx {dxm.min():+.0f}..{dxm.max():+.0f} dy {dyм.min():+.0f}..{dyм.max():+.0f}")
hres = []
for j, n in enumerate(hn):
    P = np.array(htr[n]); x, v = P[:,0], P[:,1]; th = (x/W-0.5)*2*np.pi; idx, wts = bilin(x, v); vw = v + (dyм.ravel()[idx]*wts).sum(1)
    M = np.stack([np.cos(th), np.sin(th)], 1); c, *_ = np.linalg.lstsq(M, v0 - vw, rcond=None); hres.append(np.sqrt(np.mean(((v0 - vw) - M@c)**2)))
print("horizontal rms px per line:", [f"{n}:{r_:.1f}" for n, r_ in zip(hn, hres)])
xs = np.arange(W); vs = np.arange(H); X, V = np.meshgrid(xs, vs); idx, wts = bilin(X.ravel().astype(float), V.ravel().astype(float))
np.save(out + "-dy.npy", (dyм.ravel()[idx]*wts).sum(1).reshape(H, W).astype(np.float32))
np.save(out + "-dx.npy", (dxm.ravel()[idx]*wts).sum(1).reshape(H, W).astype(np.float32)); print("saved", out)
