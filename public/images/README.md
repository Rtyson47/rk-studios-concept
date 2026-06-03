# Images — how to swap in your real photos

Every image on the site is a labelled placeholder right now. The layout is already
built to your real shooting ratios, so when you drop a photo in at the right ratio,
it slots in perfectly — **zero layout shift, nothing to redesign.**

## The two-step swap

1. Export your photo at (or near) the ratio listed below and drop it into the matching
   folder, keeping **the same file name** but your own extension — e.g. replace
   `people/people-01.svg` with `people/people-01.jpg`.
2. In `index.html`, find that file name and change the extension on the `src`
   (`...people-01.svg` → `...people-01.jpg`). That's the only edit.

> Tip: ask your AI assistant — *"swap people-01 to my new jpg"* — and it'll do step 2 for you.

## What goes where

| File | Ratio | Suggested shot |
|------|-------|----------------|
| `hero/hero-main` | 16:10 (landscape) | Your single most commanding frame — a golden-hour couple silhouette works best |
| `people/people-01` | 3:2 | Couple / engagement at sunset |
| `people/people-02` | 4:5 | Black & white family or newborn |
| `people/people-03` | 4:5 | Maternity at golden hour |
| `people/people-04` | 3:2 | Family in the surf |
| `people/people-05` | 1:1 | Black & white wedding moment |
| `places/places-01` | 3:2 | Dramatic island sky |
| `places/places-02` | 4:5 | Palm / vertical landscape |
| `places/places-03` | 3:2 | Light over the water |
| `perspective/perspective-01` | 4:5 | Carnival / editorial (your splash of colour) |
| `perspective/perspective-02` | 3:2 | Moody dusk silhouette |
| `perspective/perspective-03` | 1:1 | A detail study |
| `about/portrait` | 4:5 | A strong portrait of you |
| `og-image` | 1200×630 | Social-share card — **export as JPG** (some platforms don't read SVG) |

## For the sharpest, fastest result (optional)

- Export **WebP** or **JPG** at ~2000px on the long edge, quality ~80.
- Keep the file name; the site already lazy-loads everything below the hero and
  reserves the exact space, so pages never jump while images load.
- For true responsive `srcset`, export `name@1x`/`name@2x` and ask your AI assistant
  to wire them — the markup is ready for it.
