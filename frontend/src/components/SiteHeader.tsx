import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Mail, Heart, ChevronDown } from "lucide-react";
import logo from "@/assets/btmc-logo.jpg";

type NavLeaf = { to: string; label: string; desc?: string; hash?: string };
type NavItem = NavLeaf | { label: string; children: NavLeaf[] };

const nav: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/charity-events", label: "Charity Events" },
  {
    label: "Teachings",
    children: [
      { to: "/events", label: "Events & Retreats", desc: "Weekly retreats and Ngyungne" },
      { to: "/online-classes", label: "Online Classes", desc: "Dharma education courses" },
      { to: "/peace-prayers", label: "World Peace Prayers", desc: "Global prayer ceremonies" },
    ],
  },
  {
    label: "Healing Items",
    children: [
      { to: "/healing-items", label: "Amulets", desc: "Protective Srungwa amulets", hash: "amulets" },
      { to: "/healing-items", label: "Treasure Vase", desc: "Wealth & abundance vases", hash: "treasure-vase" },
      { to: "/healing-items", label: "Naga Vase", desc: "Harmony with water spirits", hash: "naga-vase" },
      { to: "/healing-items", label: "Earth Vase", desc: "Blessing land & foundations", hash: "earth-vase" },
      { to: "/healing-items", label: "Statues", desc: "Sacred Buddha & deity images", hash: "statues" },
      { to: "/healing-items", label: "Thangkas", desc: "Traditional scroll paintings", hash: "thangkas" },
      { to: "/healing-items", label: "Pendants", desc: "Wearable blessings & protection", hash: "pendants" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { to: "/services", label: "Services", desc: "Spiritual services we offer" },
      { to: "/projects", label: "Projects", desc: "Construction & community" },
      { to: "/dharma-campaign", label: "Dharma Ideal Campaign", desc: "Volunteer & sponsor" },
      { to: "/register", label: "Register", desc: "Sign up for retreats" },
    ],
  },
  {
    label: "Sponsorship",
    children: [
      { to: "/sponsors", label: "Event Sponsors", desc: "Sponsorship tiers" },
      { to: "/spiritual-trips", label: "Spiritual Trips", desc: "Pilgrimage journeys" },
      { to: "/support", label: "Support Us", desc: "Ways to contribute" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

function isGroup(item: NavItem): item is { label: string; children: NavLeaf[] } {
  return (item as any).children !== undefined;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      {/* Top strip */}
      <div className="bg-maroon text-cream text-xs">
        <div className="container-x flex items-center justify-between py-2 gap-4">
          <div className="hidden md:flex items-center gap-5 opacity-90">
            <span className="inline-flex items-center gap-1.5"><Phone className="size-3" /> +91-8178804502</span>
            <span className="inline-flex items-center gap-1.5"><Mail className="size-3" /> info@btmcfoundation.in</span>
          </div>
          <div className="flex items-center gap-4 ml-auto font-medium tracking-wide">
            <Link to="/support" className="hover:text-gold transition-colors hidden sm:inline">Become a Sponsor</Link>
            <span className="opacity-30 hidden sm:inline">|</span>
            <Link to="/register" className="hover:text-gold transition-colors">Sign Up</Link>
            <span className="opacity-30 hidden sm:inline">|</span>
            <Link to="/donate" className="inline-flex items-center gap-1 bg-gold text-maroon-deep px-3 py-1 rounded font-bold hover:brightness-95 transition">
              <Heart className="size-3 fill-current" /> Donate
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-x flex items-center justify-between py-4 gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="BTMC Foundation" className="size-12 object-contain" />
          <div className="leading-tight">
            <div className="font-display text-lg md:text-xl font-semibold text-maroon">BTMC Foundation</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">India</div>
          </div>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1 text-sm font-medium"
          onMouseLeave={() => setOpenGroup(null)}
        >
          {nav.map((item) =>
            isGroup(item) ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
              >
                <button
                  className="inline-flex items-center gap-1 px-3 py-2 rounded text-foreground/80 hover:text-maroon hover:bg-secondary transition-colors"
                  onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={`size-3.5 transition-transform ${openGroup === item.label ? "rotate-180" : ""}`} />
                </button>
                {openGroup === item.label && (
                  <div className="absolute left-0 top-full pt-2 w-72">
                    <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          hash={child.hash}
                          onClick={() => setOpenGroup(null)}
                          className="block px-4 py-3 hover:bg-secondary border-b border-border/50 last:border-0"
                        >
                          <div className="font-medium text-maroon text-sm">{child.label}</div>
                          {child.desc && (
                            <div className="text-xs text-muted-foreground mt-0.5">{child.desc}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded text-foreground/80 hover:text-maroon hover:bg-secondary transition-colors"
                activeProps={{ className: "text-maroon" }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          className="lg:hidden p-2 text-maroon"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-3 grid gap-1">
            {nav.map((item) =>
              isGroup(item) ? (
                <div key={item.label} className="py-1">
                  <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.to}
                      hash={child.hash}
                      onClick={() => setOpen(false)}
                      className="block py-2 px-3 rounded hover:bg-secondary text-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="py-2 px-3 rounded hover:bg-secondary text-sm font-medium"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
