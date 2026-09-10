"""Minimal LaMa runner on the CPU from the cached big-lama.pt TorchScript (no CUDA assumptions)."""
import os, numpy as np, torch, cv2
_model = None
def lama(img_bgr, mask):
    global _model
    if _model is None:
        p = os.path.expanduser("~/.cache/torch/hub/checkpoints/big-lama.pt")
        _model = torch.jit.load(p, map_location="cpu").eval()
    H, W = mask.shape
    ph, pw = (8 - H % 8) % 8, (8 - W % 8) % 8
    img = cv2.copyMakeBorder(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB), 0, ph, 0, pw, cv2.BORDER_REFLECT)
    m = cv2.copyMakeBorder(mask, 0, ph, 0, pw, cv2.BORDER_CONSTANT, value=0)
    x = torch.from_numpy(img).permute(2, 0, 1)[None].float() / 255.0
    mk = torch.from_numpy((m > 127).astype(np.float32))[None, None]
    with torch.no_grad():
        out = _model(x, mk)[0].permute(1, 2, 0).numpy()
    out = np.clip(out * 255, 0, 255).astype(np.uint8)[:H, :W]
    return cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
