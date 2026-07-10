import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Mail, Heart } from "lucide-react";
import logo from "@/assets/logo-mark.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/events", label: "Events" },
  { to: "/peace-prayers", label: "World Peace Prayers" },
  { to: "/online-classes", label: "Online Classes" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/dharma-campaign", label: "Dharma Ideal Campaign" },
  { to: "/sponsors", label: "Event Sponsors" },
  { to: "/spiritual-trips", label: "Spiritual Trips" },
  { to: "/support", label: "Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
            <Link to="/support" className="hover:text-gold transition-colors">Become a Sponsor</Link>
            <span className="opacity-30">|</span>
            <Link to="/register" className="hover:text-gold transition-colors">Sign Up</Link>
            <span className="opacity-30 hidden sm:inline">|</span>
            <Link to="/register" className="hover:text-gold transition-colors hidden sm:inline">Sign In</Link>
            <span className="opacity-30 hidden sm:inline">|</span>
            <Link to="/contact" className="hover:text-gold transition-colors hidden sm:inline">Contact</Link>
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

        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-2.5 py-2 rounded text-foreground/80 hover:text-maroon hover:bg-secondary transition-colors"
              activeProps={{ className: "text-maroon" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          className="xl:hidden p-2 text-maroon"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <div className="container-x py-3 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded hover:bg-secondary text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
