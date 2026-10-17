// All user-facing copy and links. Wire these strings in verbatim; do not rewrite copy in components.
// Style: plain, professional sentences. No em or en dashes.

import { coPresidents, officerCount } from "./officers";
import type { PhotoSlug } from "./photos";
import { totals } from "./results";

// A run of rich text. `accent: true` is supported by RichText but currently unused.
export type TextRun = { text: string; accent?: boolean };
// Manifesto segments can also be an inline photo pill.
export type ManifestoSegment = TextRun | { pill: PhotoSlug };

export type LinkItem = { label: string; href: string; external?: boolean };

export const site = {
  name: "Cupertino FBLA",
  shortName: "Tino FBLA",
  school: "Cupertino High School",
  city: "Cupertino, California",
  description:
    "The Cupertino High School chapter of Future Business Leaders of America. More than 100 members compete in business events, lead community projects, and place at the state and national level.",
  email: "tino.fbla@gmail.com",
  instagram: { label: "Instagram", handle: "@tino.fbla", href: "https://www.instagram.com/tino.fbla/" },
  tiktok: { label: "TikTok", handle: "@tino.fbla", href: "https://www.tiktok.com/@tino.fbla" },
  // Chapter promo video, transcoded from media-source/tino-fbla-promo-video.mov (4K original, 28 seconds).
  video: {
    src: "/video/chapter-video.mp4",
    webm: "/video/chapter-video.webm",
    poster: "/video/chapter-video-poster.jpg",
  },
  advisor: {
    name: "Mr. Aiden Hill",
    title: "Chapter advisor",
    teaches: "Teaches Principles of Business and International Business",
    email: "aiden_hill@fuhsd.org",
  },
  meetings: {
    when: "Every other Thursday, 1:30 to 2:10 PM",
    where: "Rooms 106 and 107, Cupertino High School",
  },
};

export const nav: { links: LinkItem[]; cta: LinkItem } = {
  links: [
    { label: "Compete", href: "/#compete" },
    { label: "Projects", href: "/#projects" },
    { label: "Results", href: "/results" },
    { label: "Team", href: "/team" },
  ],
  cta: { label: "Join", href: "/join" },
};

export const preloader = {
  left: "Cupertino FBLA",
};

const coPresidentNames = coPresidents.map((p) => p.name).join(" and ");

export const home = {
  meta: {
    title: "Cupertino FBLA | Future Business Leaders of America at Cupertino High School",
    description: site.description,
  },
  hero: {
    lines: [[{ text: "Preparing Cupertino students" }], [{ text: "to lead in business" }]] as TextRun[][],
    sub: "The Cupertino High School chapter of Future Business Leaders of America.",
    primaryCta: { label: "How to join", href: "/join" } as LinkItem,
    secondaryCta: { label: "View results", href: "/results" } as LinkItem,
    scrollCue: "Scroll",
    // Photo wall: 5 drifting columns on desktop; mobile shows columns 0, 2 and 4.
    // Each column holds one portrait so the masonry rhythm stays uneven.
    wall: [
      ["nlc-stage-trophy", "candid-profile", "bslc-homestead", "project-sliced"],
      ["chapter-anaheim", "nlc-trophies", "project-pink-lemonade", "nlc-website-design-stage"],
      ["nlc-handshake", "candid-focus", "slc-awards-stage", "nlc-applause"],
      ["nlc-san-antonio", "project-forged", "nlc-award-line", "chapter-maroon-blazers"],
      ["nlc-lineup", "nlc-trophies-kneel", "project-unlocked", "nlc-website-design-trophies"],
    ] as PhotoSlug[][],
  },
  manifesto: {
    segments: [
      { text: "Cupertino FBLA is a student organization focused on business, leadership, and competition." },
      { pill: "nlc-stage-trophy" },
      { text: "Members compete at the regional, state, and national level," },
      { pill: "project-sliced" },
      { text: "lead projects with local businesses and nonprofits," },
      { pill: "candid-profile" },
      { text: "and manage every part of the chapter, from the budget to conference travel." },
    ] as ManifestoSegment[],
    videoLabel: "Play with sound",
    videoTitle: "Cupertino FBLA chapter video",
    videoCaption: "Chapter promo video",
    videoDuration: "0:28",
  },
  stats: [
    { value: 100, suffix: "+", label: "active members" },
    { value: totals.all, suffix: "", label: "top ten finishes at regional, state, and national conferences since 2024" },
    { value: totals.firstPlace, suffix: "", label: "first place finishes, including a national title in 2024" },
    { value: 70, suffix: "+", label: "competitive events offered by FBLA" },
  ],
  pillars: {
    heading: [{ text: "What our members do" }] as TextRun[],
    intro: "Members compete in events, work on chapter projects, and can apply to serve as officers.",
    compete: {
      id: "compete",
      title: "Competition",
      line: "More than 70 events in four formats",
      body: "Members choose from objective tests, presentations, role plays, and production events, then advance from the Bay Section conference to State and Nationals. Officers lead preparation for each format.",
      formats: [
        { name: "Objective tests", events: ["Accounting", "Cybersecurity", "Data Science & AI", "Personal Finance", "Securities & Investments"] },
        { name: "Presentations", events: ["Business Plan", "Public Speaking", "Website Coding & Development", "Graphic Design"] },
        { name: "Role plays", events: ["Entrepreneurship", "Business Management", "Banking & Financial Systems", "Hospitality & Event Management"] },
        { name: "Production", events: ["Computer Applications", "Publication Design"] },
      ],
      photo: "nlc-stage-trophy" as PhotoSlug,
    },
    build: {
      id: "build",
      title: "Projects",
      line: "Chapter projects with local partners",
      body: "Project teams work with local businesses and nonprofits and present their results to FBLA judges.",
      cta: { label: "View projects", href: "/#projects" } as LinkItem,
      photos: ["project-sliced", "project-unlocked", "project-forged", "project-pink-lemonade"] as PhotoSlug[],
    },
    lead: {
      id: "lead",
      title: "Leadership",
      line: "Led entirely by students",
      body: `${officerCount} officers lead the chapter across seven departments. Officer applications open each spring.`,
      cta: { label: "Meet the officers", href: "/team" } as LinkItem,
      photo: "candid-profile" as PhotoSlug,
    },
  },
  projects: {
    id: "projects",
    heading: [{ text: "Chapter projects" }] as TextRun[],
    intro: "Each year, project teams address a need in our community and present their work at FBLA conferences.",
    endLine: "Interested in joining a project team?",
    endCta: { label: "How to join", href: "/join" } as LinkItem,
    items: [
      {
        name: "Project Pink Lemonade",
        year: 2024,
        result: "1st place internationally",
        body: "A breast cancer awareness campaign that educated our community and raised funds for research.",
        photo: "project-pink-lemonade" as PhotoSlug,
      },
      {
        name: "Project Forged",
        year: 2025,
        result: "3rd place internationally",
        body: "Expanded manufacturing education in the Bay Area through new partnerships and curriculum.",
        photo: "project-forged" as PhotoSlug,
      },
      {
        name: "Project Unlocked",
        year: 2025,
        result: "3rd place internationally",
        body: "Advocated for business regulation reforms that support small businesses.",
        photo: "project-unlocked" as PhotoSlug,
      },
      {
        name: "Project Sliced",
        year: 2025,
        result: "8th place internationally",
        body: "Business consulting and community events for Cicero’s Pizza, a local pizzeria.",
        photo: "project-sliced" as PhotoSlug,
      },
    ],
  },
  scoreboard: {
    heading: [{ text: "Recent results" }] as TextRun[],
    intro: `${totals.all} top ten finishes since 2024, including ${totals.national} at the National Leadership Conference.`,
    nationalLabel: "National placements",
    photo: "nlc-handshake" as PhotoSlug,
    tallies: [
      { label: "Bay Section 2025", conferenceIds: ["bslc-2025"] },
      { label: "State 2025", conferenceIds: ["slc-2025"] },
      { label: "State 2024", conferenceIds: ["slc-2024"] },
      { label: "Nationals 2024 and 2025", conferenceIds: ["nlc-2024", "nlc-2025"] },
    ],
    cta: { label: "View all results", href: "/results" } as LinkItem,
  },
  season: {
    heading: [{ text: "The competition season" }] as TextRun[],
    stops: [
      {
        when: "Fall",
        title: "Chapter meetings",
        body: "Members attend chapter meetings, choose their events, and begin preparing with officers.",
        photo: "candid-focus" as PhotoSlug,
      },
      {
        when: "Winter",
        title: "Bay Section Leadership Conference",
        body: "The first competition of the year and a chance for new members to gain experience.",
        photo: "bslc-homestead" as PhotoSlug,
      },
      {
        when: "Spring",
        title: "State Leadership Conference",
        body: "Competitive events, workshops, and networking at the Anaheim Convention Center.",
        photo: "slc-awards-stage" as PhotoSlug,
      },
      {
        when: "Summer",
        title: "National Leadership Conference",
        body: "Top state finishers compete for national titles and meet members from across the country.",
        photo: "nlc-san-antonio" as PhotoSlug,
      },
    ],
  },
  teamTeaser: {
    heading: [{ text: "Led by students" }] as TextRun[],
    body: `This year’s officer team is led by co-presidents ${coPresidentNames}.`,
    cta: { label: "Meet the officers", href: "/team" } as LinkItem,
  },
  alumni: {
    heading: [{ text: "From our alumni" }] as TextRun[],
    quotes: [
      {
        name: "Sam Ethan Matthew",
        school: "Carnegie Mellon University, Engineering",
        classYear: "Class of 2025",
        quote:
          "High school classes teach you different subjects, but FBLA is where you apply that knowledge to grow as a leader and changemaker. The experiences I had, from competing at conferences to leading projects that served our community, truly shaped who I am today.",
      },
      {
        name: "Sanskriti Jain",
        school: "UCLA",
        classYear: "Class of 2024",
        quote:
          "FBLA was such a core part of my high school experience, as being involved for 3 years taught me a lot about the business world and helped me build clarity around what I wanted my future to look like. Beyond that, FBLA connected me to so many people and spurred some of my favorite memories while teaching me so much about myself as well.",
      },
      {
        name: "Prashant Kondayapalepu",
        school: "University of Illinois Urbana-Champaign, Finance and Data Science",
        classYear: "Class of 2025",
        quote:
          "FBLA has taught me how to effectively present to real business professionals and has given me direct experience for my future career in business and computer science. Beyond that, FBLA has given me unforgettable friendships and memories, from the FBLA takeover at Universal Orlando to the all nighters we pulled at SLC, that I will cherish for the rest of my life.",
      },
    ],
  },
  joinCta: {
    heading: "Join Cupertino FBLA",
    body: "Membership is open to Cupertino High students in the business pathway.",
    primaryCta: { label: "How to join", href: "/join" } as LinkItem,
    secondaryCta: { label: "Email the officers", href: `mailto:${site.email}` } as LinkItem,
    photo: "nlc-trophies" as PhotoSlug,
  },
};

export const team = {
  meta: {
    title: "Officer Team",
    description: `Meet the ${officerCount} students leading Cupertino FBLA this school year, including co-presidents ${coPresidentNames}.`,
  },
  heading: [{ text: "Officer team" }] as TextRun[],
  intro: `Meet the ${officerCount} students who lead Cupertino FBLA this school year.`,
  photo: "nlc-san-antonio" as PhotoSlug,
  coPresidentsLabel: "Co-Presidents",
  departmentsLabel: "Departments",
  officersInDepartment: (count: number) => `${count} officers`,
  advisorLabel: "Chapter advisor",
  apply: {
    heading: "Officer applications",
    body: "Applications open each spring for the following school year.",
    cta: { label: "Contact the officers", href: `mailto:${site.email}?subject=Officer%20applications` } as LinkItem,
  },
};

export const resultsPage = {
  meta: {
    title: "Results",
    description: `${totals.all} top ten finishes at the Bay Section, State, and National Leadership Conferences since 2024.`,
  },
  heading: [{ text: "Competition results" }] as TextRun[],
  intro: `${totals.all} top ten finishes at the Bay Section, State, and National Leadership Conferences since 2024.`,
  photo: "nlc-trophies" as PhotoSlug,
  summary: [
    { label: "Top ten finishes", value: totals.all },
    { label: "First place finishes", value: totals.firstPlace },
    { label: "National placements", value: totals.national },
    { label: "State placements", value: totals.state },
  ],
  filterAllLabel: "All",
  filterGroupLabel: "Filter by conference",
  showing: (count: number) => `${count} placements`,
  tableHeaders: { place: "Place", event: "Event", members: "Members", conference: "Conference" },
  galleryHeading: [{ text: "Photos from recent conferences" }] as TextRun[],
  gallery: [
    "nlc-stage-trophy",
    "nlc-handshake",
    "nlc-lineup",
    "slc-awards-stage",
    "nlc-applause",
    "nlc-award-line",
    "nlc-trophies-kneel",
    "nlc-website-design-trophies",
  ] as PhotoSlug[],
};

export const joinPage = {
  meta: {
    title: "Join",
    description: "How to join Cupertino FBLA, including eligibility, meeting times, and answers to common questions.",
  },
  heading: [{ text: "Join Cupertino\u00a0FBLA" }] as TextRun[],
  intro: "Membership is open to Cupertino High students in the business CTE pathway.",
  photo: "chapter-maroon-blazers" as PhotoSlug,
  primaryCta: { label: "Email the officers", href: `mailto:${site.email}` } as LinkItem,
  secondaryCta: { label: `Follow ${site.instagram.handle}`, href: site.instagram.href, external: true } as LinkItem,
  meetingLabels: { when: "When", where: "Where" },
  stepsHeading: [{ text: "Getting started" }] as TextRun[],
  steps: [
    {
      title: "Attend a meeting",
      body: "Meetings are held every other Thursday from 1:30 to 2:10 PM in Rooms 106 and 107.",
    },
    {
      title: "Enroll in the business pathway",
      body: "Take Principles of Business or International Business.",
    },
    {
      title: "Choose your events",
      body: "Compete in tests, presentations, role plays, or production events. Members who do not compete can join projects, business tours, and speaker events.",
    },
  ],
  speakersLine: "Past guest speakers include Tanay Tandon, CEO of Commure, and Sriharsha Guduguntla, CEO of HyperBound AI.",
  faqHeading: [{ text: "Frequently asked questions" }] as TextRun[],
  faqs: [
    {
      q: "What are the CTE requirements for FBLA?",
      a: "Members must be enrolled in or have completed the business CTE pathway, either Principles of Business or International Business. Freshmen and sophomores may take one gap year after completing their first class.",
    },
    {
      q: "What can I do in FBLA if I do not compete?",
      a: "Members who do not compete can attend business tours, guest speaker events, chapter meetings, and project events.",
    },
    {
      q: "Why do conferences cost so much?",
      a: "Conference costs include FBLA registration fees, hotel stays, and travel by bus or plane. In return, conferences are where members compete, network, and attend workshops.",
    },
  ],
  contact: {
    heading: "Contact us",
    body: "Email the officer team or message us on Instagram.",
    emailCta: { label: "Email the officers", href: `mailto:${site.email}` } as LinkItem,
  },
  support: {
    heading: "Support the chapter",
    body: "Cupertino FBLA is run by students and operates as a nonprofit. Donations and sponsorships fund chapter operations and member events.",
    cta: { label: "Ask about sponsorship", href: `mailto:${site.email}?subject=Supporting%20Cupertino%20FBLA` } as LinkItem,
  },
};

export const footer = {
  blurb: "The Cupertino High School chapter of Future Business Leaders of America.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Results", href: "/results" },
        { label: "Team", href: "/team" },
        { label: "Join", href: "/join" },
      ] as LinkItem[],
    },
    {
      title: "Follow",
      links: [
        { label: "Instagram", href: site.instagram.href, external: true },
        { label: "TikTok", href: site.tiktok.href, external: true },
      ] as LinkItem[],
    },
    {
      title: "Contact",
      links: [
        { label: site.email, href: `mailto:${site.email}` },
        { label: `Advisor: ${site.advisor.name}`, href: `mailto:${site.advisor.email}` },
      ] as LinkItem[],
    },
  ],
  legal: `© ${new Date().getFullYear()} Cupertino High School FBLA`,
  backToTop: "Back to top",
};

export const notFound = {
  heading: "Page not found",
  body: "The page you are looking for does not exist or has moved.",
  cta: { label: "Return home", href: "/" } as LinkItem,
};

export const transitions = {
  skipLink: "Skip to content",
  menuOpen: "Open menu",
  menuClose: "Close menu",
};
