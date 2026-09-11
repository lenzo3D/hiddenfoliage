"""sdx4.py IN.png OUT.png [--tile 192] [--ov 32] [--steps 25] [--noise 8] [--guidance 5] [--wrap]
Tiled Stable Diffusion x4 upscaler (stabilityai/stable-diffusion-x4-upscaler) on the Metal GPU.
Tiles in input pixels with feathered overlaps; --wrap pads the 360 seam with the opposite edge."""
import argparse, time, numpy as np, torch
from PIL import Image
from diffusers import StableDiffusionUpscalePipeline
ap = argparse.ArgumentParser(); ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--tile", type=int, default=192); ap.add_argument("--ov", type=int, default=32); ap.add_argument("--steps", type=int, default=25)
ap.add_argument("--noise", type=int, default=8); ap.add_argument("--guidance", type=float, default=5.0); ap.add_argument("--wrap", action="store_true")
ap.add_argument("--prompt", default="photorealistic architectural interior render, sharp focus, detailed natural materials, soft light")
a = ap.parse_args()
pipe = StableDiffusionUpscalePipeline.from_pretrained("stabilityai/stable-diffusion-x4-upscaler", torch_dtype=torch.float16).to("mps")
pipe.set_progress_bar_config(disable=True)
img = np.asarray(Image.open(a.inp).convert("RGB")); H, W = img.shape[:2]; S = 4; T, OV = a.tile, a.ov
pad = OV if a.wrap else 0
imgp = np.concatenate([img[:, -pad:], img, img[:, :pad]], 1) if pad else img
Hp, Wp = imgp.shape[:2]
r = np.linspace(0, 1, OV*S, dtype=np.float32); one = np.ones(T*S - 2*OV*S, dtype=np.float32); prof = np.concatenate([r, one, r[::-1]])
wt = np.minimum(prof[:, None], prof[None, :])[..., None]
out = np.zeros((Hp*S, Wp*S, 3), np.float32); wsum = np.zeros((Hp*S, Wp*S, 1), np.float32)
stride = T - OV
ys = list(range(0, max(Hp - T, 0) + 1, stride)); ys += [Hp - T] if ys[-1] != Hp - T else []
xs = list(range(0, max(Wp - T, 0) + 1, stride)); xs += [Wp - T] if xs[-1] != Wp - T else []
t0 = time.time(); k = 0; gen = torch.Generator("cpu").manual_seed(7)
for y in ys:
    for x in xs:
        tile = Image.fromarray(imgp[y:y+T, x:x+T])
        res = pipe(prompt=a.prompt, negative_prompt="blurry, noisy, artifacts, text, watermark", image=tile, num_inference_steps=a.steps, guidance_scale=a.guidance, noise_level=a.noise, generator=gen).images[0]
        arr = np.asarray(res).astype(np.float32)
        out[y*S:(y+T)*S, x*S:(x+T)*S] += arr*wt; wsum[y*S:(y+T)*S, x*S:(x+T)*S] += wt; k += 1
    print(f"row y={y}: {k}/{len(ys)*len(xs)} tiles, {time.time()-t0:.0f}s", flush=True)
res = (out/np.maximum(wsum, 1e-6))[:, pad*S:(pad+W)*S]
Image.fromarray(np.clip(res + 0.5, 0, 255).astype(np.uint8)).save(a.out, compress_level=1)
print(f"done {res.shape[1]}x{res.shape[0]} in {time.time()-t0:.0f}s")
