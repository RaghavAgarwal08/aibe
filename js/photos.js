/* ==========================================================================
   AIBE — photos
   --------------------------------------------------------------------------
   The gallery on the home page is built from this list.

   While the list is empty the whole gallery section REMOVES ITSELF, so the
   site never shows empty picture frames. Add your first entry and the
   section appears on its own. You never touch index.html.

   One photo looks like this:

     {
       src:     "assets/photos/quad-day.jpg",   // required
       alt:     "Two students at the AIBE table on Quad Day",  // required
       caption: "Quad Day 2027",                // optional, shown under it
       wide:    false                           // optional, spans 2 columns
     }

   Rules of thumb:
     - Landscape, 3:2, about 1600x1067. Under ~400 KB each (see the README
       in assets/photos/ for how to shrink them).
     - alt text is not optional: it is what a blind member hears, and it is
       what shows if the file ever goes missing.
     - Get permission before putting someone's face on a public website.
   ========================================================================== */

const AIBE_PHOTOS = [

  // Delete this comment block and uncomment an entry once you have the file.
  //
  // { src: "assets/photos/quad-day.jpg",
  //   alt: "Students stopping at the AIBE table on the Quad",
  //   caption: "Quad Day", wide: true },
  //
  // { src: "assets/photos/workshop-01.jpg",
  //   alt: "A room of students with laptops open during a workshop",
  //   caption: "Week 3 — customer discovery" },
  //
  // { src: "assets/photos/hackathon.jpg",
  //   alt: "A team working together late in the day at the hackathon",
  //   caption: "Hackathon #1" },

];
