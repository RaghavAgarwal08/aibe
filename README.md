# AIBE — website

Static website for **AI for Business & Entrepreneurship (AIBE)** at the University of
Illinois Urbana–Champaign. No build step, no dependencies: plain HTML, one stylesheet,
one script.

```
index.html      Home
about.html      About us
programs.html   Workshops, project teams, hackathons, speakers
events.html     The calendar
team.html       Executive board (placeholders)
join.html       How to join + FAQ
sponsors.html   For companies — not in the main nav, linked from the footer
css/aibe.css    Design system (all colors, type and layout tokens)
js/aibe.js      Links config, scroll animations, hero animation, calendar
js/events.js    THE CALENDAR DATA — the file you edit most often
assets/         Logos generated from the brand sheet
```

## 1. The five-minute edits

Everything you'll change weekly lives at the **top of `js/aibe.js`**:

```js
const LINKS = {
  discord:    "",   // ← paste the Discord invite here
  instagram:  "",
  joinForm:   "",   // Google Form / Illinois Connection
  newsletter: "",
  email:      "aibe.uiuc@gmail.com",
  rso:        ""
};
```

Every Discord button, Instagram icon and interest-form link on every page reads from
this one object. A link left empty renders as a disabled button labelled
"Link coming soon" — nothing breaks.

## 2. The calendar

Everything on the Events page comes from **`js/events.js`**. You never touch
`events.html`.

Each event is one block:

```js
{
  date: "2027-02-04",   // YYYY-MM-DD
  start: "18:00",       // 24-hour
  end: "19:30",         // optional
  type: "workshop",     // workshop | speaker | hackathon | social | demo | info | trip
  title: "Mining Reddit for real customer pain",
  location: "Siebel 1404",
  blurb: "One or two sentences on what happens.",
  link: ""              // optional RSVP / signup URL
}
```

The page does the rest on its own:

- sorts by date, and splits upcoming from past against today
- groups by month and builds the filter chips from whatever types it finds
- picks the soonest event for the "Next up" card
- generates a downloadable `.ics` per event, and one for the whole semester

**The schedule that ships is a draft** built from the events plan — plausible
dates, every room marked TBA. While `AIBE_DRAFT = true` at the top of the file,
the page shows a "draft schedule" notice. Set it to `false` once dates and rooms
are real and the notice disappears.

Adding a new type of event: add it to `AIBE_EVENT_TYPES` at the bottom of the
file first, then use its key in an event.

## 3. The sponsors page

`sponsors.html` is aimed at companies, not students, so it is deliberately
**not in the main nav** — six nav items is already plenty and none of our
members need it. It is reachable from the footer of every page, a strip at the
bottom of the home page, the hackathon funding note on Programs, and the mentor
CTA on Team. When you email a company, send them the direct link.

Two things to set before you send it to anyone:

1. **The money.** The five tier amounts ($250 / $500 / $1,500 / $3,000 /
   $5,000+) are an opening proposal, not researched figures. The Treasurer
   should set real numbers against a real budget. The page already tells the
   reader they're negotiable, but they should still be numbers you'd defend.
2. **The partners section** says "This space is deliberately empty." Replace it
   with logos once you sign someone.

The "what sponsorship does not buy" section is taken from the constitution —
no endorsement, no rights to members' work, no implied University endorsement,
and nothing that funds an individual member's venture. Don't soften it to close
a deal; it's what keeps the club out of trouble with Student Engagement.

## 4. Team photos and names

See `assets/team/README.md`.

## 5. Hero video

The home page hero runs a generated animation built from the logo's trajectory motif
(the rising line and nodes from the mark, drawn live on a canvas).

To use real footage instead:

1. Put a looping clip at **`assets/hero.mp4`**.
2. In `index.html`, find the `HERO VIDEO` comment near the top and remove the
   `<!--` / `-->` around the `<source>` line.

The page cross-fades to the video once it can actually play and keeps the animation
as the fallback, so a broken or slow file never leaves you with an empty hero.

Aim for: 10–20 s silent loop, 1920×1080, H.264, under ~6 MB. Darker, slower footage
works best because text sits on top of it. Free sources: Pexels Videos, Coverr,
Mixkit. Avoid anything with people's faces you don't have permission for.

## 6. Social preview images

`og:image` is currently a relative path, which most social platforms won't resolve.
Once the site has a real URL, change the two `og:` tags at the top of each page to the
full address, e.g.
`<meta property="og:image" content="https://raghavagarwal08.github.io/aibe/assets/logo-lockup.png">`.

## 7. Publishing to GitHub Pages

The contents of this folder are the site root.

```bash
cd site
git init -b main
git add -A
git commit -m "AIBE website"
git remote add origin https://github.com/RaghavAgarwal08/aibe.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
branch → `main` / `(root)` → Save.**

The site goes live at `https://raghavagarwal08.github.io/aibe/`.

If you instead name the repo `RaghavAgarwal08.github.io`, it will live at
`https://raghavagarwal08.github.io/`. All paths in the site are relative, so either
works with no changes.

### A custom domain (optional)

Buy a domain, add a file called `CNAME` in this folder containing just the domain
(e.g. `aibe.illinois.community`), point a CNAME DNS record at
`raghavagarwal08.github.io`, and set the domain under Settings → Pages.

## 8. Previewing locally

```bash
cd site && python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Colors

Sampled from the logo. Defined once at the top of `css/aibe.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `--navy` | `#04264E` | Brand navy, headings, solid buttons |
| `--navy-deep` | `#02162E` | Hero and footer backgrounds |
| `--teal` | `#128673` | Brand teal, graphics, borders |
| `--teal-deep` | `#0E6F5F` | Teal for small text and buttons (6.1:1 on white) |
| `--teal-bright` | `#4FD1B2` | Teal on dark backgrounds (8.0:1 on navy) |

The site ships with light and dark appearances that follow the operating system
setting; dark values are in the `prefers-color-scheme` block of the same file.
