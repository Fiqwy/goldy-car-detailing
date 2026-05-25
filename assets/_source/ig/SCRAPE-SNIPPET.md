# How to scrape Gracie's IG safely (you do this once)

## Steps

1. In your already-signed-in Chrome, open **https://www.instagram.com/goldycardetailing/**
2. Open DevTools — `Cmd+Option+I` — go to the **Console** tab
3. Paste the snippet below and press Enter. You'll see `[goldy] Watcher armed.`
4. **Slowly scroll down the profile** to the very bottom. Pause every few rows so images finish loading. The console will print `[goldy] +N posts (total M)` as new ones come in.
5. When you've scrolled to the very bottom and seen no new updates for ~5 seconds, run: `goldySave()`
6. A file `goldy-ig-scrape.json` downloads. Move it into `~/claude code projects/goldy-car-detailing/assets/_source/ig/` and tell me — I'll do the rest.

## Snippet — paste this entire block into the Console

```js
(() => {
  const posts = new Map();   // shortcode → { url, src, srcset, alt, ts }
  const reHref = /\/(p|reel)\/([^/?#]+)/;

  function capture(node) {
    const links = node.matches?.('a[href*="/p/"], a[href*="/reel/"]')
      ? [node]
      : node.querySelectorAll?.('a[href*="/p/"], a[href*="/reel/"]') || [];
    links.forEach(a => {
      const m = a.getAttribute('href')?.match(reHref);
      if (!m) return;
      const shortcode = m[2];
      const img = a.querySelector('img');
      if (!img) return;
      const entry = posts.get(shortcode) || { shortcode, type: m[1] };
      entry.url = `https://www.instagram.com${a.getAttribute('href')}`;
      entry.src = img.currentSrc || img.src || entry.src;
      entry.srcset = img.srcset || entry.srcset;
      entry.alt = img.alt || entry.alt;
      entry.ts = Date.now();
      posts.set(shortcode, entry);
    });
  }

  // Sweep what's already on screen
  capture(document.body);

  // Watch for new posts as you scroll
  const obs = new MutationObserver(muts => {
    let added = 0;
    const before = posts.size;
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) capture(n);
    }));
    const after = posts.size;
    if (after > before) {
      console.log(`[goldy] +${after - before} posts (total ${after})`);
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  window.goldySave = () => {
    const out = {
      profile: 'goldycardetailing',
      capturedAt: new Date().toISOString(),
      count: posts.size,
      posts: Array.from(posts.values()).sort((a, b) => a.shortcode.localeCompare(b.shortcode))
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'goldy-ig-scrape.json';
    a.click();
    console.log(`[goldy] Saved ${out.count} posts to goldy-ig-scrape.json`);
    return out;
  };

  console.log('[goldy] Watcher armed. Scroll slowly to the bottom, then run: goldySave()');
})();
```

## What gets captured

- Every post (image AND reel thumbnail) on her grid
- The IG CDN image URL (640px or 1080px depending on screen — public, no auth needed to download)
- Alt text (IG auto-generates a description — useful for accessibility)
- Post shortcode (so I can link back to the original)

## What's NOT captured

- Full-res hero shots (would need to click each post individually). For 1-2 hero images, just right-click → "Save image as…" on her best photos and drop them in `assets/hero/`.
- Reel videos (just the thumbnail).
- Captions (could be added — let me know if you want them for the alt text).
