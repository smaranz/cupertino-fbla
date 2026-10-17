// Alt text and captions for every photo used on the site.
// Image files live in src/assets/photos/<slug>.jpg (generated from media-source/).

export const photoSlugs = [
  "chapter-anaheim",
  "slc-awards-stage",
  "candid-profile",
  "candid-focus",
  "nlc-san-antonio",
  "nlc-lineup",
  "nlc-applause",
  "nlc-trophies",
  "nlc-trophies-kneel",
  "nlc-stage-trophy",
  "nlc-handshake",
  "nlc-award-line",
  "project-pink-lemonade",
  "project-forged",
  "project-unlocked",
  "project-sliced",
  "bslc-homestead",
  "chapter-maroon-blazers",
  "nlc-website-design-stage",
  "nlc-website-design-trophies",
] as const;

export type PhotoSlug = (typeof photoSlugs)[number];

export type PhotoMeta = {
  alt: string;
  caption?: string;
};

export const photoMeta: Record<PhotoSlug, PhotoMeta> = {
  "chapter-anaheim": {
    alt: "More than 100 Cupertino FBLA members in suits outside the Anaheim Convention Center",
    caption: "State Leadership Conference, Anaheim",
  },
  "slc-awards-stage": {
    alt: "Dozens of Cupertino FBLA members on stage holding award plaques at the State Leadership Conference",
    caption: "State Leadership Conference, Anaheim",
  },
  "candid-profile": {
    alt: "A Cupertino FBLA member in a suit at a conference, photographed in profile",
  },
  "candid-focus": {
    alt: "A Cupertino FBLA member in glasses and a suit at a conference",
  },
  "nlc-san-antonio": {
    alt: "Cupertino FBLA national qualifiers outside the Henry B. González Convention Center in San Antonio",
    caption: "National Leadership Conference, San Antonio",
  },
  "nlc-lineup": {
    alt: "Cupertino FBLA members lined up on stage during the national awards ceremony",
    caption: "National Leadership Conference",
  },
  "nlc-applause": {
    alt: "Two Cupertino FBLA members applauding on stage at the National Leadership Conference",
    caption: "National Leadership Conference",
  },
  "nlc-trophies": {
    alt: "Cupertino FBLA members holding glass trophies after the national awards",
    caption: "National Leadership Conference",
  },
  "nlc-trophies-kneel": {
    alt: "Cupertino FBLA award winners posing with their trophies at the National Leadership Conference",
    caption: "National Leadership Conference",
  },
  "nlc-stage-trophy": {
    alt: "Cupertino FBLA members in green ties on stage with a trophy at the National Leadership Conference",
    caption: "National Leadership Conference",
  },
  "nlc-handshake": {
    alt: "Two Cupertino FBLA members accepting a trophy from national officers on stage",
    caption: "National Leadership Conference",
  },
  "nlc-award-line": {
    alt: "Award winners holding trophies on stage at the National Leadership Conference",
    caption: "National Leadership Conference",
  },
  "project-pink-lemonade": {
    alt: "Students working on Project Pink Lemonade, a breast cancer awareness campaign",
  },
  "project-forged": {
    alt: "Two members of the Project Forged team next to a 3D printer",
  },
  "project-unlocked": {
    alt: "The Project Unlocked team with a community leader",
  },
  "project-sliced": {
    alt: "The Project Sliced team holding a check from Cicero's Pizza",
  },
  "bslc-homestead": {
    alt: "Cupertino FBLA members at the Bay Section Leadership Conference",
    caption: "Bay Section Leadership Conference",
  },
  "chapter-maroon-blazers": {
    alt: "Cupertino FBLA members in maroon blazers outside the Anaheim Convention Center",
    caption: "Anaheim Convention Center",
  },
  "nlc-website-design-stage": {
    alt: "The Website Design award presentation on stage at the National Leadership Conference",
    caption: "National Leadership Conference",
  },
  "nlc-website-design-trophies": {
    alt: "Three Cupertino FBLA members holding national trophies",
    caption: "National Leadership Conference",
  },
};
