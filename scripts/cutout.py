"""Cut a portrait out of its background for the hero.

One-time setup (creates a git-ignored .venv):
    python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" pillow

Usage:
    .venv/bin/python scripts/cutout.py src/assets/portrait-source.jpg
    .venv/bin/python scripts/cutout.py path/to/photo.jpg --model birefnet-portrait   # better hair, ~900 MB model

Writes src/assets/portrait.png (transparent, trimmed to the subject, max 2000px tall).
Check the edges around hair and glasses at full size before committing.
"""

import argparse
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "portrait.png"
MAX_HEIGHT = 2000


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("src", type=Path)
    parser.add_argument("--model", default="isnet-general-use")
    parser.add_argument("--out", type=Path, default=OUT)
    args = parser.parse_args()

    image = Image.open(args.src).convert("RGB")
    cut = remove(image, session=new_session(args.model), post_process_mask=True)

    # Trim to the subject, keeping the bottom edge (the portrait sits on the hero's baseline).
    bbox = cut.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if bbox:
        cut = cut.crop((bbox[0], bbox[1], bbox[2], cut.height))

    if cut.height > MAX_HEIGHT:
        width = round(cut.width * MAX_HEIGHT / cut.height)
        cut = cut.resize((width, MAX_HEIGHT), Image.LANCZOS)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    cut.save(args.out, optimize=True)
    print(f"wrote {args.out} ({cut.width}x{cut.height}) using {args.model}")


if __name__ == "__main__":
    main()
