import { useSyncExternalStore } from "react";
import { healingProducts as SEED_PRODUCTS, type HealingProduct } from "@/data/healingItems";
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

let productsCache: HealingProduct[] = SEED_PRODUCTS;
let ordersCache: Order[] = [];
let productsRequested = false;
let ordersRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function normalizeOrder(d: Record<string, any>): Order {
  return { ...d, id: String(d._id ?? d.id) } as Order;
}

/* ---------------- products ---------------- */

async function fetchProducts() {
  const data = await api.get<Record<string, any>[]>("/products");
  productsCache = data as unknown as HealingProduct[];
  notify();
}

export function getProducts(): HealingProduct[] {
  return productsCache;
}
const getServerProducts = (): HealingProduct[] => SEED_PRODUCTS;

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
export function useOrders(): Order[] {
  return useSyncExternalStore(subscribeOrders, getOrders, getServerOrders);
}
