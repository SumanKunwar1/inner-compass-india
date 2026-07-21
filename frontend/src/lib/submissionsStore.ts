import { useSyncExternalStore } from "react";
import { api, getToken } from "@/lib/api";

/**
 * API-backed store for public inbound submissions:
 *   - Donations (from the Donate page)
 *   - Contact messages (from the Contact page)
 * Both are admin-read with a status workflow.
 */

export type DonationStatus = "pending" | "received" | "thanked";
export type MessageStatus = "new" | "read" | "replied" | "archived";

export type Donation = {
  id: string;
  ref: string;
  createdAt: string;
  amount: number;
  fullName: string;
  email: string;
  mobile: string;
  pan?: string;
  message?: string;
  proofName: string;
  proofDataUrl?: string;
  status: DonationStatus;
};

export type Message = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
};

const isBrowser = typeof window !== "undefined";

let donationsCache: Donation[] = [];
let messagesCache: Message[] = [];
let donationsRequested = false;
let messagesRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const normalize = <T>(d: Record<string, any>): T => ({ ...d, id: String(d._id ?? d.id) } as T);

/* ---------------- donations ---------------- */

async function fetchDonations() {
  const data = await api.get<Record<string, any>[]>("/donations", true);
  donationsCache = data.map((d) => normalize<Donation>(d));
  notify();
}

export function getDonations(): Donation[] {
  return donationsCache;
}

function subscribeDonations(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !donationsRequested && getToken()) {
    donationsRequested = true;
    fetchDonations().catch((e) => console.error("Failed to load donations:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Public donation submission — server assigns ref + status. */
export async function addDonation(
  d: Omit<Donation, "id" | "createdAt" | "status" | "ref">
): Promise<{ ref: string }> {
  return api.post<{ ref: string }>("/donations", d);
}

export async function updateDonationStatus(id: string, status: DonationStatus) {
  await api.patch(`/donations/${id}`, { status });
  await fetchDonations();
}
export async function deleteDonation(id: string) {
  await api.delete(`/donations/${id}`);
  await fetchDonations();
}

/* ---------------- messages ---------------- */

async function fetchMessages() {
  const data = await api.get<Record<string, any>[]>("/messages", true);
  messagesCache = data.map((d) => normalize<Message>(d));
  notify();
}

export function getMessages(): Message[] {
  return messagesCache;
}

function subscribeMessages(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !messagesRequested && getToken()) {
    messagesRequested = true;
    fetchMessages().catch((e) => console.error("Failed to load messages:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Public contact form submission. */
export async function addMessage(m: { name: string; email: string; subject?: string; message: string }) {
  return api.post<{ id: string }>("/messages", m);
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  await api.patch(`/messages/${id}`, { status });
  await fetchMessages();
}
export async function deleteMessage(id: string) {
  await api.delete(`/messages/${id}`);
  await fetchMessages();
}

/** Reset caches on login/logout so the next admin screen refetches. */
export function resetSubmissionsSession() {
  donationsCache = [];
  messagesCache = [];
  donationsRequested = false;
  messagesRequested = false;
  notify();
}

/* ---------------- hooks ---------------- */

export function useDonations(): Donation[] {
  return useSyncExternalStore(subscribeDonations, getDonations, () => []);
}
export function useMessages(): Message[] {
  return useSyncExternalStore(subscribeMessages, getMessages, () => []);
}
