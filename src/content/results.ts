// Source of truth: the "Past Winners" data from the previous chapter site
// (cupertino-fbla-site.lovable.app). Member names are shortened (first name + last initial)
// exactly as the chapter published them; casing and event names are normalized only.

export type ConferenceLevel = "National" | "State" | "Bay Section";

export type Conference = {
  id: string;
  short: string;
  name: string;
  year: number;
  level: ConferenceLevel;
};

export type Placement = {
  conferenceId: string;
  place: number;
  event: string;
  members: string[];
};

export const conferences: Conference[] = [
  { id: "nlc-2025", short: "NLC 2025", name: "National Leadership Conference", year: 2025, level: "National" },
  { id: "slc-2025", short: "SLC 2025", name: "State Leadership Conference", year: 2025, level: "State" },
  { id: "bslc-2025", short: "BSLC 2025", name: "Bay Section Leadership Conference", year: 2025, level: "Bay Section" },
  { id: "nlc-2024", short: "NLC 2024", name: "National Leadership Conference", year: 2024, level: "National" },
  { id: "slc-2024", short: "SLC 2024", name: "State Leadership Conference", year: 2024, level: "State" },
];

export const placements: Placement[] = [
  // National Leadership Conference 2025
  { conferenceId: "nlc-2025", place: 3, event: "American Enterprise Project", members: ["Kelly T", "Akshita G"] },
  { conferenceId: "nlc-2025", place: 8, event: "Partnership with Business Project", members: ["Rishan M", "Aarav M"] },

  // State Leadership Conference 2025
  { conferenceId: "slc-2025", place: 1, event: "Introduction to Public Speaking", members: ["Jaden W"] },
  { conferenceId: "slc-2025", place: 1, event: "Business Plan", members: ["Prashant K", "Jiansh G", "Tanish S"] },
  { conferenceId: "slc-2025", place: 1, event: "Partnership with Business Project", members: ["Ishan K", "Rishan M"] },
  { conferenceId: "slc-2025", place: 2, event: "Job Interview", members: ["Sam M"] },
  { conferenceId: "slc-2025", place: 2, event: "Digital Animation", members: ["Claire D"] },
  { conferenceId: "slc-2025", place: 2, event: "American Enterprise Project", members: ["Avani B", "Kelly T", "Akshita G"] },
  { conferenceId: "slc-2025", place: 2, event: "Computer Game Development", members: ["Prashant K", "Sam M"] },
  { conferenceId: "slc-2025", place: 3, event: "Help Desk", members: ["Neena V"] },
  { conferenceId: "slc-2025", place: 3, event: "Graphic Design", members: ["Sizzie Z", "Avani B", "Amrutha G"] },
  { conferenceId: "slc-2025", place: 4, event: "Data Analysis", members: ["Aaina T"] },
  { conferenceId: "slc-2025", place: 4, event: "Banking & Financial Systems", members: ["Aarav M", "Koshin G", "Raghav S"] },
  { conferenceId: "slc-2025", place: 5, event: "Introduction to Social Media Strategy", members: ["Siddhant J", "Diego A", "Surya R"] },
  { conferenceId: "slc-2025", place: 6, event: "Introduction to Parliamentary Procedures", members: ["Yash T"] },
  { conferenceId: "slc-2025", place: 6, event: "Website Coding & Development", members: ["Tanish N", "Bernard F"] },
  { conferenceId: "slc-2025", place: 7, event: "Introduction to Marketing Concepts", members: ["Jaden T"] },
  { conferenceId: "slc-2025", place: 7, event: "Client Service", members: ["Utkarsh M"] },
  { conferenceId: "slc-2025", place: 8, event: "Introduction to Parliamentary Procedures", members: ["Paarth V"] },
  { conferenceId: "slc-2025", place: 8, event: "UX Design", members: ["Arnav D"] },
  { conferenceId: "slc-2025", place: 8, event: "Future Business Educator", members: ["Nirvaan V"] },
  { conferenceId: "slc-2025", place: 8, event: "Local Chapter Annual Business Report", members: ["Vaishnavi K", "Manav C", "Tanish S"] },
  { conferenceId: "slc-2025", place: 9, event: "Organizational Leadership", members: ["Aadya K"] },
  { conferenceId: "slc-2025", place: 10, event: "Financial Math", members: ["Anushka S"] },
  { conferenceId: "slc-2025", place: 10, event: "Introduction to Financial Math", members: ["Stephen L"] },

  // Bay Section Leadership Conference 2025
  { conferenceId: "bslc-2025", place: 1, event: "Computer Applications", members: ["Stephen L"] },
  { conferenceId: "bslc-2025", place: 1, event: "Introduction to Public Speaking", members: ["Jaden W"] },
  { conferenceId: "bslc-2025", place: 1, event: "Job Interview", members: ["Sam Ethan M"] },
  { conferenceId: "bslc-2025", place: 1, event: "Introduction to Business Concepts", members: ["Tanish S"] },
  { conferenceId: "bslc-2025", place: 2, event: "Spreadsheet Applications", members: ["Eric Y"] },
  { conferenceId: "bslc-2025", place: 2, event: "Securities & Investments", members: ["Rithvik R"] },
  { conferenceId: "bslc-2025", place: 3, event: "Entrepreneurship", members: ["Jiansh G", "Ishan K", "Rishan M"] },
  { conferenceId: "bslc-2025", place: 3, event: "Health Care Administration", members: ["Jia-Wei C"] },
  { conferenceId: "bslc-2025", place: 4, event: "Marketing", members: ["Lucas C", "Akshat P", "Vivaan S"] },
  { conferenceId: "bslc-2025", place: 4, event: "Sales Presentation", members: ["Prashant K", "Utkarsh M", "Aarav M"] },
  { conferenceId: "bslc-2025", place: 5, event: "Financial Math", members: ["Anushka S"] },
  { conferenceId: "bslc-2025", place: 5, event: "Securities & Investments", members: ["Junlan W"] },
  { conferenceId: "bslc-2025", place: 6, event: "Introduction to Financial Math", members: ["Stephen L"] },
  { conferenceId: "bslc-2025", place: 8, event: "Business Law", members: ["Paarth V"] },
  { conferenceId: "bslc-2025", place: 8, event: "Business Management", members: ["Vashisht G", "Varshini M"] },
  { conferenceId: "bslc-2025", place: 8, event: "Securities & Investments", members: ["Arnav D"] },
  { conferenceId: "bslc-2025", place: 9, event: "Supply Chain Management", members: ["Rahul T"] },
  { conferenceId: "bslc-2025", place: 10, event: "Accounting I", members: ["Raghav S"] },
  { conferenceId: "bslc-2025", place: 10, event: "Introduction to Business Concepts", members: ["Jiansh G"] },

  // National Leadership Conference 2024
  { conferenceId: "nlc-2024", place: 1, event: "Community Service Project", members: ["Abhishek B", "Amrutha G", "Shauryan K"] },
  { conferenceId: "nlc-2024", place: 3, event: "American Enterprise Project", members: ["Sam Ethan M", "Prashant K", "Jiansh G"] },
  { conferenceId: "nlc-2024", place: 3, event: "Website Design", members: ["Brian K", "Abhinab C", "Prashant K"] },
  { conferenceId: "nlc-2024", place: 4, event: "Introduction to Business Procedures", members: ["Ishan K"] },

  // State Leadership Conference 2024
  { conferenceId: "slc-2024", place: 2, event: "Introduction to Business Concepts", members: ["Shauryan K"] },
  { conferenceId: "slc-2024", place: 2, event: "Website Coding & Development", members: ["Jimin L", "Sam Ethan M"] },
  { conferenceId: "slc-2024", place: 2, event: "Website Design", members: ["Brian K", "Abhinab C", "Prashant K"] },
  { conferenceId: "slc-2024", place: 2, event: "Local Chapter Annual Business Report", members: ["Michael F", "Shiva J"] },
  { conferenceId: "slc-2024", place: 4, event: "Introduction to Business Procedures", members: ["Ishan K"] },
  { conferenceId: "slc-2024", place: 4, event: "American Enterprise Project", members: ["Sam Ethan M", "Prashant K", "Avani B"] },
  { conferenceId: "slc-2024", place: 5, event: "International Business", members: ["Ved S"] },
  { conferenceId: "slc-2024", place: 5, event: "Networking Infrastructures", members: ["Prashant K"] },
  { conferenceId: "slc-2024", place: 7, event: "Cybersecurity", members: ["Aarush Y"] },
  { conferenceId: "slc-2024", place: 8, event: "Accounting I", members: ["Pragnya D"] },
  { conferenceId: "slc-2024", place: 8, event: "Insurance & Risk Management", members: ["Judy G"] },
  { conferenceId: "slc-2024", place: 9, event: "Agribusiness", members: ["Brian K"] },
  { conferenceId: "slc-2024", place: 10, event: "Securities & Investments", members: ["Rithvik R"] },
];

export function ordinal(place: number): string {
  const mod100 = place % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${place}th`;
  switch (place % 10) {
    case 1:
      return `${place}st`;
    case 2:
      return `${place}nd`;
    case 3:
      return `${place}rd`;
    default:
      return `${place}th`;
  }
}

export function conferenceById(id: string): Conference {
  const conference = conferences.find((c) => c.id === id);
  if (!conference) throw new Error(`Unknown conference: ${id}`);
  return conference;
}

export function placementsFor(conferenceId: string): Placement[] {
  return placements.filter((p) => p.conferenceId === conferenceId);
}

export const nationalPlacements: Placement[] = placements
  .filter((p) => conferenceById(p.conferenceId).level === "National")
  .sort((a, b) => a.place - b.place || conferenceById(b.conferenceId).year - conferenceById(a.conferenceId).year);

export const totals = {
  all: placements.length, // 61
  national: placements.filter((p) => conferenceById(p.conferenceId).level === "National").length, // 6
  state: placements.filter((p) => conferenceById(p.conferenceId).level === "State").length, // 36
  baySection: placements.filter((p) => conferenceById(p.conferenceId).level === "Bay Section").length, // 19
  firstPlace: placements.filter((p) => p.place === 1).length, // 8
};
