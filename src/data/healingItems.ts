import {
  Shield,
  Gem,
  Waves,
  Mountain,
  Landmark,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type HealingCategory = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  // decorative gradient used for product/category art (no external images required)
  gradient: string;
};

export type HealingProduct = {
  id: string;
  category: string; // category id
  name: string;
  blessing: string;
  /** Display price, e.g. "₹5,100" */
  price: string;
  /** Numeric price used to pre-fill the order form */
  priceValue: number;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  includes: string[];
};

export const healingCategories: HealingCategory[] = [
  {
    id: "amulets",
    name: "Amulets",
    tagline: "Srungwa · Buddhist protective amulets",
    description:
      "Sacred protective amulets prepared according to Buddhist Astrology and Tantra — combining gold, silver, precious gemstones, medicinal herbs and powerful mantras.",
    icon: Shield,
    gradient:
      "linear-gradient(135deg, oklch(0.35 0.13 25), oklch(0.68 0.19 55))",
  },
  {
    id: "treasure-vase",
    name: "Treasure Vase",
    tagline: "Wealth & abundance vases",
    description:
      "Consecrated Treasure Vases (Terbum) filled with sacred substances to attract prosperity, abundance and auspicious energy to homes and businesses.",
    icon: Gem,
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.15 75), oklch(0.78 0.14 82))",
  },
  {
    id: "naga-vase",
    name: "Naga Vase",
    tagline: "Harmony with the water spirits",
    description:
      "Naga Vases (Lubum) prepared to restore harmony with the Naga spirits — traditionally offered for health, healing of skin ailments and environmental balance.",
    icon: Waves,
    gradient:
      "linear-gradient(135deg, oklch(0.45 0.12 220), oklch(0.68 0.12 200))",
  },
  {
    id: "earth-vase",
    name: "Earth Vase",
    tagline: "Blessing the land & foundations",
    description:
      "Earth Vases (Sabum) for pacifying local earth spirits and blessing land, foundations and new construction with stability and protection.",
    icon: Mountain,
    gradient:
      "linear-gradient(135deg, oklch(0.42 0.08 140), oklch(0.6 0.12 130))",
  },
  {
    id: "statues",
    name: "Statues",
    tagline: "Sacred Buddha & deity images",
    description:
      "Finely crafted statues of the Buddha, Bodhisattvas and Yidam deities — hand-finished and available for consecration as objects of daily practice.",
    icon: Landmark,
    gradient:
      "linear-gradient(135deg, oklch(0.5 0.13 45), oklch(0.72 0.16 65))",
  },
  {
    id: "thangkas",
    name: "Thangkas",
    tagline: "Traditional scroll paintings",
    description:
      "Hand-painted Thangkas depicting Buddhas, deities and mandalas — created by skilled artists using traditional mineral pigments and gold.",
    icon: ImageIcon,
    gradient:
      "linear-gradient(135deg, oklch(0.4 0.14 20), oklch(0.6 0.16 40))",
  },
  {
    id: "pendants",
    name: "Pendants",
    tagline: "Wearable blessings & protection",
    description:
      "Elegant pendants set with sacred images, mantras and gemstones — beautifully crafted for daily wear and continuous blessing.",
    icon: Sparkles,
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.16 320), oklch(0.72 0.15 350))",
  },
];

/** A tight, curated collection — presented in full e-commerce style. */
export const healingProducts: HealingProduct[] = [
  {
    id: "am-1",
    category: "amulets",
    name: "Five-Combined Protective Amulet",
    blessing: "Personally blessed by the Venerable Master",
    price: "₹5,100",
    priceValue: 5100,
    rating: 5.0,
    reviews: 214,
    badge: "Most Sacred",
    description:
      "Our flagship Srungwa — a five-combined protective amulet prepared according to Buddhist astrology and tantra, uniting gold, silver, precious gemstones, sacred medicinal substances and powerful mantras. Personally consecrated and blessed by Venerable Dr. Khen Rinpoche Sonam Gyurme for protection, auspiciousness and the fulfilment of positive aspirations.",
    includes: ["Consecrated by the Venerable Master", "Gold & silver with gemstone", "Sacred medicinal substances", "Care & wearing guidance"],
  },
  {
    id: "am-2",
    category: "amulets",
    name: "Personalized Yidam Amulet",
    blessing: "Crafted to your Lo, Kham, Parkha & Mewa",
    price: "₹11,000",
    priceValue: 11000,
    rating: 4.9,
    reviews: 96,
    badge: "Bespoke",
    description:
      "An individually prepared amulet based on your Marriage, Natal, Business and Planetary-Prediction astrology. Beautifully crafted in gold or silver with appropriate gemstones, containing a gold or coloured Thangka of your personal Yidam (meditational deity) and Auspicious Guardian Deity, combined with protective medicinal substances.",
    includes: ["Astrological consultation", "Personal Yidam Thangka", "Gold or silver casing", "Lifetime protection amulet"],
  },
  {
    id: "tv-1",
    category: "treasure-vase",
    name: "Golden Treasure Vase (Terbum)",
    blessing: "Attracts wealth & abundance",
    price: "₹8,500",
    priceValue: 8500,
    rating: 4.8,
    reviews: 63,
    badge: "Consecrated",
    description:
      "A consecrated Treasure Vase filled with sacred substances, mantras and precious materials to attract prosperity, abundance and auspicious energy. Traditionally placed in the home, business or shrine to draw continuous wealth and blessings.",
    includes: ["Filled & sealed by monks", "Sacred wealth substances", "Placement guidance", "Consecration prayers"],
  },
  {
    id: "st-1",
    category: "statues",
    name: "Gilded Shakyamuni Buddha Statue",
    blessing: "Hand-finished & ready for consecration",
    price: "₹15,000",
    priceValue: 15000,
    rating: 5.0,
    reviews: 41,
    badge: "Handcrafted",
    description:
      "A finely crafted, hand-finished statue of Shakyamuni Buddha, suitable as the central image of a home or monastery shrine. Available for traditional filling and consecration (rabne) on request.",
    includes: ["Hand-finished gilding", "Optional consecration", "Shrine placement guidance", "Certificate of authenticity"],
  },
  {
    id: "th-1",
    category: "thangkas",
    name: "Medicine Buddha Thangka",
    blessing: "For healing & well-being",
    price: "₹9,800",
    priceValue: 9800,
    rating: 4.9,
    reviews: 58,
    badge: "Hand-painted",
    description:
      "A hand-painted Thangka of the Medicine Buddha, created by skilled artists using traditional mineral pigments and gold. A powerful support for healing practice, recovery and well-being — a sacred heirloom for your shrine.",
    includes: ["Traditional mineral pigments", "Gold detailing", "Brocade mounting option", "Ready to hang & practice"],
  },
  {
    id: "pd-1",
    category: "pendants",
    name: "Auspicious Guardian Pendant",
    blessing: "Wearable blessing & protection",
    price: "₹3,600",
    priceValue: 3600,
    rating: 4.8,
    reviews: 132,
    badge: "Bestseller",
    description:
      "An elegant silver pendant set with a sacred image of your Auspicious Guardian Deity (Lucky God) and a protective mantra. Beautifully crafted for comfortable daily wear and continuous blessing.",
    includes: ["Silver with sacred image", "Protective mantra inlay", "Adjustable cord", "Blessed before dispatch"],
  },
];

export const amuletIntro = {
  title: "Special Buddhist Protective Amulets (Srungwa)",
  subtitle: "Prepared According to Buddhist Astrology & Tantra",
  paragraphs: [
    "According to the principles of Buddhist Astrology and Buddhist Tantra, BTMC has developed a special collection of sacred protective amulets (Srungwa) after many years of dedicated research and effort. These amulets are carefully prepared through the sacred combination of gold, silver, precious gemstones, medicinal herbs and powerful Buddhist mantras.",
    "The collection includes specially designed amulets for individuals involved in married life, business, social service and politics, as well as universal protective amulets suitable for everyone.",
    "According to the Marriage Astrology section of Buddhist Elemental Astrology, married couples and family guardians are advised to wear these protective amulets as spiritual remedies to minimize and overcome the harmful influences of planetary afflictions, misfortune, obstacles, poverty, family conflicts, deception, betrayal, enemies, separation and other adverse karmic conditions that may arise during life.",
    "Traditional Buddhist astrology explains that specially prepared Srungwa, made from sacred medicinal substances and spiritual materials and enclosed within specially crafted metals or gemstones, help transform negative astrological influences into positive qualities and auspicious conditions. Their purpose is to bring peace, happiness, prosperity and harmony into one's life.",
    "Since ancient times, countless people have benefited from these sacred amulets in their financial, material and spiritual lives. For several decades, BTMC has provided these protective amulets to thousands of individuals with remarkable success.",
    "Beginning this year, BTMC is pleased to offer an even more advanced collection of personalized protective amulets. Based on the guidance of Marriage Astrology, Natal Astrology (Birth Horoscope), Business Astrology and Planetary Prediction Astrology (Kegchi), each amulet is individually prepared according to the wearer's Lo, Kham, Parkha and Mewa (traditional Tibetan Buddhist astrological elements).",
    "Each amulet is beautifully crafted using gold or silver and appropriate gemstones, and contains either a gold Thangka or a colored Thangka of the wearer's personal Yidam (Meditational Deity) and Auspicious Guardian Deity (Lucky God). These sacred images are combined with carefully selected medicinal herbs and traditional protective substances to create a complete spiritual protection amulet.",
    "For the first time, these special amulets combine gold, silver, precious metals, gemstones, sacred medicinal substances and traditional protective ingredients together with sacred images of one's personal Yidam and Auspicious Guardian Deity. They are intended to help resolve difficulties in married life as well as problems arising in family, business, social and political life — beneficial and useful for everyone.",
    "Special attention has also been given to modern preferences. The amulets are designed with attractive shapes, elegant colors, beautiful craftsmanship and comfortable sizes, suitable for both young and elderly people. They are designed to be worn throughout one's lifetime and may also be placed in homes, vehicles, offices, businesses or other important locations for continuous spiritual protection and blessings.",
  ],
};
