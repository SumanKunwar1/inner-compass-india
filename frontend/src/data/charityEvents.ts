import charityImg from "@/assets/charity.jpg";
import peaceImg from "@/assets/peace-prayer.jpg";
import retreatImg from "@/assets/meditation-retreat.jpg";
import pilgrimImg from "@/assets/pilgrimage.jpg";
import heroImg from "@/assets/hero-buddha.jpg";

export type CharitySession = {
  name: string;
  time: string;
  tone: string; // short subtitle
  donation: string;
  description: string;
  highlights: string[];
};

export type CharityEvent = {
  slug: string;
  city: string;
  country: string;
  title: string;
  tagline: string;
  status: "upcoming" | "past";
  /** When false, the event has no full detail page yet — show "Details coming soon". */
  detailsAvailable: boolean;
  date: string;
  dateShort: string;
  venue: string;
  venueNote: string;
  image: string;
  gallery?: { img: string; caption?: string; sub?: string }[];
  teacher: string;
  teacherTitle: string;
  videoUrl?: string; // embed url (YouTube)
  intro: string;
  overview: string[];
  /** Optional rich-text (HTML) body authored in the admin panel. Rendered in place of overview when present. */
  descriptionHtml?: string;
  sessions: CharitySession[];
  contacts: string[];
  email: string;
  website: string;
  supportsNote: string;
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
};

export const BANK_DETAILS = {
  bankName: "Bank of India · Salugara, Siliguri",
  accountName: "BTMC Foundation",
  accountNumber: "50782011000314",
  ifsc: "BKID0005078",
  branch: "Salugara, Siliguri",
};

export const charityEvents: CharityEvent[] = [
  {
    slug: "delhi-healing-meditation-dharma",
    city: "New Delhi",
    country: "India",
    title: "Healing, Meditation, Dharma Discourse & Charity Event",
    tagline: "A special one-day spiritual gathering for healing, blessings & inner peace",
    status: "upcoming",
    detailsAvailable: true,
    date: "Saturday, 22 August 2026",
    dateShort: "22 Aug 2026",
    venue: "Constitution Club of India",
    venueNote: "Near Patel Chowk Metro Station, New Delhi",
    image: charityImg,
    gallery: [
      { img: charityImg, caption: "Healing & Blessing Ceremony", sub: "Compassion in action" },
      { img: retreatImg, caption: "Guided Meditation Session", sub: "Cultivating inner peace" },
      { img: peaceImg, caption: "Dharma Discourse", sub: "Wisdom for everyday life" },
      { img: pilgrimImg, caption: "Community Gathering", sub: "Everyone is welcome" },
      { img: heroImg, caption: "Prayers & Purification", sub: "Blessings for all beings" },
    ],
    teacher: "Venerable Dr. Khen Rinpoche Sonam Gyurme",
    teacherTitle:
      "Main Abbot and Chairman of BTMC Foundation India & Dharma Television Nepal",
    videoUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
    intro:
      "Join us for a special spiritual gathering to help overcome unknown and unresolved negative energies, physical and mental health challenges, and difficulties in your career, business, relationships, education, marriage and personal growth.",
    overview: [
      "Discover inner peace, confidence, clarity, spiritual guidance and a renewed sense of purpose through healing, meditation and the wisdom of the Dharma.",
      "Our special one-day charity event features two unique sessions — a Morning Healing & Meditation Session and an Afternoon Long-Life, Health, Fortune & Prosperity Blessing Ceremony with Dharma Discourse.",
      "Everyone is warmly welcome.",
    ],
    sessions: [
      {
        name: "Morning Healing & Meditation Session",
        time: "9:00 AM – 12:00 PM",
        tone: "Buddhist healing, purification & inner peace",
        donation: "₹1,500 (Lunch Included)",
        description:
          "Dedicated to supporting individuals experiencing stress, anxiety, persistent negative thoughts, emotional challenges and other mental and emotional well-being concerns. Through authentic Buddhist healing, teachings and spiritual practices, participants are guided toward greater inner peace, emotional balance and spiritual growth. It also welcomes those who feel affected by negative energies or inauspicious karmic influences and seek purification through Dharma practice.",
        highlights: [
          "Ancient Buddhist Healing Practices",
          "Spiritual Empowerment & Blessings",
          "Confession & Purification Practices",
          "Energy Transmission",
          "Guided Meditation & Group Prayers",
          "Compassion & Loving-Kindness Practice",
          "Generosity, Merit-Making & Practical Dharma Teachings",
          "FREE Five-Combined Protective Amulet, personally blessed by the Venerable Master",
        ],
      },
      {
        name: "Afternoon Blessing Ceremony & Dharma Discourse",
        time: "12:30 PM – 3:00 PM",
        tone: "Long Life, Health, Fortune & Prosperity blessings",
        donation: "₹1,000 (Tea & Snacks Included)",
        description:
          "Receive the blessings of Long Life, Good Health, Fortune, Prosperity and Inner Well-being from Venerable Dr. Khen Rinpoche Sonam Gyurme. This inspiring session is ideal for students, professionals, entrepreneurs, business owners, corporate leaders, job seekers, couples and families seeking wisdom and guidance for career, business, education, relationships, marriage, finances and personal growth.",
        highlights: [
          "Long Life, Health, Fortune & Prosperity Blessings",
          "Inspiring Dharma Talk with practical guidance for everyday life",
          "Teachings on self-confidence, emotional balance & ethical leadership",
          "Wise decision-making for career, business & family",
          "FREE Five-Combined Protective Amulet, personally blessed by the Venerable Master",
        ],
      },
    ],
    contacts: ["+91-8178804502", "+91-7065277012"],
    email: "info@btmcfoundation.in",
    website: "www.btmcfoundation.in",
    supportsNote:
      "Your generous contribution supports the upcoming Weekly 2-Day Free Meditation Retreat Program at Kathmandu, Nepal.",
    bank: BANK_DETAILS,
  },
  {
    slug: "mumbai-healing-charity",
    city: "Mumbai",
    country: "India",
    title: "Healing, Meditation & Charity Gathering",
    tagline: "Blessings, healing meditation and compassionate service by the sea",
    status: "past",
    detailsAvailable: false,
    date: "Completed 2025",
    dateShort: "2025",
    venue: "Mumbai, Maharashtra",
    venueNote: "India",
    image: retreatImg,
    teacher: "Venerable Dr. Khen Rinpoche Sonam Gyurme",
    teacherTitle: "Main Abbot and Chairman of BTMC Foundation India",
    intro:
      "A blessed gathering of healing, meditation and Dharma teaching that brought together practitioners from across western India.",
    overview: [
      "Participants received healing blessings, guided meditation and practical Dharma guidance for daily life.",
    ],
    sessions: [],
    contacts: ["+91-8178804502"],
    email: "info@btmcfoundation.in",
    website: "www.btmcfoundation.in",
    supportsNote:
      "Proceeds supported free meditation retreats and humanitarian programs.",
    bank: BANK_DETAILS,
  },
  {
    slug: "kolkata-healing-charity",
    city: "Kolkata",
    country: "India",
    title: "Healing, Meditation & Charity Gathering",
    tagline: "A day of purification, prayer and loving-kindness",
    status: "past",
    detailsAvailable: false,
    date: "Completed 2025",
    dateShort: "2025",
    venue: "Kolkata, West Bengal",
    venueNote: "India",
    image: peaceImg,
    teacher: "Venerable Dr. Khen Rinpoche Sonam Gyurme",
    teacherTitle: "Main Abbot and Chairman of BTMC Foundation India",
    intro:
      "An inspiring gathering of Buddhist healing, meditation and compassion practice held in the heart of Kolkata.",
    overview: [
      "Participants experienced healing rituals, compassion practices and Dharma teachings for a calmer, more resilient mind.",
    ],
    sessions: [],
    contacts: ["+91-8178804502"],
    email: "info@btmcfoundation.in",
    website: "www.btmcfoundation.in",
    supportsNote:
      "Proceeds supported free meditation retreats and humanitarian programs.",
    bank: BANK_DETAILS,
  },
];

export const featuredCharityEvent = charityEvents[0];

export function getCharityEvent(slug: string) {
  return charityEvents.find((e) => e.slug === slug);
}
