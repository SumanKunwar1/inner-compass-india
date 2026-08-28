/**
 * Static copy for the membership and sponsorship pages.
 *
 * The plans themselves (tiers, fees, benefits) live in the database and are edited
 * from Admin -> Membership & Sponsorship; see lib/sponsorshipStore.ts. Only the
 * surrounding page text that has no reason to be editable lives here.
 */

/* ------------------------------------------------------------------ *
 * Official BTMC / Dharma Ideal websites
 * ------------------------------------------------------------------ */

export type NetworkSite = {
  label: string;
  region: string;
  href: string;
  description: string;
};

export const networkSites: NetworkSite[] = [
  {
    label: "btmcfoundation.in",
    region: "India",
    href: "https://btmcfoundation.in/",
    description: "BTMC Foundation India — retreats, charity events and healing items.",
  },
  {
    label: "btmcfoundation.org",
    region: "Nepal",
    href: "https://btmcfoundation.org/",
    description: "BTMC Foundation Nepal — the Foundation's Nepal presence, serving globally.",
  },
  {
    label: "dharmaideal.org",
    region: "Dharma Ideal",
    href: "https://dharmaideal.org/",
    description: "Dharma Ideal — sponsorship programmes, Dharma TV and media initiatives.",
  },
];

export const DHARMA_IDEAL_URL = "https://dharmaideal.org/";

/* ------------------------------------------------------------------ *
 * BTMC Foundation Paid Membership Plan
 * ------------------------------------------------------------------ */

export const commonMemberFacilities = [
  "Access to the weekly meditation retreat program",
  "Access to the annual Intensive Ngyungne retreat",
  "Community and networking facilities",
  "Educational workshops and seminars",
  "Skill-development and career-oriented programs",
  "Entrepreneurship and professional networking opportunities",
  "Volunteer and social-service opportunities",
  "Awareness and community-development programs",
  "Mentorship and guidance sessions",
  "Member recognition and appreciation programs",
  "Digital communication and member updates",
  "Selected discounts or concessions on Foundation programs",
  "Participation in Foundation campaigns and initiatives",
];

export const membershipTerms = [
  "Membership is subject to approval and the rules of BTMC Foundation.",
  "Membership benefits depend on the member's selected category.",
  "Certain facilities, discounts, events, and programs may be subject to availability.",
  "Membership does not guarantee employment, financial returns, business contracts, government benefits, or any other commercial outcome.",
  "Membership fees are to be used in accordance with the Foundation's applicable policies and legal requirements.",
  "The Foundation may modify facilities, benefits, membership categories, and fees when necessary.",
  "Membership may be suspended or cancelled for violation of Foundation rules or applicable law.",
  "Members are expected to maintain respectful and ethical conduct while representing BTMC Foundation.",
];

/** Corporate well-being programme — offered alongside corporate sponsorship. */
export const corporateWellbeing = {
  audiences: ["Corporate leaders", "Managers", "Employees", "Staff", "Workers", "Employees' families"],
  topics: [
    "Meditation",
    "Mindfulness",
    "Stress Management",
    "Compassion",
    "Ethical Leadership",
    "Positive Thinking",
    "Emotional Balance",
    "Workplace Harmony",
    "Buddhist Wisdom",
  ],
  masterVisit: [
    "Blessings",
    "Meditation sessions",
    "Spiritual teachings",
    "Peace and harmony programs",
    "Employee well-being programs",
    "Corporate family blessings",
  ],
};

export const sponsorshipDisclaimer =
  "Terms and conditions may apply. Specific services may be subject to scheduling, availability, geographical limitations, and applicable program guidelines.";
