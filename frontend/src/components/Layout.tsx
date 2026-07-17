import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative bg-maroon text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))" }}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--saffron) 0%, transparent 40%)",
      }} />
      <div className="container-x relative py-20 md:py-28 text-center">
        {eyebrow && <span className="eyebrow text-gold">{eyebrow}</span>}
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 mb-4">{title}</h1>
        {subtitle && <p className="max-w-2xl mx-auto text-cream/80 text-lg">{subtitle}</p>}
        <div className="mx-auto mt-6 h-px w-24 bg-gold" />
      </div>
    </section>
  );
}
