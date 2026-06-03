# RK Studios site — placeholder checklist

Everything below is **mock content** and must be replaced (or verified) **before the site is shown to Ramil
or published**. Bracketed `[...]` items are also caught automatically by `scripts/check-placeholders.sh`, which
blocks the publish scripts until they're filled.

Run the audit any time:

```bash
bash scripts/check-placeholders.sh
```

---

## 1. Photography — the whole point (get from Ramil, do NOT scrape his live site)

All 14 images are now **licensed Pexels stock** (warm golden-hour, free for commercial use) standing in for layout, so
the demo reads as a real photo site. The original gradient "REPLACE WITH YOUR PHOTO" SVGs are kept in `public/images/`
as `.svg` backups. Swap each `.jpg` for Ramil's real frame (keep the filename, or update the `src` in `index.html`).
A footer note flags the build as using stock until then — remove it once his photos are in. The People B&W slots
(people-02, people-05, perspective-03) carry an inline `filter:grayscale(1)`; drop it if his real frame is colour.

| Slot | File | Intended treatment / aspect |
|------|------|------------------------------|
| Hero | `public/images/hero/hero-main.svg` | Signature wide frame, golden hour (1600×1000) |
| People ×5 | `public/images/people/people-01..05.svg` | Couples, family, maternity, family, wedding. One B&W (02), one B&W (05) |
| Places ×3 | `public/images/places/places-01..03.svg` | 01 = full-bleed wide break; landscape + seascape |
| Perspective ×3 | `public/images/perspective/perspective-01..03.svg` | Carnival/CayMAS, dusk couple, B&W detail |
| About portrait | `public/images/about/portrait.svg` | Portrait of Ramil (4:5) |
| Social share | `public/images/og-image.jpg` | Real OG image for link previews |

**Also replace the invented titles/captions** that ride on each photo (in `index.html`, `data-title` / `data-meta`
/ `alt`): "Last light, North Sound", "The Guhls", "Expecting", "All four of us", "I do", "A lone palm",
"Gold on the water", "See you on the road", "We all deserve this", "In her eyes". Use the real story for each frame.

## 2. Testimonials — DONE ✅ (real Google reviews, `index.html`, "Client love")

Live now, verbatim (lightly trimmed) from Ramil's Google profile:
- Berkley Ramos · Couples · Kathy · Wedding · Gabriella Kapitaniuk · Family

Two more on file if you want to rotate or add a row: **Steve B · Engagement**, **Denise Lisa Cintron · Family/visitor**.
Optional polish: add a small "★★★★★ Google" cue to each so visitors see they're real Google reviews.

## 3. Copy to verify with Ramil (`index.html`)

- **About bio** — "Caymanian by home, Filipino by heart" + the documentary/love-letter framing. Plausible but unconfirmed.
- **Hero headline** — keeping **"Visual Poetry"** (his own phrase). Alternatives in 3a if he wants to tweak.

## 3a. Questions for Ramil — only if he's keen (none of these block the pitch)

These are **his calls, not fixes** — decide them with him once he's interested:

- **Start year** — does he want a "Shooting since YYYY" credibility stat in the About section, and what year?
  It's currently **hidden** (was showing a placeholder; removed so the demo looks clean). Easy to restore — see the
  comment in the About `<dl>` in `index.html`.
- **Show the rating?** — does he want a small **★★★★★ Google** tag under each testimonial so visitors see they're real
  Google reviews? Currently **not shown** (quotes only).
- **"Perspective" section** — keep it as pure art direction, or add a small "what you can book" cue so the booking path
  stays obvious?
- **Hero line** — keeping "Visual Poetry" (his phrase). Options if he wants: _"Your people, in the island's best light."_
  · _"Grand Cayman, at golden hour."_ · _"The island, the way you'll remember it."_

> All photography in this build is **generic licensed stock** (various Pexels photographers) with Cayman-flavoured
> captions for layout — **not Ramil's work and not shot in Cayman.** Swap for his real frames before launch (section 1).

## 4. Details to confirm

- **Phone** `+1 345 917 8203` (used in tel:, WhatsApp deep-link, JSON-LD) — confirm correct.
- **Instagram** `@ramilugot`, **Threads** `@ramilugot` — confirm.
- **Domain** `https://rkstudios.ky/` (canonical + OG URLs) — confirm he owns it, or change.
- **Booking flow** — the form has no backend; on submit it builds a pre-filled WhatsApp message to the number above.
  Confirm that's the desired flow, or point `data-endpoint` at Formspree/Netlify Forms to also capture by email.

---

_Last audited: 2026-06-02. Fonts now Fraunces (display) + Hanken Grotesk (body) — no Inter._
