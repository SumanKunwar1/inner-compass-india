import { useSyncExternalStore } from "react";
import {
  healingCategories as SEED_CATEGORIES,
  type HealingCategory,
  type HealingProduct,
  iconFor,
  DEFAULT_GRADIENT,
} from "@/data/healingItems";
import { api, getToken } from "@/lib/api";

/**
 * API-backed store for healing-item products and orders.
 * See charityStore.ts for the same SSR-snapshot approach.
 */

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type Order = {
  id: string;
  ref: string;
  createdAt: string;
  productId: string;
  productName: string;
  amount: number;
  fullName: string;
  email: string;
  mobile: string;
  pan?: string;
  message?: string;
  proofName: string;
  proofDataUrl?: string;
  status: OrderStatus;
};

const isBrowser = typeof window !== "undefined";

/**
 * Products start empty rather than seeded with the bundled sample data. Seeding the
 * cache made a failed fetch look like a successful one, so admin edits appeared not
 * to reach the public pages. An empty cache plus `productsLoaded` lets the UI tell
 * "still loading" apart from "genuinely nothing here".
 */
let productsCache: HealingProduct[] = [];
let productsLoaded = false;
let categoriesCache: HealingCategory[] = SEED_CATEGORIES;
let categoriesLoaded = false;
let ordersCache: Order[] = [];
let productsRequested = false;
let categoriesRequested = false;
let ordersRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function normalizeOrder(d: Record<string, any>): Order {
  return { ...d, id: String(d._id ?? d.id) } as Order;
}

/* ---------------- products ---------------- */

function normalizeProduct(d: Record<string, any>): HealingProduct {
  const images: string[] = Array.isArray(d.images) && d.images.length
    ? d.images.filter(Boolean)
    : d.image
      ? [d.image]
      : [];
  return {
    ...d,
    images,
    coverIndex: Math.min(Number(d.coverIndex) || 0, Math.max(images.length - 1, 0)),
    image: d.image || images[0] || "",
    imageFit: d.imageFit === "cover" ? "cover" : "contain",
    includes: Array.isArray(d.includes) ? d.includes : [],
    benefits: Array.isArray(d.benefits) ? d.benefits : [],
    tags: Array.isArray(d.tags) ? d.tags : [],
    rating: Number(d.rating ?? 0),
    reviews: Number(d.reviews ?? 0),
    priceValue: Number(d.priceValue ?? 0),
  } as HealingProduct;
}

/**
 * Unpublished products are admin-only, so they are requested only when an admin
 * session exists. A public visitor never receives draft records at all.
 */
async function fetchProducts() {
  const includeHidden = !!getToken();
  const data = await api.get<Record<string, any>[]>(
    `/products${includeHidden ? "?includeHidden=true" : ""}`,
    includeHidden
  );
  productsCache = data.map(normalizeProduct);
  productsLoaded = true;
  notify();
}

export function getProducts(): HealingProduct[] {
  return productsCache;
}
export function productsAreLoaded(): boolean {
  return productsLoaded;
}
const getServerProducts = (): HealingProduct[] => [];

function subscribeProducts(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !productsRequested) {
    productsRequested = true;
    fetchProducts().catch((e) => console.error("Failed to load products:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Re-reads the catalogue — used after signing in, so drafts appear. */
export function refreshProducts() {
  return fetchProducts();
}

export async function saveProduct(product: HealingProduct, originalId?: string) {
  if (originalId) await api.put(`/products/${originalId}`, product);
  else await api.post("/products", product, true);
  await fetchProducts();
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
  await fetchProducts();
}

export function newProductId(): string {
  return "p_" + Math.random().toString(36).slice(2, 8);
}

/* ---------------- categories ---------------- */

function normalizeCategory(d: Record<string, any>): HealingCategory {
  return {
    id: String(d.id ?? ""),
    name: d.name || d.id || "",
    tagline: d.tagline ?? "",
    description: d.description ?? "",
    gradient: d.gradient || DEFAULT_GRADIENT,
    icon: iconFor(d.icon),
    sortOrder: Number(d.sortOrder ?? 0),
    visible: d.visible !== false,
  };
}

async function fetchCategories() {
  const data = await api.get<Record<string, any>[]>("/categories?includeHidden=true");
  // Keep the bundled list if the collection has not been seeded yet.
  if (data.length) {
    categoriesCache = data.map(normalizeCategory);
    categoriesLoaded = true;
    notify();
  }
}

export function getCategories(): HealingCategory[] {
  return categoriesCache;
}
export function categoriesAreLoaded(): boolean {
  return categoriesLoaded;
}
const getServerCategories = (): HealingCategory[] => SEED_CATEGORIES;

function subscribeCategories(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !categoriesRequested) {
    categoriesRequested = true;
    fetchCategories().catch((e) => console.error("Failed to load categories:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** The raw icon name, which the store swaps for a component when reading. */
export type CategoryDraft = Omit<HealingCategory, "icon"> & { icon: string };

export async function saveCategory(category: CategoryDraft, originalId?: string) {
  if (originalId) await api.put(`/categories/${originalId}`, category);
  else await api.post("/categories", category, true);
  await fetchCategories();
  await fetchProducts();
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
  await fetchCategories();
}

/* ---------------- orders ---------------- */

async function fetchOrders() {
  const data = await api.get<Record<string, any>[]>("/orders", true);
  ordersCache = data.map(normalizeOrder);
  notify();
}

export function getOrders(): Order[] {
  return ordersCache;
}
const getServerOrders = (): Order[] => [];

function subscribeOrders(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !ordersRequested && getToken()) {
    ordersRequested = true;
    fetchOrders().catch((e) => console.error("Failed to load orders:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/**
 * Public order submission. The server resolves the price from the database and
 * assigns the reference and status, so those are not sent from the client.
 */
export async function addOrder(
  o: Omit<Order, "id" | "createdAt" | "status" | "ref" | "productName" | "amount"> & { amount?: number }
): Promise<{ ref: string }> {
  return api.post<{ ref: string }>("/orders", o);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await api.patch(`/orders/${id}`, { status });
  await fetchOrders();
}

export async function deleteOrder(id: string) {
  await api.delete(`/orders/${id}`);
  await fetchOrders();
}

/** Called after login so the next admin screen refetches with the new session. */
export function resetOrdersSession() {
  ordersCache = [];
  ordersRequested = false;
  notify();
}

/* ---------------- hooks ---------------- */

export function useProducts(): HealingProduct[] {
  return useSyncExternalStore(subscribeProducts, getProducts, getServerProducts);
}
export function useProductsLoaded(): boolean {
  return useSyncExternalStore(subscribeProducts, productsAreLoaded, () => false);
}
/** Looks a product up by its id or its slug, matching the detail route. */
export function useProduct(key: string): HealingProduct | undefined {
  const products = useProducts();
  return products.find((p) => p.id === key || p.slug === key);
}
export function useCategories(): HealingCategory[] {
  return useSyncExternalStore(subscribeCategories, getCategories, getServerCategories);
}
export function useOrders(): Order[] {
  return useSyncExternalStore(subscribeOrders, getOrders, getServerOrders);
}
