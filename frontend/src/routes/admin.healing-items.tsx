import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, ArrowLeft, Save, X, Upload, Star, Eye, EyeOff, Loader2,
  ImagePlus, Crown, ArrowLeftRight, Tags, Package, AlertTriangle,
} from "lucide-react";
import {
  useProducts, saveProduct, deleteProduct, newProductId,
  useCategories, saveCategory, deleteCategory, type CategoryDraft,
} from "@/lib/shopStore";
import {
  productImages, STOCK_STATUSES, CATEGORY_ICON_NAMES, iconFor, DEFAULT_GRADIENT,
  type HealingProduct, type HealingCategory,
} from "@/data/healingItems";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export const Route = createFileRoute("/admin/healing-items")({
  validateSearch: (s: Record<string, unknown>): { new?: true } =>
    s.new === true || s.new === "true" ? { new: true } : {},
  component: ProductsAdmin,
});

function blankProduct(categoryId: string): HealingProduct {
  return {
    id: newProductId(),
    slug: "",
    category: categoryId,
    name: "",
    blessing: "",
    sku: "",
    badge: "",
    tags: [],
    price: "",
    priceValue: 0,
    compareAtPrice: 0,
    stockStatus: "in-stock",
    stock: null,
    published: true,
    featured: false,
    sortOrder: 0,
    rating: 5,
    reviews: 0,
    image: "",
    images: [],
    coverIndex: 0,
    imageFit: "contain",
    description: "",
    descriptionHtml: "",
    includes: [],
    benefits: [],
    howToUse: "",
    careInstructions: "",
    shippingInfo: "",
    materials: "",
    dimensions: "",
    weight: "",
    origin: "",
    consecratedBy: "",
    deliveryTime: "",
    metaTitle: "",
    metaDescription: "",
  };
}

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function ProductsAdmin() {
  const products = useProducts();
  const categories = useCategories();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<{ draft: HealingProduct; originalId?: string } | null>(null);
  const [tab, setTab] = useState<"products" | "categories">("products");

  useEffect(() => {
    if (search.new && !editing) {
      setEditing({ draft: blankProduct(categories[0]?.id ?? "") });
      navigate({ to: "/admin/healing-items", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  if (editing) {
    return (
      <ProductEditor
        initial={editing.draft}
        originalId={editing.originalId}
        categories={categories}
        onCancel={() => setEditing(null)}
        onSaved={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Healing Items</h1>
          <p className="text-muted-foreground text-sm mt-1">Add and manage the products and categories shown in the shop.</p>
        </div>
        {tab === "products" && (
          <button onClick={() => setEditing({ draft: blankProduct(categories[0]?.id ?? "") })} className="btn-primary">
            <Plus className="size-4" /> Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "products", label: "Products", icon: Package, count: products.length },
          { id: "categories", label: "Categories", icon: Tags, count: categories.length },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === t.id ? "border-maroon text-maroon" : "border-transparent text-muted-foreground hover:text-maroon"
            }`}
          >
            <t.icon className="size-4" /> {t.label}
            <span className="text-xs bg-secondary rounded-full px-2 py-0.5">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <ProductList
          products={products}
          categories={categories}
          onEdit={(p) => setEditing({ draft: structuredClone(p), originalId: p.id })}
        />
      ) : (
        <CategoryManager categories={categories} products={products} />
      )}
    </div>
  );
}

/* ---------------- product list ---------------- */

function ProductList({ products, categories, onEdit }: {
  products: HealingProduct[]; categories: HealingCategory[]; onEdit: (p: HealingProduct) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
        No products yet. Add your first healing item.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="divide-y divide-border">
        {products.map((p) => {
          const cat = categories.find((c) => c.id === p.category);
          const Icon = cat?.icon;
          const imgs = productImages(p);
          const cover = imgs[Math.min(p.coverIndex ?? 0, Math.max(imgs.length - 1, 0))];
          return (
            <div key={p.id} className={`flex items-center gap-4 px-4 py-3 ${p.published === false ? "opacity-60" : ""}`}>
              <div className="size-14 rounded-lg overflow-hidden shrink-0 grid place-items-center border border-border" style={{ background: cat?.gradient ?? DEFAULT_GRADIENT }}>
                {cover ? <img src={cover} alt="" className="w-full h-full object-contain p-0.5" /> : Icon ? <Icon className="size-6 text-cream/90" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-maroon truncate flex items-center gap-2">
                  {p.name || "(untitled)"}
                  {p.featured && <Crown className="size-3.5 text-gold-deep shrink-0" />}
                  {p.published === false && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">Hidden</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {cat?.name ?? (p.category || "No category")}
                  {p.blessing ? ` · ${p.blessing}` : ""}
                  {imgs.length > 1 ? ` · ${imgs.length} images` : ""}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-gold-deep text-xs">
                <Star className="size-3.5 fill-current" /> {(p.rating ?? 0).toFixed(1)}
                <span className="text-muted-foreground">({p.reviews ?? 0})</span>
              </div>
              {p.badge && <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold-deep">{p.badge}</span>}
              <div className="font-semibold text-maroon text-sm w-20 text-right">{p.price || inr(p.priceValue)}</div>
              <div className="flex items-center gap-1">
                <a
                  href={`/healing-items/${p.slug || p.id}`} target="_blank" rel="noreferrer"
                  className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="View on site"
                ><Eye className="size-4" /></a>
                <button onClick={() => onEdit(p)} className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Edit"><Pencil className="size-4" /></button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete "${p.name}"?`)) return;
                    try { await deleteProduct(p.id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
                  }}
                  className="size-9 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive"
                  title="Delete"
                ><Trash2 className="size-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- category manager ---------------- */

function blankCategory(): CategoryDraft {
  return {
    id: "", name: "", tagline: "", description: "",
    gradient: DEFAULT_GRADIENT, icon: "Sparkles", sortOrder: 0, visible: true,
  };
}

function CategoryManager({ categories, products }: { categories: HealingCategory[]; products: HealingProduct[] }) {
  const [draft, setDraft] = useState<{ value: CategoryDraft; originalId?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;

  const set = <K extends keyof CategoryDraft>(k: K, v: CategoryDraft[K]) =>
    setDraft((d) => (d ? { ...d, value: { ...d.value, [k]: v } } : d));

  const save = async () => {
    if (!draft) return;
    setError(null);
    setSaving(true);
    try {
      await saveCategory(draft.value, draft.originalId);
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          These categories drive the filter panel on the public shop page and the category picker on each product.
        </p>
        {!draft && (
          <button onClick={() => setDraft({ value: blankCategory() })} className="btn-primary whitespace-nowrap">
            <Plus className="size-4" /> Add Category
          </button>
        )}
      </div>

      {draft && (
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-xl text-maroon">{draft.originalId ? "Edit category" : "New category"}</h2>
          {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}
          <Grid>
            <Field label="Name"><input className={inp} value={draft.value.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Id / slug" hint="blank = generated from the name">
              <input className={inp} value={draft.value.id} placeholder="amulets" onChange={(e) => set("id", e.target.value)} />
            </Field>
            <Field label="Tagline" full><input className={inp} value={draft.value.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
            <Field label="Description" full>
              <textarea rows={3} className={inp} value={draft.value.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label="Icon">
              <select className={inp} value={draft.value.icon} onChange={(e) => set("icon", e.target.value)}>
                {CATEGORY_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Sort order" hint="lower shows first">
              <input type="number" className={inp} value={draft.value.sortOrder ?? 0} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Gradient" full hint="CSS background used when a product has no photo">
              <input className={inp} value={draft.value.gradient} onChange={(e) => set("gradient", e.target.value)} />
            </Field>
            <Field label="Visible on the site">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={draft.value.visible !== false} onChange={(e) => set("visible", e.target.checked)} className="size-4 accent-[var(--maroon)]" />
                Show in the shop filters
              </label>
            </Field>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Preview</div>
              <div className="size-14 rounded-lg grid place-items-center text-cream border border-border" style={{ background: draft.value.gradient }}>
                {(() => { const I = iconFor(draft.value.icon); return <I className="size-6" />; })()}
              </div>
            </div>
          </Grid>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setDraft(null); setError(null); }} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
              {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Category</>)}
            </button>
          </div>
        </section>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No categories yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((c) => (
              <div key={c.id} className={`flex items-center gap-4 px-4 py-3 ${c.visible === false ? "opacity-60" : ""}`}>
                <div className="size-11 rounded-lg grid place-items-center text-cream shrink-0" style={{ background: c.gradient }}>
                  <c.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-maroon truncate flex items-center gap-2">
                    {c.name}
                    {c.visible === false && <EyeOff className="size-3.5 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{c.id}{c.tagline ? ` · ${c.tagline}` : ""}</div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{counts[c.id] ?? 0} product{(counts[c.id] ?? 0) === 1 ? "" : "s"}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDraft({
                      value: {
                        id: c.id, name: c.name, tagline: c.tagline, description: c.description,
                        gradient: c.gradient,
                        icon: CATEGORY_ICON_NAMES.find((n) => iconFor(n) === c.icon) ?? "Sparkles",
                        sortOrder: c.sortOrder ?? 0, visible: c.visible !== false,
                      },
                      originalId: c.id,
                    })}
                    className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Edit"
                  ><Pencil className="size-4" /></button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete category "${c.name}"?`)) return;
                      try { await deleteCategory(c.id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
                    }}
                    className="size-9 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive" title="Delete"
                  ><Trash2 className="size-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- product editor ---------------- */

function ProductEditor({ initial, originalId, categories, onCancel, onSaved }: {
  initial: HealingProduct; originalId?: string; categories: HealingCategory[];
  onCancel: () => void; onSaved: () => void;
}) {
  const [d, setD] = useState<HealingProduct>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = !originalId;

  const set = <K extends keyof HealingProduct>(key: K, value: HealingProduct[K]) =>
    setD((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const images = productImages(d);
      const coverIndex = Math.min(d.coverIndex ?? 0, Math.max(images.length - 1, 0));
      await saveProduct(
        {
          ...d,
          images,
          coverIndex,
          image: images[coverIndex] ?? "",
          price: d.price.trim() || (d.priceValue > 0 ? inr(d.priceValue) : ""),
          id: d.id || newProductId(),
        },
        originalId
      );
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const cat = categories.find((c) => c.id === d.category);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon">
          <ArrowLeft className="size-4" /> Back to products
        </button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Product</>)}
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl text-maroon">{isNew ? "Add Product" : "Edit Product"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Every field is optional — fill in what you have and come back to the rest later.</p>
      </div>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      <Card title="Product Details">
        <Grid>
          <Field label="Name" full><input className={inp} value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Short blessing / subtitle" full hint="one line shown under the name">
            <input className={inp} value={d.blessing} onChange={(e) => set("blessing", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inp} value={d.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Badge" hint="e.g. Bestseller"><input className={inp} value={d.badge ?? ""} onChange={(e) => set("badge", e.target.value)} /></Field>
          <Field label="SKU / item code"><input className={inp} value={d.sku ?? ""} onChange={(e) => set("sku", e.target.value)} /></Field>
          <Field label="URL slug" hint="blank = generated from the name">
            <input className={inp} value={d.slug ?? ""} placeholder="enemy-protection-cycle" onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Tags (comma separated)" full hint="used by the shop search">
            <input className={inp} value={(d.tags ?? []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </Field>
        </Grid>
      </Card>

      <Card title="Pricing & Availability">
        <Grid>
          <Field label="Price (number)" hint="used for the order form">
            <input type="number" min={0} className={inp} value={d.priceValue || ""} onChange={(e) => set("priceValue", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Display price" hint={`blank = ${inr(d.priceValue || 0)}`}>
            <input className={inp} placeholder={inr(d.priceValue || 0)} value={d.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Compare-at price" hint="shows a struck-through 'was' price">
            <input type="number" min={0} className={inp} value={d.compareAtPrice || ""} onChange={(e) => set("compareAtPrice", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Availability">
            <select className={inp} value={d.stockStatus ?? "in-stock"} onChange={(e) => set("stockStatus", e.target.value)}>
              {STOCK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Units in stock" hint="blank = do not show a count">
            <input type="number" min={0} className={inp} value={d.stock ?? ""} onChange={(e) => set("stock", e.target.value === "" ? null : Number(e.target.value) || 0)} />
          </Field>
          <Field label="Sort order" hint="lower shows first in Featured">
            <input type="number" className={inp} value={d.sortOrder ?? 0} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Rating (0–5)">
            <input type="number" min={0} max={5} step={0.1} className={inp} value={d.rating} onChange={(e) => set("rating", Math.min(5, Math.max(0, Number(e.target.value) || 0)))} />
          </Field>
          <Field label="Review count">
            <input type="number" min={0} className={inp} value={d.reviews} onChange={(e) => set("reviews", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Visibility" full>
            <div className="flex flex-wrap gap-5">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={d.published !== false} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[var(--maroon)]" />
                Published — visible on the public shop
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!d.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-[var(--maroon)]" />
                Featured
              </label>
            </div>
          </Field>
        </Grid>
      </Card>

      <ImagesCard draft={d} setDraft={setD} gradient={cat?.gradient ?? DEFAULT_GRADIENT} />

      <Card title="Description">
        <Field label="Short description" full hint="shown near the top of the product page and in search">
          <textarea rows={3} className={inp} value={d.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Full description (rich text)" full hint="the main 'About this item' section on the product page">
          <RichTextEditor value={d.descriptionHtml ?? ""} onChange={(html) => set("descriptionHtml", html)} placeholder="Describe the product, its materials and benefits…" />
        </Field>
        <Grid>
          <Field label="What's included (one per line)" full>
            <textarea rows={4} className={inp} value={(d.includes ?? []).join("\n")} onChange={(e) => set("includes", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
          </Field>
          <Field label="Benefits (one per line)" full>
            <textarea rows={4} className={inp} value={(d.benefits ?? []).join("\n")} onChange={(e) => set("benefits", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
          </Field>
          <Field label="How to use" full>
            <textarea rows={3} className={inp} value={d.howToUse ?? ""} onChange={(e) => set("howToUse", e.target.value)} />
          </Field>
          <Field label="Care instructions" full>
            <textarea rows={3} className={inp} value={d.careInstructions ?? ""} onChange={(e) => set("careInstructions", e.target.value)} />
          </Field>
        </Grid>
      </Card>

      <Card title="Specifications">
        <Grid>
          <Field label="Materials" hint="e.g. Gold, silver, herbs"><input className={inp} value={d.materials ?? ""} onChange={(e) => set("materials", e.target.value)} /></Field>
          <Field label="Dimensions" hint="e.g. 7 × 5 cm"><input className={inp} value={d.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value)} /></Field>
          <Field label="Weight" hint="e.g. 45 g"><input className={inp} value={d.weight ?? ""} onChange={(e) => set("weight", e.target.value)} /></Field>
          <Field label="Origin" hint="e.g. Bodh Gaya, India"><input className={inp} value={d.origin ?? ""} onChange={(e) => set("origin", e.target.value)} /></Field>
          <Field label="Consecrated by"><input className={inp} value={d.consecratedBy ?? ""} onChange={(e) => set("consecratedBy", e.target.value)} /></Field>
          <Field label="Delivery time" hint="e.g. Ships in 5–7 days"><input className={inp} value={d.deliveryTime ?? ""} onChange={(e) => set("deliveryTime", e.target.value)} /></Field>
          <Field label="Shipping note" full hint="shown in the reassurance list on the product page">
            <input className={inp} value={d.shippingInfo ?? ""} onChange={(e) => set("shippingInfo", e.target.value)} />
          </Field>
        </Grid>
      </Card>

      <Card title="Search Engine Listing">
        <Grid>
          <Field label="Meta title" full hint={`blank = "${d.name || "product name"}"`}>
            <input className={inp} value={d.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta description" full hint="around 150 characters">
            <textarea rows={2} className={inp} value={d.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} />
          </Field>
        </Grid>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Product</>)}
        </button>
      </div>
    </div>
  );
}

/* ---------------- images ---------------- */

/** Rough byte size of a data URL, used to warn before the request is rejected. */
const dataUrlBytes = (s: string) => (s.startsWith("data:") ? Math.floor(((s.split(",")[1] ?? "").length * 3) / 4) : 0);
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function ImagesCard({ draft: d, setDraft, gradient }: {
  draft: HealingProduct; setDraft: React.Dispatch<React.SetStateAction<HealingProduct>>; gradient: string;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const images = productImages(d);
  const cover = Math.min(d.coverIndex ?? 0, Math.max(images.length - 1, 0));

  const commit = (next: string[], nextCover = cover) => {
    const c = Math.min(Math.max(nextCover, 0), Math.max(next.length - 1, 0));
    setDraft((p) => ({ ...p, images: next, coverIndex: c, image: next[c] ?? "" }));
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setNotice(null);
    const readers = Array.from(files).map(
      (f) => new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => resolve("");
        r.readAsDataURL(f);
      })
    );
    Promise.all(readers).then((results) => {
      const added = results.filter(Boolean);
      const next = [...images, ...added];
      const total = next.reduce((sum, s) => sum + dataUrlBytes(s), 0);
      if (total > MAX_TOTAL_BYTES) {
        setNotice("These images total more than 20 MB, which the server will reject. Remove some, or use image URLs instead.");
      }
      commit(next);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    commit([...images, u]);
    setUrlInput("");
  };

  const remove = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    // Keep the same photo as cover when something before it is removed.
    commit(next, i < cover ? cover - 1 : i === cover ? 0 : cover);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next, cover === i ? j : cover === j ? i : cover);
  };

  return (
    <Card title="Images">
      <p className="text-sm text-muted-foreground -mt-2">
        Upload as many photos as you like. The one marked <span className="text-gold-deep font-medium">Cover</span> leads
        the product card and gallery.
      </p>

      {notice && (
        <div className="rounded-lg bg-gold/15 text-gold-deep text-sm px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" /> {notice}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold">
          <Upload className="size-4 text-gold-deep" /> Upload images
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </label>
        <div className="flex gap-2 flex-1 min-w-[260px]">
          <input
            className={inp} placeholder="…or paste an image URL" value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
          />
          <button onClick={addUrl} className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-2.5 text-sm hover:border-gold whitespace-nowrap">
            <ImagePlus className="size-4 text-gold-deep" /> Add
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No images yet — the category artwork will be used instead.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${i === cover ? "border-gold" : "border-border"}`}>
              <div className="aspect-square grid place-items-center" style={{ background: gradient }}>
                <img src={src} alt="" className="w-full h-full object-contain p-1" />
              </div>
              {i === cover && (
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-gold text-maroon-deep text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                  <Crown className="size-3" /> Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-background/95 border-t border-border flex items-center justify-center gap-0.5 py-1">
                {i !== cover && (
                  <button onClick={() => commit(images, i)} title="Set as cover" className="size-7 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-gold-deep">
                    <Crown className="size-3.5" />
                  </button>
                )}
                <button onClick={() => move(i, -1)} disabled={i === 0} title="Move left" className="size-7 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon disabled:opacity-30">
                  <ArrowLeftRight className="size-3.5 rotate-180" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === images.length - 1} title="Move right" className="size-7 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon disabled:opacity-30">
                  <ArrowLeftRight className="size-3.5" />
                </button>
                <button onClick={() => remove(i)} title="Remove" className="size-7 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Field label="Image framing" hint="how photos sit inside their frame on the site">
        <select className={inp} value={d.imageFit ?? "contain"} onChange={(e) => setDraft((p) => ({ ...p, imageFit: e.target.value as "contain" | "cover" }))}>
          <option value="contain">Show the whole photo (no cropping)</option>
          <option value="cover">Fill the frame (crops the edges)</option>
        </select>
      </Field>
    </Card>
  );
}

/* ---------------- UI helpers ---------------- */

const inp = "w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5">
      <h2 className="font-display text-xl text-maroon mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {hint && <span className="text-xs text-muted-foreground/70 ml-2 normal-case font-normal">— {hint}</span>}
      <div className="mt-1">{children}</div>
    </div>
  );
}
