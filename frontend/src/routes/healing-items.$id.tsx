import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Star, ShoppingBag, CheckCircle2, Truck, BadgeCheck, ShieldCheck,
  SearchX, Sparkles, ChevronLeft, ChevronRight, Package, Ruler, Weight, MapPin,
  Hash, Clock, Loader2, Heart, Share2, Check,
} from "lucide-react";
import { coverImage, productImages, productHref, STOCK_STATUSES, type HealingProduct, type HealingCategory } from "@/data/healingItems";
import { useProduct, useProducts, useProductsLoaded, useCategories, addOrder } from "@/lib/shopStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { RichText } from "@/components/admin/RichText";

export const Route = createFileRoute("/healing-items/$id")({
  validateSearch: (s: Record<string, unknown>): { buy?: true } =>
    s.buy === true || s.buy === "true" ? { buy: true } : {},
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Healing Items | BTMC Foundation India` },
      { name: "description", content: "A blessed and consecrated healing item from BTMC Foundation India." },
    ],
  }),
  component: ProductDetailPage,
});

const stockLabel = (v?: string) => STOCK_STATUSES.find((s) => s.value === v)?.label ?? "In stock";

function ProductDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const product = useProduct(id);
  const loaded = useProductsLoaded();
  const categories = useCategories();
  const allProducts = useProducts();

  const [buyOpen, setBuyOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Deep link from the shop's "Buy Now" button opens the order form directly.
  useEffect(() => {
    if (search.buy && product) setBuyOpen(true);
  }, [search.buy, product]);

  // Keep the tab title in step with the product once it has loaded.
  useEffect(() => {
    if (product?.name) {
      document.title = `${product.metaTitle || product.name} | BTMC Foundation India`;
    }
  }, [product]);

  if (!loaded) {
    return (
      <Layout>
        <section className="section-y">
          <div className="container-x py-24 text-center text-muted-foreground">
            <Loader2 className="size-8 mx-auto animate-spin text-gold-deep" />
            <p className="mt-3 text-sm">Loading product…</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="section-y">
          <div className="container-x max-w-lg text-center">
            <SearchX className="size-12 mx-auto text-muted-foreground/50" />
            <h1 className="font-display text-3xl text-maroon mt-4">Item not found</h1>
            <p className="mt-3 text-foreground/70">This healing item may have been moved or removed.</p>
            <Link to="/healing-items" className="btn-primary mt-8">Browse all healing items</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const cat = categories.find((c) => c.id === product.category);
  const soldOut = product.stockStatus === "out-of-stock";
  const related = allProducts
    .filter((p) => p.published !== false && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* the user dismissed the share sheet */
    }
  };

  const specs = [
    { icon: Hash, label: "SKU", value: product.sku },
    { icon: Package, label: "Materials", value: product.materials },
    { icon: Ruler, label: "Dimensions", value: product.dimensions },
    { icon: Weight, label: "Weight", value: product.weight },
    { icon: MapPin, label: "Origin", value: product.origin },
    { icon: BadgeCheck, label: "Consecrated by", value: product.consecratedBy },
    { icon: Clock, label: "Delivery", value: product.deliveryTime },
  ].filter((s) => String(s.value ?? "").trim());

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container-x py-4 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span className="opacity-40">/</span>
          <Link to="/healing-items" className="hover:text-maroon">Healing Items</Link>
          {cat && (
            <>
              <span className="opacity-40">/</span>
              <span className="hover:text-maroon">{cat.name}</span>
            </>
          )}
          <span className="opacity-40">/</span>
          <span className="text-maroon font-medium truncate">{product.name || "Item"}</span>
        </div>
      </div>

      {/* Main product block */}
      <section className="py-10 md:py-14">
        <div className="container-x">
          <Link to="/healing-items" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon mb-6">
            <ArrowLeft className="size-4" /> Back to all items
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <Gallery product={product} category={cat} />

            {/* ---------- Buying panel ---------- */}
            <div className="lg:sticky lg:top-28">
              {cat && (
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded grid place-items-center text-cream" style={{ background: cat.gradient }}>
                    <cat.icon className="size-3.5" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-gold-deep">{cat.name}</span>
                </div>
              )}

              <h1 className="font-display text-3xl md:text-4xl text-maroon mt-3 leading-tight">
                {product.name || "Untitled item"}
              </h1>
              {product.blessing && <p className="text-lg text-foreground/70 mt-2">{product.blessing}</p>}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5 text-gold-deep">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {(product.rating ?? 0).toFixed(1)} · {product.reviews ?? 0} review{product.reviews === 1 ? "" : "s"}
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3 flex-wrap">
                {product.price && <span className="font-display text-4xl text-maroon">{product.price}</span>}
                {!!product.compareAtPrice && product.compareAtPrice > (product.priceValue || 0) && (
                  <>
                    <span className="text-lg text-muted-foreground line-through mb-1">
                      ₹{product.compareAtPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="mb-1.5 text-xs font-bold uppercase tracking-wide bg-gold/20 text-gold-deep px-2 py-1 rounded">
                      Save ₹{(product.compareAtPrice - (product.priceValue || 0)).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Inclusive of blessing &amp; consecration</p>

              {/* Availability + badge */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${soldOut ? "text-destructive" : "text-green-700"}`}>
                  <span className={`size-2 rounded-full ${soldOut ? "bg-destructive" : "bg-green-600"}`} />
                  {stockLabel(product.stockStatus)}
                  {typeof product.stock === "number" && product.stock > 0 && !soldOut && (
                    <span className="text-muted-foreground font-normal">· {product.stock} available</span>
                  )}
                </span>
                {product.badge && (
                  <span className="bg-gold/15 text-gold-deep text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Short description */}
              {product.description && (
                <p className="text-sm text-foreground/75 leading-relaxed mt-5">{product.description}</p>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setBuyOpen(true)}
                  disabled={soldOut}
                  className="btn-primary flex-1 min-w-[200px] justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="size-4" /> {soldOut ? "Sold out" : "Buy Now"}
                </button>
                <button
                  onClick={share}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-3.5 text-sm font-semibold text-maroon hover:border-gold hover:bg-gold/10 transition"
                >
                  {copied ? <><Check className="size-4" /> Copied</> : <><Share2 className="size-4" /> Share</>}
                </button>
              </div>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full rounded-md border border-border px-4 py-3 text-sm font-semibold text-maroon hover:border-gold hover:bg-gold/10 transition"
              >
                <Heart className="size-4" /> Ask a question about this item
              </Link>

              {/* Tags */}
              {!!product.tags?.length && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span key={t} className="text-xs bg-secondary border border-border rounded-full px-3 py-1 text-foreground/70">{t}</span>
                  ))}
                </div>
              )}

              {/* Reassurance */}
              <div className="mt-7 border-t border-border pt-5 grid gap-3">
                {[
                  { i: BadgeCheck, t: "Authentically consecrated before dispatch" },
                  { i: ShieldCheck, t: "Genuine sacred materials only" },
                  { i: Truck, t: product.shippingInfo || "Carefully packed and shipped worldwide" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-foreground/75">
                    <f.i className="size-4 text-gold-deep mt-0.5 shrink-0" /> {f.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      {(product.descriptionHtml || product.includes?.length || product.benefits?.length ||
        product.howToUse || product.careInstructions || specs.length > 0) && (
        <section className="border-t border-border bg-secondary/25">
          <div className="container-x py-12 md:py-16">
            <div className="grid lg:grid-cols-[1fr_340px] gap-10 xl:gap-16 items-start">
              <div className="space-y-10">
                {product.descriptionHtml && (
                  <Block title="About this item">
                    <RichText html={product.descriptionHtml} className="text-sm" />
                  </Block>
                )}

                {!!product.benefits?.length && (
                  <Block title="Benefits">
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="size-4 text-gold-deep mt-0.5 shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </Block>
                )}

                {product.howToUse && (
                  <Block title="How to use">
                    <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line">{product.howToUse}</p>
                  </Block>
                )}

                {product.careInstructions && (
                  <Block title="Care instructions">
                    <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line">{product.careInstructions}</p>
                  </Block>
                )}
              </div>

              <div className="space-y-6">
                {!!product.includes?.length && (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-xl text-maroon mb-4">What&rsquo;s included</h3>
                    <ul className="space-y-2.5">
                      {product.includes.map((x) => (
                        <li key={x} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="size-4 text-gold-deep mt-0.5 shrink-0" />{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {specs.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-xl text-maroon mb-4">Specifications</h3>
                    <dl className="divide-y divide-border">
                      {specs.map((s) => (
                        <div key={s.label} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                          <s.icon className="size-4 text-gold-deep mt-0.5 shrink-0" />
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground w-28 shrink-0">{s.label}</dt>
                          <dd className="text-sm text-foreground/85 flex-1">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="font-display text-3xl font-semibold mt-2 text-maroon">More from {cat?.name ?? "this collection"}</h2>
              </div>
              <Link to="/healing-items" className="text-sm font-semibold text-maroon hover:text-gold-deep whitespace-nowrap">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id} to="/healing-items/$id" params={{ id: productHref(r) }}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-gold hover:shadow-[var(--shadow-warm)] transition"
                >
                  <div className="relative aspect-square grid place-items-center overflow-hidden" style={{ background: cat?.gradient }}>
                    {coverImage(r) ? (
                      <img src={coverImage(r)} alt={r.name} className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500" />
                    ) : (
                      <Sparkles className="size-12 text-cream/90" strokeWidth={1.1} />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base text-maroon leading-snug line-clamp-2">{r.name}</h3>
                    {r.price && <div className="font-display text-lg text-maroon mt-1">{r.price}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Order dialog */}
      <Dialog open={buyOpen} onOpenChange={setBuyOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest text-gold-deep">{cat?.name}</div>
            <h3 className="font-display text-2xl text-maroon">Order · {product.name}</h3>
          </div>
          <PaymentForm
            context="Order"
            itemLabel={`${product.name} — ${product.price}`}
            fixedAmount={product.priceValue}
            note="Complete your order by transferring the amount below and uploading your payment screenshot. We will confirm dispatch by email."
            onRecord={(payload) => addOrder({ ...payload, productId: product.id })}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

/* ---------------- gallery ---------------- */

function Gallery({ product, category }: { product: HealingProduct; category?: HealingCategory }) {
  const images = productImages(product);
  const [active, setActive] = useState(Math.min(product.coverIndex ?? 0, Math.max(images.length - 1, 0)));
  const [zoomed, setZoomed] = useState(false);
  const Icon = category?.icon ?? Sparkles;

  // Admin-chosen framing: "contain" (default) never crops the photo.
  const fit = product.imageFit === "cover" ? "object-cover" : "object-contain";

  const step = (d: number) => setActive((i) => (i + d + images.length) % images.length);

  if (!images.length) {
    return (
      <div className="aspect-square rounded-2xl grid place-items-center border border-border" style={{ background: category?.gradient }}>
        <Icon className="size-24 text-cream/90" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative aspect-square rounded-2xl overflow-hidden border border-border grid place-items-center group"
        style={{ background: category?.gradient }}
      >
        <img
          src={images[active]}
          alt={`${product.name} — image ${active + 1}`}
          className={`absolute inset-0 w-full h-full ${fit} p-3 cursor-zoom-in`}
          onClick={() => setZoomed(true)}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => step(-1)} aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full bg-cream/90 text-maroon opacity-0 group-hover:opacity-100 transition hover:bg-cream"
            ><ChevronLeft className="size-5" /></button>
            <button
              onClick={() => step(1)} aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full bg-cream/90 text-maroon opacity-0 group-hover:opacity-100 transition hover:bg-cream"
            ><ChevronRight className="size-5" /></button>
            <span className="absolute bottom-3 right-3 text-xs bg-maroon-deep/70 text-cream px-2.5 py-1 rounded-full">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {images.map((src, i) => (
            <button
              key={i} onClick={() => setActive(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${i === active ? "border-gold" : "border-border hover:border-gold/50"}`}
              style={{ background: category?.gradient }}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Full-size view — the complete photo, never cropped. */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-4xl bg-transparent border-0 shadow-none p-0">
          <img src={images[active]} alt={product.name} className="w-full max-h-[85vh] object-contain rounded-xl bg-cream" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-maroon mb-4">{title}</h2>
      {children}
    </div>
  );
}
