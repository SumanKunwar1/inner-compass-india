import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, Upload, Star, Eye, Loader2 } from "lucide-react";
import { useProducts, saveProduct, deleteProduct, newProductId } from "@/lib/shopStore";
import { healingCategories, type HealingProduct } from "@/data/healingItems";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export const Route = createFileRoute("/admin/healing-items")({
  validateSearch: (s: Record<string, unknown>): { new?: true } =>
    s.new === true || s.new === "true" ? { new: true } : {},
  component: ProductsAdmin,
});

function blankProduct(): HealingProduct {
  return {
    id: newProductId(),
    category: healingCategories[0].id,
    name: "",
    blessing: "",
    price: "",
    priceValue: 0,
    rating: 5,
    reviews: 0,
    badge: "",
    description: "",
    descriptionHtml: "",
    includes: [],
    image: "",
  };
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function ProductsAdmin() {
  const products = useProducts();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<{ draft: HealingProduct; originalId?: string } | null>(null);

  useEffect(() => {
    if (search.new && !editing) {
      setEditing({ draft: blankProduct() });
      navigate({ to: "/admin/healing-items", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  if (editing) {
    return (
      <ProductEditor
        initial={editing.draft}
        originalId={editing.originalId}
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
          <p className="text-muted-foreground text-sm mt-1">Add and manage the products shown in the healing items shop.</p>
        </div>
        <button onClick={() => setEditing({ draft: blankProduct() })} className="btn-primary">
          <Plus className="size-4" /> Add Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No products yet. Add your first healing item.</div>
        ) : (
          <div className="divide-y divide-border">
            {products.map((p) => {
              const cat = healingCategories.find((c) => c.id === p.category);
              return (
                <div key={p.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="size-14 rounded-lg overflow-hidden shrink-0 grid place-items-center" style={{ background: cat?.gradient }}>
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : cat ? <cat.icon className="size-6 text-cream/90" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-maroon truncate">{p.name || "(untitled)"}</div>
                    <div className="text-xs text-muted-foreground truncate">{cat?.name ?? p.category} · {p.blessing}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-gold-deep text-xs">
                    <Star className="size-3.5 fill-current" /> {p.rating.toFixed(1)} <span className="text-muted-foreground">({p.reviews})</span>
                  </div>
                  {p.badge && <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold-deep">{p.badge}</span>}
                  <div className="font-semibold text-maroon text-sm w-20 text-right">{p.price || inr(p.priceValue)}</div>
                  <div className="flex items-center gap-1">
                    <a href="/healing-items" target="_blank" rel="noreferrer" className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="View shop"><Eye className="size-4" /></a>
                    <button onClick={() => setEditing({ draft: structuredClone(p), originalId: p.id })} className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Edit"><Pencil className="size-4" /></button>
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
        )}
      </div>
    </div>
  );
}

/* ---------------- Editor ---------------- */

function ProductEditor({ initial, originalId, onCancel, onSaved }: {
  initial: HealingProduct; originalId?: string; onCancel: () => void; onSaved: () => void;
}) {
  const [d, setD] = useState<HealingProduct>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = !originalId;

  const set = <K extends keyof HealingProduct>(key: K, value: HealingProduct[K]) => setD((p) => ({ ...p, [key]: value }));

  const onImage = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(file);
  };

  const save = async () => {
    setError(null);
    if (!d.name.trim()) return setError("Product name is required.");
    if (!d.priceValue || d.priceValue <= 0) return setError("Enter a valid price.");
    // Keep the display price in sync when left blank.
    const price = d.price.trim() || inr(d.priceValue);

    setSaving(true);
    try {
      await saveProduct({ ...d, price, id: d.id || newProductId() }, originalId);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const cat = healingCategories.find((c) => c.id === d.category);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon">
          <ArrowLeft className="size-4" /> Back to products
        </button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">{saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Product</>)}</button>
        </div>
      </div>

      <h1 className="font-display text-3xl text-maroon">{isNew ? "Add Product" : "Edit Product"}</h1>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      <Card title="Product Details">
        <Grid>
          <Field label="Name" full><input className={inp} value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Short blessing / subtitle" full hint="one line shown under the name">
            <input className={inp} value={d.blessing} onChange={(e) => set("blessing", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inp} value={d.category} onChange={(e) => set("category", e.target.value)}>
              {healingCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Badge" hint="optional, e.g. Bestseller"><input className={inp} value={d.badge ?? ""} onChange={(e) => set("badge", e.target.value)} /></Field>
        </Grid>
      </Card>

      <Card title="Pricing">
        <Grid>
          <Field label="Price (number)" hint="used for the order form">
            <input type="number" min={0} className={inp} value={d.priceValue || ""} onChange={(e) => set("priceValue", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Display price" hint={`blank = ${inr(d.priceValue || 0)}`}>
            <input className={inp} placeholder={inr(d.priceValue || 0)} value={d.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Rating (0–5)">
            <input type="number" min={0} max={5} step={0.1} className={inp} value={d.rating} onChange={(e) => set("rating", Math.min(5, Math.max(0, Number(e.target.value) || 0)))} />
          </Field>
          <Field label="Review count">
            <input type="number" min={0} className={inp} value={d.reviews} onChange={(e) => set("reviews", Number(e.target.value) || 0)} />
          </Field>
        </Grid>
      </Card>

      <Card title="Image">
        <Grid>
          <Field label="Image URL" full hint="leave blank to use the category artwork">
            <input className={inp} value={d.image?.startsWith("data:") ? "" : d.image ?? ""} placeholder={d.image?.startsWith("data:") ? "(uploaded image)" : "https://…"} onChange={(e) => set("image", e.target.value)} />
          </Field>
          <Field label="Upload image">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold">
              <Upload className="size-4 text-gold-deep" /> Choose file
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0])} />
            </label>
          </Field>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Preview</div>
            <div className="size-28 rounded-lg overflow-hidden grid place-items-center border border-border" style={{ background: cat?.gradient }}>
              {d.image ? <img src={d.image} alt="" className="w-full h-full object-cover" /> : cat ? <cat.icon className="size-10 text-cream/90" strokeWidth={1.1} /> : null}
            </div>
          </div>
        </Grid>
      </Card>

      <Card title="Description">
        <Field label="Short description" full hint="shown in the quick-view dialog">
          <textarea rows={3} className={inp} value={d.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Full description (rich text)" full hint="optional — replaces the short description on the product dialog">
          <RichTextEditor value={d.descriptionHtml ?? ""} onChange={(html) => set("descriptionHtml", html)} placeholder="Describe the product, its materials and benefits…" />
        </Field>
        <Field label="What's included (one per line)" full>
          <textarea rows={4} className={inp} value={d.includes.join("\n")} onChange={(e) => set("includes", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
        </Field>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">{saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Product</>)}</button>
      </div>
    </div>
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
