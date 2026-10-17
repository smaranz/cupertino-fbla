// Source of truth: "CHS FBLA ORG STRUCTURE 26-27.png" (Cupertino FBLA Officer Team 2026-27).
// Names and role titles are transcribed exactly from the org chart. Do not edit spellings.

export type Officer = {
  name: string;
  role: string;
};

export type OfficerGroup = {
  lead: Officer;
  deputies?: Officer[];
};

export type Department = {
  id: string;
  name: string;
  vp: Officer;
  groups: OfficerGroup[];
};

export const season = "2026-27";

export const coPresidents: Officer[] = [
  { name: "Jiansh Goel", role: "Co-President" },
  { name: "Tanish Savla", role: "Co-President" },
];

export const departments: Department[] = [
  {
    id: "projects",
    name: "Projects",
    vp: { name: "Amrutha Gundamalla", role: "VP of Projects" },
    groups: [
      {
        lead: { name: "Siddhant Jain", role: "CSP Lead" },
        deputies: [{ name: "Nishad Dheemate", role: "Deputy of CSP" }],
      },
      {
        lead: { name: "Zahra Sonaseth", role: "CEP Lead" },
        deputies: [{ name: "Nirvaan Vira", role: "Deputy of CEP" }],
      },
      {
        lead: { name: "Shrestha Nayak", role: "CRP Lead" },
        deputies: [{ name: "Andrew Adjiwibawa", role: "Deputy of CRP" }],
      },
    ],
  },
  {
    id: "conferences-programs",
    name: "Conferences & Programs",
    vp: { name: "Junlan Wang", role: "VP of Conferences & Programs" },
    groups: [
      {
        lead: { name: "Maaz Tapal", role: "Conferences & Programs Lead" },
        deputies: [{ name: "Khushi Vardi", role: "Conferences & Programs Deputy" }],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    vp: { name: "Hang Doan", role: "VP of Finance" },
    groups: [
      {
        lead: { name: "Yash Agrawal", role: "Finance Lead" },
        deputies: [{ name: "Aisha Kamdar", role: "Finance Deputy" }],
      },
    ],
  },
  {
    id: "member-relations",
    name: "Member Relations",
    vp: { name: "Rayna Shah", role: "VP of Member Relations" },
    groups: [
      {
        lead: { name: "Paarth Varshney", role: "Meetings Lead" },
        deputies: [{ name: "Paarth Sharma", role: "Deputy of Meetings" }],
      },
      { lead: { name: "Jenna Chang", role: "Graphics Lead" } },
      { lead: { name: "Robin Zhou", role: "Videographer Lead" } },
    ],
  },
  {
    id: "external-activities",
    name: "External Activities",
    vp: { name: "Vaishnavi Kamulaiahgari", role: "VP of External Activities" },
    groups: [
      {
        lead: { name: "Anish Phansalkar", role: "Alumni/Outreach Lead" },
        deputies: [{ name: "Kashvi Pradeep", role: "Deputy of Alumni/Outreach" }],
      },
      {
        lead: { name: "Rayaan Riyaz", role: "Fundraising Lead" },
        deputies: [{ name: "Gargi Panse", role: "Deputy of Fundraising" }],
      },
    ],
  },
  {
    id: "written-tests",
    name: "Written Tests",
    vp: { name: "Stephen Lin", role: "VP of Written Tests" },
    groups: [
      {
        lead: { name: "Krish Chidambaram", role: "Written Test Lead" },
        deputies: [{ name: "Isha Agarwal", role: "Deputy of Written Tests" }],
      },
      { lead: { name: "Meilin Zhu", role: "AI Development Co-Lead" } },
      { lead: { name: "Smaran Sandarsh", role: "AI Development Co-Lead" } },
    ],
  },
  {
    id: "presentations",
    name: "Presentations",
    vp: { name: "Jaden Wang", role: "VP of Presentations" },
    groups: [
      { lead: { name: "Jessica Gee", role: "Presentations Co-Lead" } },
      { lead: { name: "Jia Kaur", role: "Presentations Co-Lead" } },
      { lead: { name: "Ayeshwarya Sisodia", role: "Roleplay Lead" } },
    ],
  },
];

export function departmentMembers(department: Department): Officer[] {
  return [
    department.vp,
    ...department.groups.flatMap((group) => [group.lead, ...(group.deputies ?? [])]),
  ];
}

export const allOfficers: Officer[] = [
  ...coPresidents,
  ...departments.flatMap(departmentMembers),
];

export const officerCount = allOfficers.length; // 34
export const vicePresidentCount = departments.length; // 7
