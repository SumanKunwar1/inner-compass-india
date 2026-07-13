import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Phone, ChevronDown, Star, Eye, ShoppingBag, CheckCircle2, Truck, BadgeCheck } from "lucide-react";
import { healingCategories, healingProducts, amuletIntro, type HealingProduct } from "@/data/healingItems";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";

export const Route = createFileRoute("/healing-items")({
  head: () => ({
    meta: [
      { title: "Healing Items — Sacred Amulets, Vases, Statues & Thangkas | BTMC Foundation India" },
      { name: "description", content: "Explore BTMC's sacred healing items — protective amulets (Srungwa), treasure vases, naga vases, earth vases, statues, thangkas and pendants, prepared according to Buddhist astrology and tantra." },
    ],
  }),
  component: HealingItems,
});

type DialogMode = { product: HealingProduct; mode: "details" | "buy" } | null;

function HealingItems() {
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [dialog, setDialog] = useState<DialogMode>(null);

  const catName = (id: string) => healingCategories.find((c) => c.id === id)?.name ?? "";
  const catGradient = (id: string) => healingCategories.find((c) => c.id === id)?.gradient ?? "";

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden text-cream" style={{ background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))" }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 85% 75%, var(--saffron) 0%, transparent 40%)" }} />
        <div className="container-x relative py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow text-gold">Sacred Healing Items</span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 leading-[1.05]">
              Blessed objects for <em className="text-gold not-italic">protection, healing & prosperity</em>
            </h1>
            <p className="mt-5 text-lg text-cream/90 max-w-2xl">
              Amulets, vases, statues, thangkas and pendants — each prepared and consecrated according to
              Buddhist astrology and tantra, through many years of dedicated research by BTMC.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-gold" /> Authentically consecrated</span>
              <span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-gold" /> Blessed by the Venerable Master</span>
              <span className="inline-flex items-center gap-2"><Truck className="size-4 text-gold" /> Shipped worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="border-b border-border bg-card/60">
        <div className="container-x py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {healingCategories.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="group rounded-xl border border-border bg-card p-4 text-center hover:border-gold hover:shadow-[var(--shadow-soft)] transition">
                <div className="size-11 mx-auto rounded-lg grid place-items-center text-cream" style={{ background: c.gradient }}>
                  <c.icon className="size-5" />
                </div>
                <div className="mt-3 text-sm font-semibold text-maroon">{c.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collection — e-commerce grid */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <span className="eyebrow">Featured Collection</span>
              <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Sacred items, ready to bless your life</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">Each item is prepared with authentic materials and consecrated before dispatch. Tap a product to view details or order.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {healingProducts.map((p) => {
              const cat = healingCategories.find((c) => c.id === p.category)!;
              return (
                <article key={p.id} className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-gold hover:shadow-[var(--shadow-warm)] transition flex flex-col">
                  <button
                    onClick={() => setDialog({ product: p, mode: "details" })}
                    className="relative aspect-[4/3] grid place-items-center overflow-hidden text-left"
                    style={{ background: cat.gradient }}
                    aria-label={`View ${p.name}`}
                  >
                    <cat.icon className="size-16 text-cream/90 group-hover:scale-110 transition duration-500" strokeWidth={1.1} />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-cream text-maroon text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{p.badge}</span>
                    )}
                    <span className="absolute bottom-3 right-3 text-cream/85 text-xs uppercase tracking-widest">{cat.name}</span>
                    <span className="absolute inset-0 grid place-items-center bg-maroon-deep/0 group-hover:bg-maroon-deep/25 transition">
                      <span className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1.5 bg-cream text-maroon text-xs font-semibold px-3 py-2 rounded-full">
                        <Eye className="size-4" /> Quick view
                      </span>
                    </span>
                  </button>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-gold-deep">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < Math.round(p.rating) ? "fill-current" : "opacity-30"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{p.rating.toFixed(1)} ({p.reviews})</span>
                    </div>
                    <h3 className="font-display text-xl text-maroon leading-snug mt-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex-1">{p.blessing}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-display text-2xl text-maroon">{p.price}</span>
                      <span className="text-xs text-muted-foreground">incl. blessing</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button onClick={() => setDialog({ product: p, mode: "details" })} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-semibold text-maroon hover:border-gold hover:bg-gold/10 transition">
                        <Eye className="size-4" /> Details
                      </button>
                      <button onClick={() => setDialog({ product: p, mode: "buy" })} className="btn-primary py-2.5 text-sm">
                        <ShoppingBag className="size-4" /> Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-x py-8 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { i: BadgeCheck, t: "Authentically Consecrated", d: "Prepared & blessed by ordained monks" },
            { i: ShieldCheck, t: "Genuine Sacred Materials", d: "Gold, silver, gemstones & medicinal herbs" },
            { i: Truck, t: "Careful Worldwide Shipping", d: "Respectfully packed & insured" },
          ].map((f) => (
            <div key={f.t} className="flex flex-col items-center gap-2">
              <f.i className="size-7 text-gold-deep" />
              <div className="font-semibold text-maroon">{f.t}</div>
              <div className="text-sm text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category descriptions with anchors */}
      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Browse by Category</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Explore the full range</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {healingCategories.map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-28 flex gap-4">
                <div className="size-12 shrink-0 rounded-lg grid place-items-center text-cream" style={{ background: c.gradient }}>
                  <c.icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-maroon">{c.name}</h3>
                  <div className="text-xs uppercase tracking-widest text-gold-deep">{c.tagline}</div>
                  <p className="text-sm text-foreground/75 mt-2 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amulet introduction */}
      <section id="about-amulets" className="section-y scroll-mt-24 bg-secondary/40 border-y border-border">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <span className="eyebrow">An Introduction</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">{amuletIntro.title}</h2>
            <p className="mt-3 text-lg text-gold-deep font-display">{amuletIntro.subtitle}</p>
            <div className="ornament-divider" />
          </div>
          <div className="text-foreground/80 leading-relaxed space-y-4">
            {(showFullIntro ? amuletIntro.paragraphs : amuletIntro.paragraphs.slice(0, 4)).map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg font-display text-foreground/85" : ""}>{p}</p>
            ))}
          </div>
          {!showFullIntro && (
            <div className="text-center mt-8">
              <button onClick={() => setShowFullIntro(true)} className="inline-flex items-center gap-1.5 font-semibold text-maroon hover:text-gold-deep">
                Read the full introduction <ChevronDown className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
        <div className="container-x relative text-center">
          <Sparkles className="size-10 mx-auto text-gold mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Request a personalized amulet</h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/85">
            Each personalized amulet is prepared according to your Lo, Kham, Parkha and Mewa. Contact our
            team to begin your consultation and select the sacred materials for your protection amulet.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold">Enquire Now <ArrowRight className="size-4" /></Link>
            <a href="tel:+918178804502" className="btn-outline"><Phone className="size-4" /> +91-8178804502</a>
          </div>
        </div>
      </section>

      {/* Product dialog */}
      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {dialog && (
            dialog.mode === "details" ? (
              <ProductDetails
                product={dialog.product}
                catName={catName(dialog.product.category)}
                gradient={catGradient(dialog.product.category)}
                onBuy={() => setDialog({ product: dialog.product, mode: "buy" })}
              />
            ) : (
              <div>
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-widest text-gold-deep">{catName(dialog.product.category)}</div>
                  <h3 className="font-display text-2xl text-maroon">Order · {dialog.product.name}</h3>
                </div>
                <PaymentForm
                  context="Order"
                  itemLabel={`${dialog.product.name} — ${dialog.product.price}`}
                  fixedAmount={dialog.product.priceValue}
                  note="Complete your order by transferring the amount below and uploading your payment screenshot. We will confirm dispatch by email."
                />
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function ProductDetails({ product, catName, gradient, onBuy }: { product: HealingProduct; catName: string; gradient: string; onBuy: () => void }) {
  return (
    <div>
      <div className="relative aspect-[16/9] rounded-xl grid place-items-center overflow-hidden mb-5" style={{ background: gradient }}>
        <span className="absolute top-3 left-3 text-cream/85 text-xs uppercase tracking-widest">{catName}</span>
        {product.badge && (
          <span className="absolute top-3 right-3 bg-cream text-maroon text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{product.badge}</span>
        )}
        <Sparkles className="size-16 text-cream/90" strokeWidth={1.1} />
      </div>
      <div className="flex items-center gap-1 text-gold-deep">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`size-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
      </div>
      <h3 className="font-display text-3xl text-maroon mt-2">{product.name}</h3>
      <div className="font-display text-2xl text-maroon mt-1">{product.price} <span className="text-xs text-muted-foreground font-sans">incl. blessing</span></div>
      <p className="text-sm text-foreground/75 leading-relaxed mt-4">{product.description}</p>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
        {product.includes.map((x) => (
          <li key={x} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="size-4 text-gold-deep mt-0.5 shrink-0" />{x}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onBuy} className="btn-primary"><ShoppingBag className="size-4" /> Buy Now</button>
        <Link to="/contact" className="btn-outline" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>Ask a question</Link>
      </div>
    </div>
  );
}
