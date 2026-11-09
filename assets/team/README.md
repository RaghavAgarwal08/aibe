# Team photos

Drop portraits here, then edit `team.html`.

- Format: JPG or WebP, portrait, roughly 800 × 1000 px, under ~300 KB.
- Name them simply: `president.jpg`, `secretary.jpg`, etc.

To fill in a person, find their `<article class="person">` block in `team.html` and:

1. Replace the `<span class="person__ph">…</span>` placeholder with:
   `<img src="assets/team/secretary.jpg" alt="Full Name, Secretary of AIBE" width="800" height="1000" loading="lazy">`
2. Replace `Name to be announced` with the name, and delete `data-placeholder`
   from that `<p class="person__name">` tag.
3. Optionally add a major line and the LinkedIn / Instagram links
   (an example of the markup is in the comment at the top of the people list).
