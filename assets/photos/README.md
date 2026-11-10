# Photos

Drop photo files in this folder, then add them to `js/photos.js`. Nothing
else to edit.

While `AIBE_PHOTOS` in that file is empty, the gallery section on the home
page **deletes itself on load** — the site never shows an empty picture
frame. Add one entry and the section appears.

---

## The shot list

Hand this to whoever has a camera. Nine shots cover the whole site.

### Priority 1 — get these first

| Shot | Where it goes | What makes it work |
| --- | --- | --- |
| **Quad Day table** | Gallery (set `wide: true`) | Students actually stopping, not officers standing behind an empty table. Shoot from the side so you get both. |
| **A workshop, wide** | Gallery + PHOTO SLOT A (home) | From the back of the room. Laptops open, screens glowing, someone at the front. Says "hands-on" faster than any sentence. |
| **A workshop, close** | Gallery | Two people looking at one screen, pointing. Hands and faces, not the slide. |

### Priority 2 — after your first hackathon and demo day

| Shot | Where it goes | What makes it work |
| --- | --- | --- |
| **Hackathon, mid-afternoon** | Gallery | The messy middle: food containers, whiteboard, people deep in it. Not the tidy start. |
| **Demo day, from behind the crowd** | PHOTO SLOT E (sponsors) | A full room facing a presenter. This is the one a sponsor decides on. |
| **Someone presenting** | Gallery | The presenter mid-sentence with their build on screen behind them. |
| **A project team working** | PHOTO SLOT B (programs) | Three or four people around one table, something visible on a laptop. |

### Priority 3 — nice to have

| Shot | Where it goes | What makes it work |
| --- | --- | --- |
| **The exec board** | PHOTO SLOT D (team) | Outdoors, somewhere recognisably Illinois. Avoid the posed line-up against a wall. |
| **Officer portraits ×5** | Team page | See `assets/team/README.md` — those are portrait (4:5), these are landscape. |

---

## Specs

- **Landscape, 3:2** (e.g. 1600 × 1067). The frames crop to 3:2, so anything
  important near the edges can get cut.
- **Under ~400 KB each.** A phone photo is 3–6 MB; shrink it or the page gets
  slow on campus wifi.
- **JPEG** for photos. PNG is for the logo, not for pictures of people.
- Shoot **landscape**, not portrait, unless it's an officer headshot.

To shrink a photo on a Mac without installing anything:

```bash
sips -Z 1600 photo.jpg --out assets/photos/workshop-01.jpg
```

That resizes the long edge to 1600px. Check the result is under 400 KB with
`ls -lh assets/photos/`.

---

## Permission

Get it before a face goes on a public website.

- Say at the start of an event that you'll be taking photos for the website,
  and tell people how to opt out.
- Don't post a recognisable photo of someone who asked you not to.
- Be careful with whiteboards and laptop screens in the background — people's
  unreleased ideas and personal information end up in shots like these.

---

## Adding a photo

1. Put the file here, named plainly: `quad-day.jpg`, `workshop-01.jpg`.
2. Open `js/photos.js` and add an entry:

```js
{ src: "assets/photos/quad-day.jpg",
  alt: "Students stopping at the AIBE table on the Quad",
  caption: "Quad Day",
  wide: true }
```

3. Commit and push. That's it.

`alt` is required — it's what a blind member hears, and what shows if the file
goes missing. Describe what's happening, not "photo of AIBE".

`wide: true` makes a photo span two columns. Use it for one or two shots, not
all of them.

---

## Replacing the abstract art

Five places on the site use generated SVG art that a real photo should
eventually replace. Each is marked in the HTML with a comment saying
`PHOTO SLOT A` through `PHOTO SLOT E`. Search for `PHOTO SLOT` to find them.

To swap one: replace the `<img>` src, and change the wrapper's class from
`art art--pane` to just `art` so the photo fills the frame instead of sitting
inside it with padding. Keep `data-tilt` and it will still tilt toward the
cursor.
