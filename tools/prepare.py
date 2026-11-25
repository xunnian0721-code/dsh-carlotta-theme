"""把你【已经取得原作者同意】并自己下载好的图片，转成插件要的尺寸、格式和文件名。

用法（在插件目录里打开命令行）：
    python tools/prepare.py list                      看 70 个位置哪些已放、哪些还缺，以及对应的原作链接
    python tools/prepare.py <图片文件> <位置>          例：python tools/prepare.py D:/下载/142480181_p0.jpg bg/srune
    python tools/prepare.py <图片文件> <位置> --no-crop   不做清单里写好的自动裁剪

需要 Python 3.9+ 和 Pillow：  pip install pillow
本脚本不会联网、不会下载任何图片。
"""
import json, os, sys
try:
    sys.stdout.reconfigure(errors="replace")  # 中文 Windows 控制台是 GBK，遇到打不出的字符用 ? 代替
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SLOTS = {s["slot"]: s for s in json.load(open(os.path.join(HERE, "images.json"), encoding="utf-8"))}

BG_MAX, BOOT_MAX, IMG_MAX = 2880, 2400, 1400   # 最长边
QUALITY = 86


def show_list():
    have = 0
    cur = None
    for s in SLOTS.values():
        if s["char"] != cur:
            cur = s["char"]
            print("\n== " + cur)
        ok = os.path.exists(os.path.join(ROOT, s["file"]))
        have += ok
        link = s.get("url", "（无 Pixiv 原作）")
        print(f"  [{'有' if ok else '缺'}] {s['slot']:<22} {s['skin']} · {s['kind']}  {link}")
    print(f"\n已放 {have} / {len(SLOTS)}。没放的位置只显示纯色背景，不影响使用。")


def cutout(im, tol=22):
    """把贴着四边的白色背景变透明（适合白底的 Q 版 / 立绘；本来就是透明底的会原样保留）。"""
    from PIL import Image, ImageDraw, ImageFilter
    im = im.convert("RGBA")
    if im.getpixel((0, 0))[3] < 10:
        return im.crop(im.getbbox())
    w, h = im.size
    probe = im.convert("RGB")
    MARK = (255, 0, 255)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        px = probe.getpixel(seed)
        if sum(px) > 3 * (255 - tol) and px != MARK:
            ImageDraw.floodfill(probe, seed, MARK, thresh=tol * 2)
    mask = Image.new("L", (w, h), 255)
    pp, mp = probe.load(), mask.load()
    for y in range(h):
        for x in range(w):
            if pp[x, y] == MARK:
                mp[x, y] = 0
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    im.putalpha(mask)
    return im.crop(im.getbbox())


def prepare(src, slot, crop=True):
    from PIL import Image
    if slot not in SLOTS:
        sys.exit(f"没有「{slot}」这个位置。先运行  python tools/prepare.py list  看看位置名怎么写。")
    s = SLOTS[slot]
    im = Image.open(src)
    if crop and s.get("crop"):
        l, t, r, b = s["crop"]
        w, h = im.size
        im = im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))
        print("已按清单裁剪：", s["crop"])
    out = os.path.join(ROOT, s["file"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if slot.startswith("img/"):
        im.thumbnail((IMG_MAX, IMG_MAX), Image.LANCZOS)
        im = cutout(im)
        if out.endswith(".png"):
            im.save(out, optimize=True)
        else:
            im.save(out, quality=90, method=6)
    else:
        im = im.convert("RGB")
        m = BG_MAX if slot.startswith("bg/") else BOOT_MAX
        im.thumbnail((m, m), Image.LANCZOS)
        im.save(out, quality=QUALITY, method=6)
    print(f"已保存 {s['file']}（{im.size[0]}×{im.size[1]}，{os.path.getsize(out) // 1024} KB）")
    print("记得：改完图要在 DSH 插件页移除再重新添加本插件，然后重启 DSH。")


if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    if not a or a[0] == "list":
        show_list()
    elif len(a) == 2:
        prepare(a[0], a[1], crop="--no-crop" not in sys.argv)
    else:
        print(__doc__)
