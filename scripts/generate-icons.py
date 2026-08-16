"""Generates SizeKit launcher and splash assets from the master icon artwork.

The master (`assets/icon.png`) is the full-bleed brand mark on the navy
background. Everything else is derived from it so the brand stays consistent.

Run with: python3 scripts/generate-icons.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
MASTER = ASSETS / "icon.png"

BRAND_NAVY = (15, 28, 46)
WORDMARK = "SizeKit"
WORDMARK_FONT = "/usr/share/fonts/truetype/ubuntu/UbuntuSans[wdth,wght].ttf"
WORDMARK_FALLBACK = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Adaptive icons are masked to a circle/squircle, so keep artwork well inside.
FOREGROUND_SAFE_RATIO = 0.60
SPLASH_MARK_RATIO = 0.52


def flatten_background(image: Image.Image) -> Image.Image:
    """Flattens the artwork's vignette into one solid brand navy background."""
    rgb = image.convert("RGB")
    width, height = rgb.size

    for corner in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)):
        ImageDraw.floodfill(rgb, corner, BRAND_NAVY, thresh=70)

    return rgb


def cut_background(image: Image.Image, cutoff: int = 60, solid: int = 110) -> Image.Image:
    """Keeps the mark and drops the navy background.

    Distance from the background colour is used rather than raw brightness,
    because the darker end of the teal gradient is itself fairly dark and a
    brightness threshold would eat into it.
    """
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    span = max(1, solid - cutoff)
    br, bg, bb = BRAND_NAVY

    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            distance = abs(r - br) + abs(g - bg) + abs(b - bb)
            if distance <= cutoff:
                alpha = 0
            elif distance >= solid:
                alpha = 255
            else:
                alpha = round((distance - cutoff) / span * 255)
            pixels[x, y] = (r, g, b, alpha)

    return rgba


def trim(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def scale_to_width(image: Image.Image, width: int) -> Image.Image:
    height = max(1, round(image.height * width / image.width))
    return image.resize((width, height), Image.LANCZOS)


def center_on_canvas(mark: Image.Image, size: int, ratio: float) -> Image.Image:
    target = int(size * ratio)
    scale = min(target / mark.width, target / mark.height)
    resized = mark.resize(
        (max(1, round(mark.width * scale)), max(1, round(mark.height * scale))),
        Image.LANCZOS,
    )

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(
        resized,
        ((size - resized.width) // 2, (size - resized.height) // 2),
        resized,
    )
    return canvas


def to_monochrome(mark: Image.Image) -> Image.Image:
    """Themed launcher icons are re-tinted by the system, so flatten to white."""
    white = Image.new("RGBA", mark.size, (255, 255, 255, 0))
    white.putalpha(mark.getchannel("A"))
    return white


def load_wordmark_font(size: int) -> ImageFont.FreeTypeFont:
    try:
        font = ImageFont.truetype(WORDMARK_FONT, size)
        font.set_variation_by_name("Bold")
        return font
    except OSError:
        return ImageFont.truetype(WORDMARK_FALLBACK, size)


def build_splash(mark: Image.Image, size: int = 1024) -> Image.Image:
    """Stacks the mark above the wordmark for the launch screen lockup."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    mark_width = round(size * SPLASH_MARK_RATIO)
    scaled_mark = scale_to_width(trim(mark), mark_width)

    font = load_wordmark_font(round(size * 0.135))
    draw = ImageDraw.Draw(canvas)
    text_box = draw.textbbox((0, 0), WORDMARK, font=font)
    text_width = text_box[2] - text_box[0]
    text_height = text_box[3] - text_box[1]

    gap = round(size * 0.075)
    total_height = scaled_mark.height + gap + text_height
    top = (size - total_height) // 2

    canvas.paste(scaled_mark, ((size - scaled_mark.width) // 2, top), scaled_mark)
    draw.text(
        ((size - text_width) // 2 - text_box[0], top + scaled_mark.height + gap - text_box[1]),
        WORDMARK,
        font=font,
        fill=(255, 255, 255, 255),
    )

    return canvas


def main() -> None:
    master = flatten_background(Image.open(MASTER))
    size = master.width
    master.save(MASTER)

    mark = trim(cut_background(master))

    Image.new("RGBA", (size, size), (*BRAND_NAVY, 255)).save(
        ASSETS / "android-icon-background.png"
    )

    foreground = center_on_canvas(mark, size, FOREGROUND_SAFE_RATIO)
    foreground.save(ASSETS / "android-icon-foreground.png")
    to_monochrome(foreground).save(ASSETS / "android-icon-monochrome.png")

    build_splash(mark, size).save(ASSETS / "splash-icon.png")
    master.resize((48, 48), Image.LANCZOS).save(ASSETS / "favicon.png")

    print("Generated launcher and splash assets in", ASSETS)


if __name__ == "__main__":
    main()
