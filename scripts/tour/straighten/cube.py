"""Cube-face helpers shared by the calibration and the re-cut.
Faces follow libpannellum createCube(): f b u d l r; yaw 0 = -z, +x = yaw +90, +y up."""
import cv2, numpy as np, os, math
FACES = {"f": ((0,0,-1),(1,0,0),(0,1,0)), "b": ((0,0,1),(-1,0,0),(0,1,0)), "l": ((-1,0,0),(0,0,-1),(0,1,0)),
         "r": ((1,0,0),(0,0,1),(0,1,0)), "u": ((0,1,0),(1,0,0),(0,0,1)), "d": ((0,-1,0),(1,0,0),(0,0,-1))}

def load_faces(tiledir, level=5, tile=512, cube=4512):
    faces = {}
    n = math.ceil(cube / tile)
    for name in FACES:
        face = np.zeros((cube, cube, 3), np.uint8)
        for i in range(n):
            for j in range(n):
                t = cv2.imread(os.path.join(tiledir, str(level), f"{name}{i}_{j}.jpg"))
                face[i*tile:i*tile+t.shape[0], j*tile:j*tile+t.shape[1]] = t
        faces[name] = face
    return faces

def dirs_to_cube(d):
    """d: (...,3) unit-ish directions -> (face index array, u, v in [0,1]) using the FACES basis."""
    x, y, z = d[...,0], d[...,1], d[...,2]
    ax, ay, az = np.abs(x), np.abs(y), np.abs(z)
    face = np.full(x.shape, -1, np.int8); u = np.zeros(x.shape); v = np.zeros(x.shape)
    order = ["f","b","u","d","l","r"]
    for k, name in enumerate(order):
        F, Rt, U = map(np.array, FACES[name])
        fd = d @ F  # forward component
        if name in ("f","b"): m = (az >= ax) & (az >= ay) & (fd > 0)
        elif name in ("u","d"): m = (ay > az) & (ay >= ax) & (fd > 0)
        else: m = (ax > az) & (ax > ay) & (fd > 0)
        face[m] = k
        uu = (d[m] @ Rt) / fd[m]; vv = -(d[m] @ U) / fd[m]   # u right, v down in [-1,1]
        u[m] = (uu + 1) / 2; v[m] = (vv + 1) / 2
    return face, u, v, order

def sample_cube(faces, d, cube=4512):
    """Sample colour for directions d (H,W,3) from the face images; returns HxWx3 uint8 (Lanczos via per-face remap)."""
    face, u, v, order = dirs_to_cube(d)
    out = np.zeros(d.shape[:2] + (3,), np.uint8)
    for k, name in enumerate(order):
        m = face == k
        if not m.any(): continue
        mx = (u * cube - 0.5).astype(np.float32); my = (v * cube - 0.5).astype(np.float32)
        # remap the whole grid with this face, then copy the masked pixels (simple, memory-light enough at 14k x 4.5k)
        res = cv2.remap(faces[name], mx, my, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
        out[m] = res[m]
    return out

def equirect_dirs(W, H, vaov):
    lon = (np.arange(W) + 0.5) / W * 2 * np.pi - np.pi          # -pi..pi, centre 0
    lat = (0.5 - (np.arange(H) + 0.5) / H) * math.radians(vaov)
    lon, lat = np.meshgrid(lon, lat)
    return np.stack([np.sin(lon) * np.cos(lat), np.sin(lat), -np.cos(lon) * np.cos(lat)], -1)
