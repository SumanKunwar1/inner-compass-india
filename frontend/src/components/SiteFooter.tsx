import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, Globe } from "lucide-react";
import logo from "@/assets/btmc-logo.jpg";
import { useSettings } from "@/lib/contentStore";

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, youtube: Youtube, linkedin: Linkedin, twitter: Twitter } as const;

export function SiteFooter() {
  const settings = useSettings();
  const socials = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
    .map((key) => ({ key, Icon: SOCIAL_ICONS[key], href: settings.socials[key] }))
    .filter((s) => s.href && s.href !== "#");
  return (
    <footer className="bg-maroon-deep text-cream mt-auto" style={{ background: "var(--maroon-deep)" }}>
      <div className="container-x py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="BTMC Foundation India" className="size-14 rounded-lg bg-white object-contain p-0.5" />
            <div>
              <div className="font-display text-xl">BTMC Foundation</div>
              <div className="text-xs uppercase tracking-[0.2em] opacity-70">India</div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Awakening Wisdom. Cultivating Compassion. Serving Humanity through
            authentic Buddhist teachings, meditation and charitable service.
          </p>
          <div className="flex gap-2 mt-6">
            {socials.map(({ Icon, href, key }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="size-9 grid place-items-center rounded-full border border-cream/20 hover:bg-gold hover:text-maroon-deep hover:border-gold transition"
                aria-label={key}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {[
              ["About Us", "/about"],
              ["Charity Events", "/charity-events"],
              ["Healing Items", "/healing-items"],
              ["Events", "/events"],
              ["Online Classes", "/online-classes"],
              ["Spiritual Trips", "/spiritual-trips"],
              ["Projects", "/projects"],
              ["Dharma Ideal Campaign", "/dharma-campaign"],
            ].map(([l, to]) => (
              <li key={to}><Link to={to} className="hover:text-gold">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Get Involved</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/register" className="hover:text-gold">Register for a Retreat</Link></li>
            <li><Link to="/donate" className="hover:text-gold">Donate Now</Link></li>
            <li><Link to="/support" className="hover:text-gold">Become a Sponsor</Link></li>
            <li><Link to="/sponsors" className="hover:text-gold">Event Sponsorship</Link></li>
            <li><Link to="/peace-prayers" className="hover:text-gold">World Peace Prayers</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Contact</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-3"><MapPin className="size-4 shrink-0 mt-0.5 text-gold" /><span>{settings.orgAddress}</span></li>
            {settings.orgPhones.map((p) => (
              <li key={p} className="flex gap-3"><Phone className="size-4 shrink-0 mt-0.5 text-gold" /><span>{p}</span></li>
            ))}
            <li className="flex gap-3"><Mail className="size-4 shrink-0 mt-0.5 text-gold" /><span>{settings.orgEmail}</span></li>
            <li className="flex gap-3"><Globe className="size-4 shrink-0 mt-0.5 text-gold" /><span>{settings.website}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} BTMC Foundation India. All rights reserved.</span>
            <Link to="/admin" className="hover:text-gold underline underline-offset-2">Admin</Link>
          </div>
          <div className="italic font-display text-sm">"May all beings be happy, may all beings be free from suffering."</div>
        </div>
      </div>
    </footer>
  );
}
