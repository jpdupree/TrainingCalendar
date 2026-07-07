# Sangre 2026 Training Dashboard

## What this is
A single-file training dashboard (`index.html`) hosted on GitHub Pages, used as a phone home-screen app. It covers Jason's Jul 6 – Nov 15, 2026 ultra season: Spartan Poconos → Spartan LATAM (CDMX) → Ragnar Rainier → Spartan NA Champs (Seattle, film only) → **Sangre de Cristo 100 (Sep 26–27, A-race, redemption after a mile-86 DNF in 2025)** → Spartan Blue Mountain (film only) → Rio del Lago 100 (Nov 7–8, fun race) → Cancun off week → Savage Race FL (film only).

Everything lives in `index.html`. No build step, no dependencies beyond Google Fonts. Keep it that way — single file is a hard requirement so it stays trivially hostable and phone-friendly.

## Architecture
- **Data**: the `W` array at the top of the `<script>` block. One object per week:
  - `n` (week number), `s`/`e` (start/end dates, `YYYY-MM-DD`, Monday–Sunday),
  - `ph` (phase: `recovery | build | peak | taper | race | bridge | off`),
  - `t` (title), `load` (0–100, drives ribbon bar height), `f` (focus/coaching note),
  - `d` (days): arrays of `[label, type, title, detail, chip?]`
    - `label` = `"Mon 7/6"` format (the M/D part drives today-highlighting — keep it accurate)
    - `type` = `run | vert | climb | rest | race | travel | night | long` (drives the colored dot via `DOTC`)
    - `chip` (optional) = `RACE` or `FILM` badge
- **Ribbon**: SVG generated from `W` (`load` = bar height, phase = color, `race`/`peak` phases get summit flags). Clicking a bar opens that week.
- **Countdowns**: hardcoded event list inside the `counters` IIFE — update it if races change.
- **Current week detection**: date-based; auto-expands and scrolls on load.
- **Notes**: per-week textarea persisted to `localStorage` under key `sangre26-notes` (`{w0: "...", w1: "..."}`), wrapped in try/catch. Never migrate or rename this key without writing a migration — his logged notes live there.

## Design system (do not drift)
- Dark theme only. Palette in `:root`: bg `#12141A`, cards `#1B1F27`/`#222733`, text `#E9E7E0`.
- Phase colors: recovery `#54B79A`, build `#E3A93C`, peak `#F07B3F`, taper `#6E96C9`, race `#E4584E`, bridge `#9B8FD6`, off `#8A8F9C`.
- Fonts: Barlow Condensed (display, uppercase), Barlow (body), IBM Plex Mono (dates/numbers).
- Flat surfaces, no gradients/shadows. Mobile-first (~380px), max-width 760px.
- Respect `prefers-reduced-motion`; keep visible focus styles; keep the SVG `aria-label` accurate if load values change.

## Likely tasks (in expected order)
1. **Mid-season plan adjustments** — after Poconos (Jul 11), CDMX (Aug 1), and especially Ragnar (Aug 21–22), Jason will report HRV/fatigue and request week edits. Edit only the affected `W` entries; keep `load` values honest so the ribbon stays truthful.
2. **Sangre contingency (week of Oct 19)** — if Sangre goes badly, weeks 16–18 get rewritten (RDL becomes social-pace, shorter, or dropped). The rule already in the footer: decide with data, not pride.
3. **Possible feature asks**: week-complete checkboxes, export notes, a post-Nov 15 winter-base block. Any new persisted state goes in its own localStorage key, try/catch-wrapped.
4. **Winter block (after Nov 15)** — extend `W` following the 2024–25 template: steady easy running, climbing 1–2x/week, progressive trail longs, explicitly guarding against the December post-race crater.

## Plan invariants (do not "optimize" these away)
- The biggest training weekend sits **five weeks** before Sangre (Ragnar), not two — that spacing is the fix for the 2025 DNF. Don't add big efforts to weeks 9–11.
- Seattle (Sep 19) and Blue Mountain (Oct 17) are **filming only, hike effort** — never turn them into workouts.
- Taper percentages (−35%, −55%, race week minimal) and the 3-week post-100 recovery structure are deliberate.
- Fueling target on all long efforts: 250–300 cal/hr. Night sessions exist to rehearse the second night at Sangre.

## Verification before committing
- `node --check` the extracted script block (or open the file and check console).
- Confirm day labels' M/D values match the week's actual dates (today-highlight depends on it).
- Load the page with devtools date override at a mid-plan date to confirm current-week detection and countdowns.
