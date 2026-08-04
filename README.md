# Goldy Car Detailing

Mobile car detailing on the Gold Coast. Live at **https://goldycardetailing.com.au**.

Vanilla HTML/CSS/JS, no build step. `content.js` is the single source of truth — edit that one file to change almost anything on the site.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Booking is **SMS-only** (no email anywhere, by design). See `HANDOFF.md` for the full picture: architecture, standards, deploy steps, and what's still outstanding from the client.
