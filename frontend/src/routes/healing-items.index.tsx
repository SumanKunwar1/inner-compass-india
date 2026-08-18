import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useMemo, useState } from "react";
import {
  ArrowRight, ShieldCheck, Sparkles, Phone, ChevronDown, Star, ShoppingBag,
  Truck, BadgeCheck, SlidersHorizontal, Search, X, PackageSearch, Loader2,
} from "lucide-react";
import { amuletIntro, coverImage, productHref, type HealingProduct, type HealingCategory } from "@/data/healingItems";
import { useProducts, useProductsLoaded, useCategories } from "@/lib/shopStore";

export const Route = createFileRoute("/healing-items/")({
  head: () => ({
    meta: [
      { title: "Healing Items — Sacred Amulets, Vases, Statues & Thangkas | BTMC Foundation India" },
      { name: "description", content: "Explore BTMC's sacred healing items — protective amulets (Srungwa), treasure vases, naga vases, earth vases, statues, thangkas and pendants, prepared according to Buddhist astrology and tantra." },
    ],
  }),
  component: HealingItems,
});

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "rating", label: "Highest rated" },
] as const;

const AVAILABILITY = [
  { value: "in-stock", label: "In stock" },
  { value: "made-to-order", label: "Made to order" },
  { value: "low-stock", label: "Only a few left" },
  { value: "out-of-stock", label: "Out of stock" },
];

function HealingItems() {
  const allProducts = useProducts();
  const loaded = useProductsLoaded();
  const categories = useCategories();
  const [showFullIntro, setShowFullIntro] = useState(false);

  /* ---------------- filter state ---------------- */
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedAvail, setSelectedAvail] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<string>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Unpublished products are fetched for the admin screens but must never show here.
  const products = useMemo(() => allProducts.filter((p) => p.published !== false), [allProducts]);

  const priceCeiling = useMemo(() => {
    const top = Math.max(0, ...products.map((p) => p.priceValue || 0));
    return top > 0 ? Math.ceil(top / 500) * 500 : 0;
  }, [products]);

  const countsByCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) m[p.category] = (m[p.category] ?? 0) + 1;
    return m;
  }, [products]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const activeCount =
    selectedCats.length + selectedAvail.length + (featuredOnly ? 1 : 0) +
    (maxPrice !== null ? 1 : 0) + (query.trim() ? 1 : 0);

  const clearAll = () => {
    setQuery(""); setSelectedCats([]); setSelectedAvail([]);
    setMaxPrice(null); setFeaturedOnly(false);
  };

  /* ---------------- filtering + sorting ---------------- */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (selectedAvail.length && !selectedAvail.includes(p.stockStatus ?? "in-stock")) return false;
      if (featuredOnly && !p.featured) return false;
      if (maxPrice !== null && (p.priceValue || 0) > maxPrice) return false;
      if (q) {
        const hay = [p.name, p.blessing, p.description, p.sku, ...(p.tags ?? [])]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const by: Record<string, (a: HealingProduct, b: HealingProduct) => number> = {
      featured: (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) ||
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      newest: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      "price-asc": (a, b) => (a.priceValue || 0) - (b.priceValue || 0),
      "price-desc": (a, b) => (b.priceValue || 0) - (a.priceValue || 0),
      "name-asc": (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
      rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0),
    };
    return [...list].sort(by[sort] ?? by.featured);
  }, [products, query, selectedCats, selectedAvail, featuredOnly, maxPrice, sort]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden text-cream" style={{ background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))" }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 85% 75%, var(--saffron) 0%, transparent 40%)" }} />
        <div className="container-x relative py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow text-gold">Sacred Healing Items</span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 leading-[1.05]">
              Blessed objects for <em className="text-gold not-italic">protection, healing &amp; prosperity</em>
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

      {/* Shop — filters + grid */}
      <section className="section-y">
        <div className="container-x">
          <div className="mb-8">
            <span className="eyebrow">Featured Collection</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Sacred items, ready to bless your life</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Each item is prepared with authentic materials and consecrated before dispatch.
              Use the filters to narrow the collection, then open a product for full details.
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* ---------- Filter panel ---------- */}
            <aside className="lg:sticky lg:top-28">
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className="lg:hidden w-full inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-maroon"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="size-4" /> Filters
                  {activeCount > 0 && <span className="bg-gold text-maroon-deep text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>}
                </span>
                <ChevronDown className={`size-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`${filtersOpen ? "block" : "hidden"} lg:block mt-3 lg:mt-0 space-y-5 rounded-2xl border border-border bg-card p-5`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg text-maroon inline-flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-gold-deep" /> Filters
                  </h3>
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-maroon inline-flex items-center gap-1">
                      <X className="size-3" /> Clear all
                    </button>
                  )}
                </div>

                {/* Search */}
                <div>
                  <FilterLabel>Search</FilterLabel>
                  <div className="relative mt-2">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search items…"
                      className="w-full pl-9 pr-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                {/* Categories — moved here from the header dropdown */}
                <div className="border-t border-border pt-5">
                  <FilterLabel>Category</FilterLabel>
                  <div className="mt-2 space-y-1">
                    {categories.filter((c) => c.visible !== false).map((c) => (
                      <label key={c.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(c.id)}
                          onChange={() => toggle(selectedCats, setSelectedCats, c.id)}
                          className="size-4 accent-[var(--maroon)] shrink-0"
                        />
                        <span className="size-6 rounded grid place-items-center text-cream shrink-0" style={{ background: c.gradient }}>
                          <c.icon className="size-3.5" />
                        </span>
                        <span className="text-sm text-foreground/85 group-hover:text-maroon flex-1">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{countsByCat[c.id] ?? 0}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                {priceCeiling > 0 && (
                  <div className="border-t border-border pt-5">
                    <FilterLabel>Maximum price</FilterLabel>
                    <input
                      type="range" min={0} max={priceCeiling} step={100}
                      value={maxPrice ?? priceCeiling}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full mt-3 accent-[var(--maroon)]"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>₹0</span>
                      <span className="font-semibold text-maroon">
                        {maxPrice === null ? "Any price" : `up to ₹${maxPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="border-t border-border pt-5">
                  <FilterLabel>Availability</FilterLabel>
                  <div className="mt-2 space-y-1">
                    {AVAILABILITY.map((a) => (
                      <label key={a.value} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAvail.includes(a.value)}
                          onChange={() => toggle(selectedAvail, setSelectedAvail, a.value)}
                          className="size-4 accent-[var(--maroon)] shrink-0"
                        />
                        <span className="text-sm text-foreground/85 group-hover:text-maroon">{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="border-t border-border pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox" checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="size-4 accent-[var(--maroon)] shrink-0"
                    />
                    <span className="text-sm text-foreground/85 group-hover:text-maroon">Featured items only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* ---------- Results ---------- */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <p className="text-sm text-muted-foreground">
                  {loaded ? (
                    <>Showing <span className="font-semibold text-maroon">{visible.length}</span> of {products.length} items</>
                  ) : "Loading collection…"}
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Sort by</span>
                  <select
                    value={sort} onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
              </div>

              {/* Active filter chips */}
              {activeCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedCats.map((id) => (
                    <Chip key={id} onClear={() => toggle(selectedCats, setSelectedCats, id)}>
                      {categories.find((c) => c.id === id)?.name ?? id}
                    </Chip>
                  ))}
                  {selectedAvail.map((v) => (
                    <Chip key={v} onClear={() => toggle(selectedAvail, setSelectedAvail, v)}>
                      {AVAILABILITY.find((a) => a.value === v)?.label ?? v}
                    </Chip>
                  ))}
                  {featuredOnly && <Chip onClear={() => setFeaturedOnly(false)}>Featured</Chip>}
                  {maxPrice !== null && <Chip onClear={() => setMaxPrice(null)}>Under ₹{maxPrice.toLocaleString("en-IN")}</Chip>}
                  {query.trim() && <Chip onClear={() => setQuery("")}>&ldquo;{query.trim()}&rdquo;</Chip>}
                </div>
              )}

              {!loaded ? (
                <div className="py-20 text-center text-muted-foreground">
                  <Loader2 className="size-8 mx-auto animate-spin text-gold-deep" />
                  <p className="mt-3 text-sm">Loading the collection…</p>
                </div>
              ) : visible.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-border rounded-2xl">
                  <PackageSearch className="size-10 mx-auto text-muted-foreground/50" />
                  <h3 className="font-display text-xl text-maroon mt-4">No items match these filters</h3>
                  <p className="text-sm text-muted-foreground mt-1">Try widening your search or clearing a filter.</p>
                  {activeCount > 0 && <button onClick={clearAll} className="btn-outline mt-6" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>Clear all filters</button>}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visible.map((p) => <ProductCard key={p.id} product={p} categories={categories} />)}
                </div>
              )}
            </div>
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

      {/* Category descriptions */}
      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Browse by Category</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Explore the full range</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {categories.filter((c) => c.visible !== false).map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-28 flex gap-4">
                <div className="size-12 shrink-0 rounded-lg grid place-items-center text-cream" style={{ background: c.gradient }}>
                  <c.icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-maroon">{c.name}</h3>
                  {c.tagline && <div className="text-xs uppercase tracking-widest text-gold-deep">{c.tagline}</div>}
                  {c.description && <p className="text-sm text-foreground/75 mt-2 leading-relaxed">{c.description}</p>}
                  <button
                    onClick={() => { setSelectedCats([c.id]); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="mt-3 text-sm font-semibold text-maroon hover:text-gold-deep inline-flex items-center gap-1"
                  >
                    Show {c.name} <ArrowRight className="size-3.5" />
                  </button>
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
    </Layout>
  );
}

/* ---------------- pieces ---------------- */

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</div>;
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1 text-xs text-maroon hover:border-gold">
      {children} <X className="size-3" />
    </button>
  );
}

function ProductCard({ product: p, categories }: { product: HealingProduct; categories: HealingCategory[] }) {
  const cat = categories.find((c) => c.id === p.category);
  const Icon = cat?.icon ?? Sparkles;
  const img = coverImage(p);
  const soldOut = p.stockStatus === "out-of-stock";

  return (
    <article className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-gold hover:shadow-[var(--shadow-warm)] transition flex flex-col">
      <Link
        to="/healing-items/$id"
        params={{ id: productHref(p) }}
        className="relative aspect-square grid place-items-center overflow-hidden"
        style={{ background: cat?.gradient }}
        aria-label={`View ${p.name}`}
      >
        {img ? (
          // object-contain keeps the whole photo visible — nothing is cropped away.
          <img src={img} alt={p.name} className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500" />
        ) : (
          <Icon className="size-16 text-cream/90 group-hover:scale-110 transition duration-500" strokeWidth={1.1} />
        )}
        {p.badge && (
          <span className="absolute top-3 left-3 z-10 bg-cream text-maroon text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">{p.badge}</span>
        )}
        {soldOut && (
          <span className="absolute inset-0 z-10 grid place-items-center bg-maroon-deep/55">
            <span className="bg-cream text-maroon text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">Sold out</span>
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        {cat && <div className="text-[10px] uppercase tracking-widest text-gold-deep">{cat.name}</div>}
        <div className="flex items-center gap-1 text-gold-deep mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`size-3.5 ${i < Math.round(p.rating) ? "fill-current" : "opacity-30"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{(p.rating ?? 0).toFixed(1)} ({p.reviews ?? 0})</span>
        </div>
        <h3 className="font-display text-xl text-maroon leading-snug mt-2">
          <Link to="/healing-items/$id" params={{ id: productHref(p) }} className="hover:text-gold-deep transition-colors">
            {p.name || "Untitled item"}
          </Link>
        </h3>
        {p.blessing && <p className="text-sm text-muted-foreground mt-1 flex-1">{p.blessing}</p>}
        <div className="mt-4 flex items-baseline gap-2 flex-wrap">
          {p.price && <span className="font-display text-2xl text-maroon">{p.price}</span>}
          {!!p.compareAtPrice && p.compareAtPrice > (p.priceValue || 0) && (
            <span className="text-sm text-muted-foreground line-through">₹{p.compareAtPrice.toLocaleString("en-IN")}</span>
          )}
          <span className="text-xs text-muted-foreground">incl. blessing</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to="/healing-items/$id" params={{ id: productHref(p) }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-semibold text-maroon hover:border-gold hover:bg-gold/10 transition"
          >
            View Details
          </Link>
          <Link
            to="/healing-items/$id" params={{ id: productHref(p) }} search={{ buy: true }}
            className="btn-primary py-2.5 text-sm"
          >
            <ShoppingBag className="size-4" /> Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
