/**
 * Membership and sponsorship programmes.
 *
 * Content transcribed from the Foundation's official programme documents:
 *  - BTMC Foundation Paid Membership Plan
 *  - Become a Dharma Ideal Sponsor
 *  - Dharma Ideal Community and Corporate Sponsorship
 *
 * Fees live here as single constants so they can be corrected in one place.
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

export type MembershipTier = {
  id: string;
  name: string;
  fee: number;
  feeLabel: string;
  validity: string;
  /** Short line used on the card. */
  tagline: string;
  /** Name of the tier whose benefits this one builds on. */
  inherits?: string;
  benefits: string[];
  featured?: boolean;
};

export const membershipTiers: MembershipTier[] = [
  {
    id: "basic",
    name: "Basic Member",
    fee: 9,
    feeLabel: "₹9",
    validity: "1 Year",
    tagline: "Join the community and take part in Foundation programmes.",
    benefits: [
      "Official BTMC Foundation membership registration number.",
      "Access to member networking activities.",
      "Invitation to selected Foundation programs and events.",
      "Member newsletters and updates.",
      "Access to educational and awareness programs.",
      "Participation in community-service activities.",
      "Eligibility for member recognition programs.",
      "Basic guidance and information support.",
    ],
  },
  {
    id: "silver",
    name: "Silver Member",
    fee: 499,
    feeLabel: "₹499",
    validity: "1 Year",
    tagline: "Certificate, priority registration and skill-development access.",
    inherits: "Basic",
    benefits: [
      "Official BTMC Foundation membership certificate.",
      "Priority registration for selected events and workshops.",
      "Access to special member seminars and training sessions.",
      "Networking opportunities with Foundation members and professionals.",
      "Participation in selected skill-development programs.",
      "Member discounts on eligible Foundation-organized workshops/programs.",
      "Digital membership certificate.",
      "Recognition as a Silver Member at eligible Foundation events.",
    ],
  },
  {
    id: "gold",
    name: "Gold Member",
    fee: 1999,
    feeLabel: "₹1,999",
    validity: "1 Year",
    tagline: "Priority access, mentorship and leadership opportunities.",
    inherits: "Silver",
    featured: true,
    benefits: [
      "Priority access to Foundation events and programs.",
      "Complimentary/discounted access to selected training sessions.",
      "Professional and business networking opportunities.",
      "Mentorship and guidance sessions, where available.",
      "Eligibility for leadership and volunteer opportunities.",
      "Special recognition at Foundation programs.",
      "Invitation to selected members-only meetings and networking sessions.",
      "Opportunity to participate in Foundation initiatives and campaigns.",
    ],
  },
  {
    id: "premium",
    name: "Premium Member",
    fee: 4999,
    feeLabel: "₹4,999",
    validity: "1 Year",
    tagline: "Patron-level recognition, identity card and exclusive access.",
    inherits: "Gold",
    benefits: [
      "Premium membership identity card and certificate.",
      "Priority invitations to major Foundation events.",
      "Exclusive networking and interaction opportunities.",
      "Access to selected leadership/mentorship programs.",
      "Opportunity to support and participate in Foundation projects.",
      "Special recognition as a Premium/Patron Member.",
      "Invitation to selected VIP/member networking programs, subject to availability.",
      "Priority consideration for volunteering and project-support opportunities.",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Member",
    // The source document lists ₹19,999 in the categories table and ₹21,999 in the
    // detail section. The categories table is used here — confirm before launch.
    fee: 19999,
    feeLabel: "₹19,999",
    validity: "Lifetime",
    tagline: "Lifelong membership and standing recognition.",
    benefits: [
      "Lifetime membership status, subject to Foundation rules.",
      "Lifetime membership certificate/card.",
      "Access to applicable member programs and activities.",
      "Priority invitations to selected Foundation events.",
      "Networking opportunities within the BTMC Foundation community.",
      "Eligibility for recognition and leadership opportunities.",
      "Participation in community-development and social-impact initiatives.",
      "Special recognition as a Lifetime Member.",
    ],
  },
];

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

/* ------------------------------------------------------------------ *
 * Dharma Ideal Sponsorship — individual levels
 * ------------------------------------------------------------------ */

export type SponsorLevel = {
  id: string;
  name: string;
  fee: number;
  feeLabel: string;
  period: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
};

export const dharmaIdealLevels: SponsorLevel[] = [
  {
    id: "gem",
    name: "Dharma Ideal Gem Sponsor",
    fee: 499000,
    feeLabel: "₹4,99,000",
    period: "Lifetime",
    tagline: "Lifetime spiritual, religious, cultural & media benefits.",
    featured: true,
    benefits: [
      "Lifetime broadcast of greetings and congratulatory messages on television.",
      "Production of a family genealogy documentary.",
      "“Program Supported by” sponsorship title for one year.",
      "Funeral Ghewa Ceremony and 49th-Day Prayer Ceremony for a deceased family member, conducted free of charge.",
      "A 12-inch gold-plated statue presented as a gift.",
      "A special Sponsor Medal/Badge of Honor.",
      "A special Certificate of Honor.",
      "Special seating and recognition at seminars, conferences and important events.",
      "An official Sponsor Certificate.",
      "An official Sponsor ID Card.",
      "Access to comprehensive Puja and religious ritual services.",
      "Puja for the spiritual well-being, peace and liberation of ancestors and departed family members.",
      "Bardo prayers and readings conducted for deceased family members.",
      "Participation in Buddhist Initiation, Buddhist Teachings, Spiritual Training, Meditation Programs and Religious Retreats.",
      "Prayers, recitations and worship of family deities and protective deities.",
      "Special Sponsor ID Card and Certificate.",
      "Emergency/Special Puja Services available when required.",
      "Participation with family members in TV Phone-In Talk Shows and special television programs.",
    ],
  },
  {
    id: "decade",
    name: "Dharma Ideal Decade Sponsor",
    fee: 99000,
    feeLabel: "₹99,000",
    period: "10 Years",
    tagline: "Ten years of spiritual, religious, cultural & media benefits.",
    benefits: [
      "Greetings and congratulatory messages broadcast on television and social media for 10 years.",
      "Access to Puja, prayer and religious ritual services during the sponsorship period.",
      "Collective Bardo Thödol prayers and recitations in the name of deceased family members.",
      "Puja services for the peace, well-being and spiritual liberation of ancestors and family deities.",
      "Prayers, recitations and worship of family deities and protective deities for the family.",
      "Training in morning and evening Puja, prayer practices, meditation and spiritual practices.",
      "A special Sponsor Medal/Badge, ID Card and Certificate.",
      "A 12-inch half-gold-plated statue of the family deity/Ishtadevata.",
      "Participation in and attendance at television Talk Shows.",
      "Invitations to programs and events organized by BTMC and its television/media platforms.",
      "Emergency/Special Puja Services provided when required.",
      "Opportunity to receive Refuge Vows/Commitments, Buddhist Initiation and Buddhist Teachings.",
      "Participation in Buddhist Training Programs, Meditation Camps and Spiritual Retreats.",
    ],
  },
  {
    id: "annual",
    name: "Dharma Ideal Sponsor",
    fee: 9999,
    feeLabel: "₹9,999",
    period: "1 Year",
    tagline: "One year of spiritual, religious, cultural & media benefits.",
    benefits: [
      "Greetings and congratulatory messages broadcast on television and social media for one year.",
      "Access to Puja, prayer and religious ritual services during the membership period.",
      "Collective Bardo Thödol prayers and recitations in the name of deceased family members.",
      "Puja services for the peace, well-being and spiritual liberation of ancestors and family deities.",
      "Prayers, recitations and worship of family deities and protective deities for the entire family.",
      "Training in morning and evening Puja, prayer practices, meditation and spiritual practices.",
      "An official Sponsor ID Card and Certificate.",
      "Participation in and attendance at television Talk Shows.",
      "Invitations to programs and events organized by BTMC and its television/media platforms.",
      "Emergency/Special Puja Services provided when required.",
      "Opportunity to receive Refuge Vows/Commitments, Buddhist Initiation and Buddhist Teachings.",
      "Participation in Buddhist Training Programs, Meditation Camps and Spiritual Retreats.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Dharma Ideal Community & Corporate Sponsorship
 * ------------------------------------------------------------------ */

export type OrgSponsorship = {
  id: string;
  name: string;
  fee: number;
  feeLabel: string;
  feeNote: string;
  period: string;
  intro: string;
  suitableFor: string[];
  mediaBenefits: { title: string; detail: string }[];
  benefits: string[];
  recognition: string;
};

export const communitySponsorship: OrgSponsorship = {
  id: "community",
  name: "Dharma Ideal Community Sponsor",
  // Stated as ₹999,999 per sponsorship per year in the English document.
  fee: 999999,
  feeLabel: "₹9,99,999",
  feeNote: "per sponsorship, per year",
  period: "1 Year",
  intro:
    "Bring your members together, promote your culture, connect with Dharma TV and serve the community.",
  recognition: "Dharma TV Community Partner",
  suitableFor: [
    "Foundations and charitable organizations",
    "Cultural organizations and associations",
    "Buddhist organizations and communities",
    "Social service organizations",
    "Religious and spiritual organizations",
    "Professional and community associations",
    "Diaspora and international community groups",
    "Educational and cultural institutions",
    "Community clubs and member-based organizations",
  ],
  mediaBenefits: [
    {
      title: "Community Cultural Events on Dharma TV",
      detail:
        "Free live broadcasting or coverage of selected community cultural events, festivals, religious programs and social initiatives, subject to technical feasibility and prior approval.",
    },
    {
      title: "Community TV Program Slot",
      detail:
        "A designated Dharma TV program or airtime slot for the sponsored community, subject to the annual programming schedule.",
    },
    {
      title: "Community Live Talk Shows",
      detail:
        "Organize and take part in live television Talk Shows on community issues, cultural preservation, education, social awareness, Buddhist teachings, youth development and community welfare.",
    },
    {
      title: "Community Awareness Campaigns",
      detail:
        "Use Dharma TV and its media platforms for community awareness campaigns, public education, cultural promotion and social initiatives.",
    },
  ],
  benefits: [
    "One year of greetings and congratulatory messages on television for participating community members.",
    "“Program Supported by” Community Partner recognition for one year.",
    "Live television broadcasting or media coverage for selected community cultural events.",
    "A designated Dharma TV program or airtime slot for community-oriented programming.",
    "Produce and broadcast community awareness programs and live Talk Shows through Dharma TV.",
    "Promote the community's culture, traditions, festivals, educational activities, social services and initiatives.",
    "A 12-inch gold-plated statue presented as a community sponsorship gift.",
    "A special Community Sponsor Medal/Badge of Honor.",
    "A special Certificate of Honor for the sponsoring organization or community.",
    "An official Community Sponsor Certificate.",
    "Official Community Sponsor ID Cards for eligible participating members.",
    "Special seating and recognition at seminars, conferences, Dharma programs and cultural events.",
    "Access to comprehensive Puja and religious ritual services.",
    "Puja for the spiritual well-being, peace and liberation of ancestors and departed family members.",
    "Community members may join Buddhist Initiation, Buddhist Teachings, Spiritual Training, Meditation Programs and Religious Retreats.",
    "Group prayers, recitations and worship of family deities and protective deities for participating members.",
    "Special and emergency Puja services available when required.",
    "Community representatives and members may join Dharma TV Phone-In Talk Shows and special television programs.",
    "Invite community leaders, experts, spiritual teachers and representatives to Dharma TV discussions and awareness programs.",
    "Promote community welfare projects, charitable activities, educational programs and cultural preservation through Dharma TV.",
    "Community representatives may feature in special Dharma TV programs, interviews and documentaries.",
  ],
};

export const corporateSponsorship: OrgSponsorship = {
  id: "corporate",
  name: "Dharma Ideal Corporate Sponsor",
  fee: 24999,
  feeLabel: "₹24,999",
  feeNote: "per corporate organization, per year",
  period: "1 Year",
  intro:
    "Promote your brand, engage your community, develop your people and connect with Dharma TV.",
  recognition: "Dharma TV Corporate Partner",
  suitableFor: [
    "Companies and businesses",
    "Institutions and enterprises",
    "Corporate organizations",
  ],
  mediaBenefits: [
    {
      title: "Corporate Program on Dharma TV",
      detail:
        "Produce and run a dedicated corporate program highlighting your business, products, services, achievements, social responsibility initiatives, leadership and vision.",
    },
    {
      title: "Brand Promotion",
      detail:
        "Promote your brand identity, products and services, corporate achievements, CSR initiatives, community activities, events and campaigns across Dharma TV and associated media.",
    },
    {
      title: "Business Documentary",
      detail:
        "Production of a corporate/business documentary introducing your company's history, vision, products, services, leadership, achievements and social contributions.",
    },
    {
      title: "Corporate Talk Shows",
      detail:
        "Take part in or organize corporate Talk Shows, interviews, panel discussions and awareness programs.",
    },
  ],
  benefits: [
    "One year of broadcast opportunities for corporate greetings and congratulatory messages on television.",
    "Production of a business/corporate documentary.",
    "“Program Partner – Corporate Partner” recognition for one year.",
    "Corporate-related Puja and blessing ceremonies, subject to scheduling.",
    "Three 12-inch gold-plated statues presented as a corporate sponsorship gift.",
    "A special Corporate Partner Sponsor Medal/Badge of Honor.",
    "A special Corporate Certificate of Honor.",
    "Special seating and recognition at seminars, conferences, corporate events and Dharma programs.",
    "An official Corporate Sponsor ID Card.",
    "Access to comprehensive Puja and religious ritual services.",
    "Representatives and employees may attend Buddhist Initiation, Teachings, Spiritual Training, Meditation Programs and Retreats as special guests.",
    "Participation in Dharma TV awareness programs, Talk Shows, interviews and panel discussions.",
    "Present awards, prizes, certificates and medals at selected Dharma TV international programs, including the International Dharma Awards, Miss Bhrikuti Tara, Question of Wisdom, Tune of Dharma and Healing.",
    "Organize special corporate awareness and educational programs through Dharma TV.",
    "Buddhist teachings, meditation, mindfulness, ethical leadership and mind-training programs for leadership, employees, staff, workers and their families.",
    "Arrange special blessings and a spiritual visit by a qualified spiritual master to the corporate office.",
    "Special blessings, prayers and spiritual empowerment programs for the corporate family and employees.",
    "Emergency/Special Puja Services available when required.",
    "Representatives, employees and invited guests may join TV Phone-In Talk Shows and special television programs.",
    "Promote CSR activities, charitable initiatives, cultural programs and employee welfare through Dharma TV.",
    "Selected corporate events may receive Dharma TV coverage or live broadcasting.",
  ],
};

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
