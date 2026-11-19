"""生成任务三用的“细节测试图”（1200x1600 竖图，适配手机查看器），用于验证双指缩放的清晰度。"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 1600
OUT = r"C:\Users\gaoxinhe\Documents\trae_projects\mobile-events-gxh\assets\img\gxh-detail.jpg"
FONT = r"C:\Windows\Fonts\msyh.ttc"
FONT_B = r"C:\Windows\Fonts\msyhbd.ttc"
HORIZON = 1000

rng = np.random.default_rng(11)


def vgrad(w, h, stops):
    ys = np.linspace(0.0, 1.0, h)
    out = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        m = (ys >= p0) & (ys <= p1)
        t = np.where(m, (ys - p0) / max(1e-6, p1 - p0), 0.0)[:, None]
        for k in range(3):
            out[:, :, k] += np.where(m, c0[k] + (c1[k] - c0[k]) * t[:, 0], 0.0)[:, None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


# ---------------- 天空 ----------------
img = vgrad(W, HORIZON, [
    (0.00, (9, 11, 30)),
    (0.26, (20, 22, 58)),
    (0.46, (46, 38, 84)),
    (0.64, (108, 62, 100)),
    (0.80, (196, 104, 100)),
    (0.93, (244, 152, 108)),
    (1.00, (252, 182, 122)),
])
draw = ImageDraw.Draw(img, "RGBA")

for _ in range(300):
    x = int(rng.integers(0, W))
    y = int(rng.integers(0, int(HORIZON * 0.62)))
    r = float(rng.uniform(0.6, 1.8))
    a = int(rng.uniform(40, 200) * (1 - y / (HORIZON * 0.7)))
    draw.ellipse([x, y, x + r, y + r], fill=(255, 252, 235, max(0, a)))

# ---------------- 晚霞 ----------------
glow = Image.new("RGB", (W, HORIZON), (0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([380, 420, 1200, 1120], fill=(255, 138, 92))
gd.ellipse([240, 700, 1080, 1180], fill=(255, 96, 128))
gd.ellipse([520, 560, 1000, 960], fill=(255, 206, 150))
glow = glow.filter(ImageFilter.GaussianBlur(160))
img = Image.blend(img, glow, 0.42)
draw = ImageDraw.Draw(img, "RGBA")

# 太阳
sun = Image.new("RGB", (W, HORIZON), (0, 0, 0))
sd = ImageDraw.Draw(sun)
sd.ellipse([726, 606, 914, 794], fill=(255, 230, 176))
sun = sun.filter(ImageFilter.GaussianBlur(40))
img = Image.blend(img, sun, 0.62)
draw = ImageDraw.Draw(img, "RGBA")
draw.ellipse([790, 670, 846, 726], fill=(255, 249, 226, 255))

# ---------------- 山脊 ----------------
def ridge(base_y, peaks, color):
    pts = [(0, base_y)] + list(peaks) + [(W, base_y)]
    draw.polygon(pts, fill=color)


ridge(HORIZON + 2, [(-40, 860), (120, 720), (260, 800), (420, 640), (600, 790),
                    (760, 690), (900, 800), (1050, 700), (1250, 810)], (74, 58, 104, 255))

# 山间薄雾
mist = Image.new("RGBA", (W, HORIZON), (0, 0, 0, 0))
md = ImageDraw.Draw(mist)
md.rectangle([0, 800, W, 880], fill=(255, 210, 210, 64))
md.rectangle([0, 700, W, 760], fill=(255, 220, 200, 40))
mist = mist.filter(ImageFilter.GaussianBlur(28))
img = Image.alpha_composite(img.convert("RGBA"), mist).convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

ridge(HORIZON + 2, [(-40, 980), (180, 850), (330, 940), (520, 820), (700, 950),
                    (880, 840), (1060, 940), (1250, 860)], (44, 35, 72, 255))

# ---------------- 湖面 ----------------
lake = vgrad(W, H - HORIZON, [
    (0.00, (92, 66, 96)),
    (0.18, (54, 42, 76)),
    (0.48, (28, 24, 48)),
    (1.00, (8, 8, 16)),
])
canvas = Image.new("RGB", (W, H), (0, 0, 0))
canvas.paste(img, (0, 0))
canvas.paste(lake, (0, HORIZON))
img = canvas
draw = ImageDraw.Draw(img, "RGBA")

# 太阳在水里的倒影
refl = Image.new("RGB", (W, H - HORIZON), (0, 0, 0))
rd = ImageDraw.Draw(refl)
for i in range(80):
    y = int(i * 6.4)
    if y >= H - HORIZON:
        break
    w = 105 - i * 1.05
    a = max(0.0, 1 - i / 60.0)
    col = (255, int(120 + 80 * a), int(90 + 30 * a))
    rd.rectangle([818 - w / 2, y, 818 + w / 2, y + 4], fill=col)
refl = refl.filter(ImageFilter.GaussianBlur(11)).convert("RGBA")
area = img.crop((0, HORIZON, W, H))
area = Image.blend(area.convert("RGB"), refl.convert("RGB"), 0.46).convert("RGBA")
img.paste(area, (0, HORIZON))
draw = ImageDraw.Draw(img, "RGBA")

# 水波
for _ in range(220):
    y = HORIZON + 12 + int(rng.gamma(2.0, 52))
    if y > H - 8:
        continue
    x = int(rng.integers(-40, W))
    ln = int(rng.uniform(30, 240))
    a = int(52 * (1 - (y - HORIZON) / (H - HORIZON)))
    draw.line([x, y, x + ln, y], fill=(200, 218, 255, max(0, a)), width=1)

# ---------------- 前景松树 ----------------
def pine(x, y, h, color):
    w = h * 0.44
    draw.rectangle([x - w * 0.055, y - h * 0.12, x + w * 0.055, y], fill=color)
    for k in range(3):
        yy = y - h * (0.18 + k * 0.26)
        hh = h * (0.50 - k * 0.11)
        ww = w * (1 - k * 0.24)
        draw.polygon([(x, yy - hh), (x - ww / 2, yy), (x + ww / 2, yy)], fill=color)


for (x, h) in [(46, 420), (120, 300), (1170, 440), (1090, 300)]:
    pine(x, H, h, (6, 6, 12, 255))

# 岸边暗部
draw.polygon([(0, HORIZON), (0, HORIZON + 60), (140, HORIZON + 26), (320, HORIZON + 70),
              (520, HORIZON + 34), (760, HORIZON + 76), (980, HORIZON + 40),
              (1200, HORIZON + 66), (1200, HORIZON)], fill=(16, 14, 28, 215))

# ---------------- 细节测试元素 ----------------
f_big = ImageFont.truetype(FONT_B, 58)
f_mid = ImageFont.truetype(FONT, 26)
f_small = ImageFont.truetype(FONT, 19)
f_tiny = ImageFont.truetype(FONT, 12)

draw.rectangle([62, 60, 67, 180], fill=(255, 255, 255, 235))
draw.text((88, 62), "细节测试图", font=f_big, fill=(255, 255, 255, 248))
draw.text((92, 140), "双指放大到 4x，看看下面这些 12px 小字是否依然清晰", font=f_small,
          fill=(214, 208, 232, 235))

# 网格 + 刻度
gx0, gy0, cell, n = 690, 1180, 20, 10
gcol = (150, 226, 255, 80)
for i in range(n + 1):
    draw.line([gx0 + i * cell, gy0, gx0 + i * cell, gy0 + n * cell], fill=gcol, width=1)
    draw.line([gx0, gy0 + i * cell, gx0 + n * cell, gy0 + i * cell], fill=gcol, width=1)
draw.text((gx0, gy0 + n * cell + 10), "网格：每格 20px", font=f_tiny, fill=(196, 228, 255, 225))

# 微型文字
tx, ty = 80, 1180
draw.text((tx, ty), "1x 时这行小字几乎看不清，4x 时应该笔笔分明", font=f_tiny, fill=(224, 228, 248, 235))
draw.text((tx, ty + 26), "0123456789  ABCDEFGHIJKLMNOPQRSTUVWXYZ", font=f_tiny, fill=(204, 214, 244, 225))
draw.text((tx, ty + 50), "移动端触摸事件 · 高薪和 24001010223", font=f_tiny, fill=(204, 214, 244, 205))
draw.text((tx, ty + 74), "double-tap 1x/2x · pinch 1x~4x · drag to pan", font=f_tiny, fill=(204, 214, 244, 205))

# 四角定位标记
for (cx, cy, dx, dy) in [(46, 46, 1, 1), (W - 46, 46, -1, 1), (46, H - 46, 1, -1), (W - 46, H - 46, -1, -1)]:
    draw.line([cx, cy, cx + dx * 38, cy], fill=(255, 255, 255, 150), width=2)
    draw.line([cx, cy, cx, cy + dy * 38], fill=(255, 255, 255, 150), width=2)

# 底部信息条
draw.rectangle([0, H - 40, W, H], fill=(0, 0, 0, 110))
draw.text((46, H - 32), "1200 × 1600 · 移动端触摸事件课堂案例 · 图片查看器测试图",
          font=f_tiny, fill=(196, 190, 214, 220))

img = img.filter(ImageFilter.SMOOTH)
img.save(OUT, "JPEG", quality=90, optimize=True, progressive=True)
print("saved", OUT, img.size, os.path.getsize(OUT))
