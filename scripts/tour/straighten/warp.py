"""warp.py TRACES.json OUT_dy.npy [--lam 2.0] [--mu 0.02] [--nx 90] [--ny 45]
Solve a smooth vertical warp dy(x,v) over a wrapping mesh so that every traced line, after
v' = v + dy, is a horizontal 3D line in a cylindrical panorama with the horizon at H/2:
v' = H/2 - (A_j cos th + B_j sin th).  Linear least squares: unknowns = mesh dy + (A_j,B_j).
Saves the dense dy field (H x W float32) and prints per-line residuals before/after."""
import sys, json, math, numpy as np, scipy.sparse as sp, scipy.sparse.linalg as spl
W, H = 1774, 887; R = W/(2*math.pi); v0 = H/2
tr = json.load(open(sys.argv[1])); out = sys.argv[2]
def arg(n, d): return float(sys.argv[sys.argv.index(n)+1]) if n in sys.argv else d
lam, mu, nx, ny = arg("--lam", 2.0), arg("--mu", 0.02), int(arg("--nx", 90)), int(arg("--ny", 45))
WRAP = "--nowrap" not in sys.argv
NX = nx if WRAP else nx + 1   # without wrap the mesh has its own column at x = W
gx = np.linspace(0, W, nx, endpoint=False); gy = np.linspace(0, H, ny)      # mesh nodes (x wraps)
def bilin(x, v):
    """sparse rows: bilinear weights of point (x,v) on the mesh (x wraps)."""
    fx = (x % W) / (W / nx); i0 = np.floor(fx).astype(int); tx = fx - i0; i1 = (i0 + 1) % nx if WRAP else np.minimum(i0 + 1, NX - 1)
    fy = np.clip(v / (H / (ny - 1)), 0, ny - 1 - 1e-9); j0 = np.floor(fy).astype(int); ty = fy - j0; j1 = j0 + 1
    idx = np.stack([j0*NX + i0, j0*NX + i1, j1*NX + i0, j1*NX + i1], 1)
    wts = np.stack([(1-tx)*(1-ty), tx*(1-ty), (1-tx)*ty, tx*ty], 1)
    return idx, wts
names = list(tr); nl = len(names); nm = NX*ny
rows, cols, vals, rhs, wrow = [], [], [], [], 0
for j, n in enumerate(names):
    P = np.array(tr[n]); x, v = P[:,0], P[:,1]; th = (x / W - 0.5) * 2*np.pi
    w = 1.0 / math.sqrt(len(P))
    idx, wts = bilin(x, v)
    for k in range(len(P)):
        for c, val in zip(idx[k], wts[k]): rows.append(wrow); cols.append(c); vals.append(w*val)
        rows += [wrow, wrow]; cols += [nm + 2*j, nm + 2*j + 1]; vals += [w*math.cos(th[k]), w*math.sin(th[k])]
        rhs.append(w * (v0 - v[k])); wrow += 1
# smoothness: second differences along x (wrapping) and along y, and a small identity prior
for jj in range(ny):
    for ii in range(NX):
        c = jj*NX + ii
        if WRAP or 0 < ii < NX - 1:
            l, r = (jj*NX + (ii-1) % NX, jj*NX + (ii+1) % NX) if WRAP else (c - 1, c + 1)
            rows += [wrow]*3; cols += [l, c, r]; vals += [lam, -2*lam, lam]; rhs.append(0); wrow += 1
        if 0 < jj < ny - 1:
            rows += [wrow]*3; cols += [(jj-1)*NX + ii, c, (jj+1)*NX + ii]; vals += [lam, -2*lam, lam]; rhs.append(0); wrow += 1
        rows.append(wrow); cols.append(c); vals.append(mu); rhs.append(0); wrow += 1
A = sp.csr_matrix((vals, (rows, cols)), shape=(wrow, nm + 2*nl)); b = np.array(rhs)
sol = spl.lsqr(A, b, atol=1e-10, btol=1e-10, iter_lim=20000)[0]
dy_mesh = sol[:nm].reshape(ny, NX)
print(f"mesh {NX}x{ny} wrap={WRAP}  lam {lam} mu {mu}   dy range {dy_mesh.min():+.1f}..{dy_mesh.max():+.1f} px")
# residuals per line (pixels), before (dy=0, best cosine) and after
def line_res(P, dyv):
    x, v = P[:,0], P[:,1]; th = (x/W - 0.5)*2*np.pi; vv = v + dyv
    M = np.stack([np.cos(th), np.sin(th)], 1); c, *_ = np.linalg.lstsq(M, v0 - vv, rcond=None)
    return (v0 - vv) - M @ c
tot_b, tot_a = [], []
for n in names:
    P = np.array(tr[n]); idx, wts = bilin(P[:,0], P[:,1]); dyv = (dy_mesh.ravel()[idx] * wts).sum(1)
    rb, ra = line_res(P, 0*dyv), line_res(P, dyv); tot_b.append(rb); tot_a.append(ra)
    print(f"  {n:14s} n={len(P):3d}  before rms {np.sqrt(np.mean(rb**2)):5.2f} max {np.abs(rb).max():5.1f}  |  after rms {np.sqrt(np.mean(ra**2)):5.2f} max {np.abs(ra).max():5.1f}   dy {dyv.min():+.0f}..{dyv.max():+.0f}")
print(f"ALL before rms {np.sqrt(np.mean(np.concatenate(tot_b)**2)):.2f}  after rms {np.sqrt(np.mean(np.concatenate(tot_a)**2)):.2f}")
# dense field
import cv2
xs = np.arange(W); vs = np.arange(H); X, V = np.meshgrid(xs, vs)
idx, wts = bilin(X.ravel().astype(float), V.ravel().astype(float))
dense = (dy_mesh.ravel()[idx] * wts).sum(1).reshape(H, W).astype(np.float32)
np.save(out, dense); print("saved", out, dense.shape)
