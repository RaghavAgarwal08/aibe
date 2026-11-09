/* ==========================================================================
   AIBE — the calendar
   --------------------------------------------------------------------------
   This is the only file you edit to change what's on the Events page.
   Add, remove or reorder entries freely; the page sorts them by date, splits
   upcoming from past on its own, and builds the filters from whatever types
   it finds here.

   One event looks like this:

     {
       date:  "2027-02-04",      // YYYY-MM-DD, required
       start: "18:00",           // 24-hour, required
       end:   "19:30",           // 24-hour, optional
       type:  "workshop",        // workshop | speaker | hackathon | social |
                                 // demo | info | trip   (see TYPES below)
       title: "Short, specific title",
       location: "Room TBA",
       blurb: "One or two sentences on what happens and what you leave with.",
       link:  ""                 // optional: RSVP / signup URL
     }

   While DRAFT is true the page shows a "draft schedule" notice. Set it to
   false once the dates and rooms are real.
   ========================================================================== */

const AIBE_DRAFT = true;

const AIBE_EVENTS = [

  /* ---------------------------------------------------------- Fall 2026 -- */
  {
    date: "2026-11-19", start: "18:00", end: "19:00",
    type: "info",
    title: "Interest session: what AIBE is",
    location: "Room TBA",
    blurb: "What we're building, what a semester looks like, and how to get on a project team in the spring. Come with questions; leave on the Discord."
  },

  /* -------------------------------------------------------- Spring 2027 -- */
  {
    date: "2027-01-26", start: "18:00", end: "19:00",
    type: "info",
    title: "Spring info session",
    location: "Room TBA",
    blurb: "The same session again for everyone who joins in January, plus this semester's Project Slate."
  },
  {
    date: "2027-01-28", start: "18:00", end: "20:00",
    type: "social",
    title: "Kickoff social",
    location: "Room TBA",
    blurb: "Food, introductions and the first round of co-founder interviews. The easiest night of the semester to find the people you'll build with."
  },
  {
    date: "2027-02-04", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Mining Reddit, reviews and forums for real customer pain",
    location: "Room TBA",
    blurb: "Where the complaints already are. Pull them, cluster them with a model, and leave with a shortlist of problems worth solving."
  },
  {
    date: "2027-02-11", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Market research and customer discovery with AI",
    location: "Room TBA",
    blurb: "Sizing a market, writing interview scripts, and booking a real conversation with a stranger before you leave the room."
  },
  {
    date: "2027-02-16", start: "18:00", end: "19:30",
    type: "speaker",
    title: "Fireside: an Illinois alum who built an AI startup",
    location: "Room TBA",
    blurb: "The parts that don't make it into the press release. Speaker to be announced."
  },
  {
    date: "2027-02-18", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Stress-testing your idea: AI as the skeptical investor",
    location: "Room TBA",
    blurb: "Hand your idea to a model told to tear it apart, then answer it. The cheapest due diligence you'll ever run."
  },
  {
    date: "2027-02-25", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Creating MVPs: from described problem to clickable thing",
    location: "Room TBA",
    blurb: "The smallest version that lets a real person tell you you're wrong."
  },
  {
    date: "2027-02-27", start: "09:00", end: "21:00",
    type: "hackathon",
    title: "Hackathon #1",
    location: "Room TBA",
    blurb: "A full day. Food, API credits and GPU compute provided. Blank page to MVP and business model, pitches in the evening. Winning team gets funding and mentorship."
  },
  {
    date: "2027-03-04", start: "18:00", end: "19:30",
    type: "workshop",
    title: "AI marketing: positioning, copy and channel tests",
    location: "Room TBA",
    blurb: "Where a model genuinely helps, and where it just produces noise."
  },
  {
    date: "2027-03-11", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Pricing strategy: tiers, anchors and experiments",
    location: "Room TBA",
    blurb: "What to charge, how to find out, and why your first price is almost always too low."
  },
  {
    date: "2027-03-25", start: "18:00", end: "19:30",
    type: "speaker",
    title: "Panel: “AI in my job”",
    location: "Room TBA",
    blurb: "Product managers, consultants and analysts who use these tools daily. What has actually changed in their work, and what hasn't."
  },
  {
    date: "2027-04-01", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Workflow automation and connecting AI with MCP",
    location: "Room TBA",
    blurb: "Find the repetitive thing you do every week and delete it. Then wire a model into the tools you already use."
  },
  {
    date: "2027-04-08", start: "18:00", end: "19:30",
    type: "workshop",
    title: "Unit economics: are you actually making money?",
    location: "Room TBA",
    blurb: "The arithmetic founders avoid. Cost per customer, cost per user, and the point where the numbers stop working."
  },
  {
    date: "2027-04-10", start: "09:00", end: "21:00",
    type: "hackathon",
    title: "Hackathon #2",
    location: "Room TBA",
    blurb: "The second full-day build of the semester, run the same way as the first. Several project teams start here."
  },
  {
    date: "2027-04-15", start: "18:00", end: "19:30",
    type: "speaker",
    title: "Panel: what investors look for in AI startups",
    location: "Room TBA",
    blurb: "VCs on the difference between a demo and a company, and what is getting funded right now."
  },
  {
    date: "2027-04-17", start: "09:00", end: "18:00",
    type: "trip",
    title: "Field trip: AI company offices",
    location: "Meeting point TBA",
    blurb: "Out to the offices of a few AI companies. Roughly $40–50 toward transport from everyone who comes; entirely optional."
  },
  {
    date: "2027-04-22", start: "18:00", end: "21:00",
    type: "workshop",
    title: "Live build: a business from scratch in three hours",
    location: "Room TBA",
    blurb: "Officers at the front, no safety net, every decision made in the room. Idea to landing page to first outreach."
  },
  {
    date: "2027-04-29", start: "17:00", end: "20:00",
    type: "demo",
    title: "Demo Day",
    location: "Room TBA",
    blurb: "Every project team shows what it built to judges, mentors and members. The semester's funding decision lands here."
  }
];

/* Label, short code and ordering for each type. Add a type here first if you
   invent a new one. */
const AIBE_EVENT_TYPES = {
  workshop:  { label: "Workshop",   short: "Workshops" },
  speaker:   { label: "Speaker",    short: "Speakers" },
  hackathon: { label: "Hackathon",  short: "Hackathons" },
  social:    { label: "Social",     short: "Socials" },
  demo:      { label: "Demo Day",   short: "Demo Day" },
  info:      { label: "Info",       short: "Info sessions" },
  trip:      { label: "Field trip", short: "Field trips" }
};
