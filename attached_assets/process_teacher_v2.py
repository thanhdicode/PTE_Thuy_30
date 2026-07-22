import sys
import numpy as np
from PIL import Image, ImageDraw
from rembg import remove

BASE = "/home/runner/workspace/attached_assets"
SRC = f"{BASE}/image_1783619496540.png"

src = Image.open(SRC).convert("RGB")
print("src size", src.size)

out = remove(src).convert("RGBA")
arr = np.array(out)
alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 10)
top, bottom, left, right = int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())
print("bbox L,T,R,B", left, top, right, bottom, "-> w,h", right - left + 1, bottom - top + 1)
crop = out.crop((left, top, right + 1, bottom + 1))
crop.save(f"{BASE}/teacher2-cutout.png")
print("cutout size", crop.size)

# Grid preview on plum bg, labelled in ORIGINAL cutout coordinates
W, H = crop.size
PW = 440
scale = PW / W
PH = int(H * scale)
prev = crop.resize((PW, PH), Image.LANCZOS)
bg = Image.new("RGB", (PW, PH), (18, 10, 46))
bg.paste(prev, (0, 0), prev)
d = ImageDraw.Draw(bg)
for oy in range(0, H, 50):
    py = int(oy * scale)
    d.line([(0, py), (PW, py)], fill=(255, 235, 0), width=1)
    d.text((2, py + 1), str(oy), fill=(255, 235, 0))
for ox in range(0, W, 100):
    px = int(ox * scale)
    d.line([(px, 0), (px, PH)], fill=(0, 220, 255), width=1)
    d.text((px + 1, 1), str(ox), fill=(0, 220, 255))
bg.save(f"{BASE}/teacher2-grid.png")
print("grid saved", bg.size, "scale", round(scale, 4))
print("done")
