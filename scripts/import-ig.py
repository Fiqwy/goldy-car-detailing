#!/usr/bin/env python3
"""
Import scraped IG content into the project.

Usage:
    python3 scripts/import-ig.py assets/_source/ig/goldy-ig-scrape.json

What it does:
1. Reads the JSON dumped by the Chrome DevTools snippet
2. For each post: picks the highest-res image URL from srcset (or falls back to src)
3. Downloads with random 0.8–2.5s delays (polite to IG CDN — won't get rate-limited)
4. Saves as assets/_source/ig/<shortcode>.jpg
5. Converts each to .webp via sips, drops in assets/gallery/<NN>.webp (top 15 by recency)
6. Writes assets/_source.json with provenance for every file
7. Prints what to do next (manual hero pick + content.js update)
"""
import json, sys, time, random, subprocess, re
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlopen, Request

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "_source" / "ig"
GALLERY = ROOT / "assets" / "gallery"
MANIFEST = ROOT / "assets" / "_source.json"

def pick_best_url(src, srcset):
    """Pick the widest URL from srcset (eg '...640w, ...1080w' → 1080w)."""
    if not srcset:
        return src
    best_w, best_url = 0, src
    for chunk in srcset.split(","):
        parts = chunk.strip().rsplit(" ", 1)
        if len(parts) != 2:
            continue
        url, w = parts
        try:
            w = int(w.rstrip("w"))
            if w > best_w:
                best_w, best_url = w, url
        except ValueError:
            continue
    return best_url

def download(url, dest):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605"})
    with urlopen(req, timeout=30) as r:
        dest.write_bytes(r.read())

def sips_to_webp(src, dest, width=1280):
    subprocess.run(
        ["sips", "-s", "format", "webp", "-Z", str(width), str(src), "--out", str(dest)],
        check=True, capture_output=True
    )

def main(scrape_path):
    data = json.loads(Path(scrape_path).read_text())
    posts = data["posts"]
    print(f"[import] {len(posts)} posts from {data.get('profile')}")

    SRC.mkdir(parents=True, exist_ok=True)
    GALLERY.mkdir(parents=True, exist_ok=True)

    manifest = {
        "_doc": "Provenance for every visual asset",
        "_updated": data.get("capturedAt", ""),
        "ig_posts": []
    }

    downloaded = []
    for i, p in enumerate(posts, 1):
        url = pick_best_url(p.get("src"), p.get("srcset"))
        if not url:
            print(f"[skip] {p['shortcode']} — no url")
            continue
        ext = Path(urlparse(url).path).suffix or ".jpg"
        dest = SRC / f"{p['shortcode']}{ext}"
        if dest.exists():
            print(f"[have] {dest.name}")
        else:
            print(f"[get ] {i}/{len(posts)} {dest.name}")
            try:
                download(url, dest)
                time.sleep(random.uniform(0.8, 2.5))
            except Exception as e:
                print(f"[err ] {p['shortcode']}: {e}")
                continue
        downloaded.append((p, dest))
        manifest["ig_posts"].append({
            "shortcode": p["shortcode"],
            "type": p.get("type", "p"),
            "post_url": p.get("url"),
            "alt": p.get("alt", ""),
            "local": str(dest.relative_to(ROOT))
        })

    # Pick top 15 by shortcode-recency (IG shortcodes sort lexically roughly by time)
    downloaded.sort(key=lambda x: x[0]["shortcode"], reverse=True)
    top15 = downloaded[:15]

    print(f"\n[gallery] Converting top {len(top15)} to webp")
    for idx, (post, src) in enumerate(top15, 1):
        out = GALLERY / f"{idx:02d}.webp"
        try:
            sips_to_webp(src, out)
            print(f"  {out.name} ← {src.name}")
        except subprocess.CalledProcessError as e:
            print(f"  [err] {out.name}: {e.stderr.decode()[:120]}")

    MANIFEST.write_text(json.dumps(manifest, indent=2))
    print(f"\n[manifest] {MANIFEST}")
    print(f"\nNEXT:")
    print(f"  1. Eyeball assets/gallery/01-{len(top15):02d}.webp — manually swap any duds")
    print(f"  2. Pick 1-2 hero shots: right-click-save full-res from IG, drop in assets/hero/before-real.jpg + after-real.jpg")
    print(f"  3. Update content.js: galleries' alt text from the manifest, hero paths to real files")
    print(f"  4. Commit + push")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: import-ig.py <path-to-goldy-ig-scrape.json>")
    main(sys.argv[1])
