"""Render rectilinear views (or whole equirect strips) from an existing tile set while re-interpreting
the drawing's vertical mapping: true latitude phi -> source row v = v0 - R*tan(phi) (cylindrical with
horizon row v0) -> the row the OLD pipeline assumed had latitude phi_old = atan((H/2 - v)/R) -> old cube."""
import sys, math, numpy as np, cv2
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cube import *
SW, SH = 1774, 887; R = SW/(2*math.pi)

def old_dirs_from_true(d, v0):
    """d: (...,3) true directions -> directions in the OLD tile set's frame (same yaw, remapped latitude)."""
    x, y, z = d[...,0], d[...,1], d[...,2]
    hor = np.sqrt(x*x + z*z); phi = np.arctan2(y, hor)
    v = v0 - R*np.tan(np.clip(phi, -1.45, 1.45))
    phi_old = np.arctan((SH/2 - v)/R)
    s = np.cos(phi_old)/np.maximum(hor, 1e-9)
    return np.stack([x*s, np.sin(phi_old), z*s], -1)

def view_dirs(yaw, pitch, hfov, w, h):
    f = (w/2)/math.tan(math.radians(hfov)/2)
    xs = (np.arange(w)+0.5) - w/2; ys = (np.arange(h)+0.5) - h/2
    X, Y = np.meshgrid(xs, ys)
    d = np.stack([X, -Y, -np.full_like(X, f)], -1); d /= np.linalg.norm(d, axis=-1, keepdims=True)
    p, yw = math.radians(pitch), math.radians(yaw)
    Rp = np.array([[1,0,0],[0,math.cos(p),-math.sin(p)],[0,math.sin(p),math.cos(p)]])
    Ry = np.array([[math.cos(yw),0,math.sin(yw)],[0,1,0],[-math.sin(yw),0,math.cos(yw)]])
    return d @ Rp.T @ Ry.T

def render(faces, yaw, pitch, hfov, w, h, v0):
    return sample_cube(faces, old_dirs_from_true(view_dirs(yaw, pitch, hfov, w, h), v0))

if __name__ == "__main__":
    faces = load_faces("/Users/richard/Desktop/hidden-foliage/public/images/360/living-v4")
    tiles = []
    for yaw in (180, 90):
        for v0 in (443.5, 470, 490, 510):
            im = render(faces, yaw, -8, 68, 756, 491, v0)
            cv2.putText(im, f"yaw {yaw}  horizon row {v0}", (8, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2, cv2.LINE_AA)
            tiles.append(im)
    sheet = np.vstack([np.hstack(tiles[0:4]), np.hstack(tiles[4:8])])
    cv2.imwrite("horizon-test.jpg", sheet, [cv2.IMWRITE_JPEG_QUALITY, 88]); print("horizon-test.jpg")
