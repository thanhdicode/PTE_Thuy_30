import numpy as np
from PIL import Image
from rembg import remove

BASE = "/home/runner/workspace/attached_assets"
src = Image.open(f"{BASE}/teacher-src.png").convert("RGB")

# 1) Background removal (u2net)
out = remove(src).convert("RGBA")
arr = np.array(out)
H, W = arr.shape[:2]
print("cutout size", W, H)

# 2) Remove the OTHER person's hand — only in the hand y-band, feathered on x.
#    Her grip ends ~x=858; stranger's hand is x>=~860 within y 495..630.
y0, y1 = 495, 630
cut_start, cut_end = 858, 882  # feather 1->0 across this x range
xs_axis = np.arange(W, dtype=np.float32)
ramp = np.clip((cut_end - xs_axis) / (cut_end - cut_start), 0.0, 1.0)
ramp[:cut_start] = 1.0
band = arr[y0:y1, :, 3].astype(np.float32)
arr[y0:y1, :, 3] = (band * ramp[None, :]).astype(np.uint8)

res = Image.fromarray(arr, "RGBA")
res.save(f"{BASE}/teacher-clean-full.png")

# 3) Autocrop to content bounding box
alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 10)
top, bottom, left, right = int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())
print("bbox L,T,R,B", left, top, right, bottom)
crop = res.crop((left, top, right + 1, bottom + 1))
crop.save(f"{BASE}/teacher-clean-crop.png")
print("cropped size", crop.size)

# 4) Preview composited on the site's plum background (#120A2E = 18,10,46)
def preview(img, name, scale=None):
    im = img
    if scale:
        w = scale
        h = int(img.size[1] * scale / img.size[0])
        im = img.resize((w, h), Image.LANCZOS)
    bg = Image.new("RGB", im.size, (18, 10, 46))
    bg.paste(im, (0, 0), im)
    bg.save(name)

preview(crop, f"{BASE}/teacher-preview.png")
preview(crop, f"{BASE}/teacher-preview-small.png", scale=260)
print("done")
