import { useSyncExternalStore } from "react";
import { charityEvents as SEED_EVENTS, type CharityEvent } from "@/data/charityEvents";
import { api, setToken, clearToken, getToken } from "@/lib/api";

/**
 * API-backed store for charity events, bookings and admin auth.
 *
 * Data lives in MongoDB behind the backend API. The bundled seed data is used only
 * as the server-render snapshot so public pages still have meaningful HTML on first
 * paint; live values replace it as soon as the client fetches.
 */

export type BookingStatus = "pending" | "confirmed" | "rejected";

export type Booking = {
  id: string;
  ref: string;
  createdAt: string;
  eventSlug: string;
  eventTitle: string;
  session: string;
  sessionLabel: string;
  seats: number;
  amount: number;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  message?: string;
  proofName: string;
  proofDataUrl?: string;
  status: BookingStatus;
};

const isBrowser = typeof window !== "undefined";

/* ---------------- state ---------------- */

let eventsCache: CharityEvent[] = SEED_EVENTS;
let bookingsCache: Booking[] = [];
let eventsRequested = false;
let bookingsRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/** Maps a Mongo document to the shape the UI expects. */
function normalizeBooking(d: Record<string, any>): Booking {
  return { ...d, id: String(d._id ?? d.id) } as Booking;
}

/* ---------------- events ---------------- */

async function fetchEvents() {
  const data = await api.get<Record<string, any>[]>("/events");
  eventsCache = data as unknown as CharityEvent[];
  notify();
}

export function getEvents(): CharityEvent[] {
  return eventsCache;
}
const getServerEvents = (): CharityEvent[] => SEED_EVENTS;

function subscribeEvents(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !eventsRequested) {
    eventsRequested = true;
    fetchEvents().catch((e) => console.error("Failed to load events:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

export async function saveEvent(event: CharityEvent, originalSlug?: string) {
  if (originalSlug) await api.put(`/events/${originalSlug}`, event);
  else await api.post("/events", event, true);
  await fetchEvents();
}

export async function deleteEvent(slug: string) {
  await api.delete(`/events/${slug}`);
  await fetchEvents();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/* ---------------- bookings ---------------- */

async function fetchBookings() {
  const data = await api.get<Record<string, any>[]>("/bookings", true);
  bookingsCache = data.map(normalizeBooking);
  notify();
}

export function getBookings(): Booking[] {
  return bookingsCache;
}
const getServerBookings = (): Booking[] => [];

function subscribeBookings(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !bookingsRequested && getToken()) {
    bookingsRequested = true;
    fetchBookings().catch((e) => console.error("Failed to load bookings:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Public form submission — the server assigns the reference and status. */
export async function addBooking(
  b: Omit<Booking, "id" | "createdAt" | "status" | "ref">
): Promise<{ ref: string }> {
  return api.post<{ ref: string }>("/bookings", b);
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await api.patch(`/bookings/${id}`, { status });
  await fetchBookings();
}

export async function deleteBooking(id: string) {
  await api.delete(`/bookings/${id}`);
  await fetchBookings();
}

/* ---------------- auth ---------------- */

export function isAuthed(): boolean {
  return !!getToken();
}

export async function login(email: string, password: string): Promise<void> {
  const { token } = await api.post<{ token: string }>("/auth/login", { email, password });
  setToken(token);
  bookingsRequested = false; // refetch with the new session
  notify();
}

export function logout() {
  clearToken();
  bookingsCache = [];
  bookingsRequested = false;
  notify();
}

/* ---------------- hooks ---------------- */

export function useEvents(): CharityEvent[] {
  return useSyncExternalStore(subscribeEvents, getEvents, getServerEvents);
}
export function useEvent(slug: string): CharityEvent | undefined {
  return useEvents().find((e) => e.slug === slug);
}
export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribeBookings, getBookings, getServerBookings);
}
export function useIsAuthed(): boolean {
  return useSyncExternalStore(subscribeEvents, isAuthed, () => false);
}
