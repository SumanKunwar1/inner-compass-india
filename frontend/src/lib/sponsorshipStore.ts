import { useSyncExternalStore } from "react";
import { api, getToken } from "@/lib/api";

/**
 * API-backed store for membership / sponsorship plans and the applications people
 * submit against them. Same SSR-snapshot approach as shopStore.ts.
 */

export type PlanKind = "membership" | "dharma-ideal" | "community" | "corporate";

export const PLAN_KINDS: { key: PlanKind; label: string; blurb: string }[] = [
  { key: "membership", label: "Membership", blurb: "BTMC Foundation paid membership tiers" },
  { key: "dharma-ideal", label: "Dharma Ideal", blurb: "Individual & family sponsorship levels" },
  { key: "community", label: "Community", blurb: "Organisation & community sponsorship" },
  { key: "corporate", label: "Corporate", blurb: "Business & corporate sponsorship" },
];

export type MediaBenefit = { title: string; detail: string };

export type SponsorshipPlan = {
  id: string;
  kind: PlanKind;
  name: string;
  tagline: string;
  intro: string;
  fee: number;
  feeLabel: string;
  feeNote: string;
  period: string;
  inherits: string;
  benefits: string[];
  mediaBenefits: MediaBenefit[];
  suitableFor: string[];
  recognition: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApplicationStatus = "pending" | "verified" | "active" | "rejected";

export const APPLICATION_STATUSES: { key: ApplicationStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "verified", label: "Verified" },
  { key: "active", label: "Active" },
  { key: "rejected", label: "Rejected" },
];

export type Application = {
  id: string;
  ref: string;
  kind: PlanKind;
  planId: string;
  planName: string;
  planPeriod: string;
  amount: number;
  fullName: string;
  email: string;
  mobile: string;
  pan?: string;
  address?: string;
  message?: string;
  organisation?: string;
  designation?: string;
  website?: string;
  memberCount?: string;
  proofName?: string;
  proofDataUrl?: string;
  status: ApplicationStatus;
  adminNote?: string;
  createdAt: string;
};

/** What the public form sends. The server resolves the fee from the plan itself. */
export type ApplicationDraft = {
  kind: PlanKind;
  planId?: string;
  planName?: string;
  fullName: string;
  email: string;
  mobile: string;
  pan?: string;
  address?: string;
  message?: string;
  organisation?: string;
  designation?: string;
  website?: string;
  memberCount?: string;
  proofName?: string;
  proofDataUrl?: string;
};

const isBrowser = typeof window !== "undefined";

let plansCache: SponsorshipPlan[] = [];
let plansLoaded = false;
let plansRequested = false;
let applicationsCache: Application[] = [];
let applicationsRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function normalizePlan(d: Record<string, any>): SponsorshipPlan {
  return {
    id: String(d.id ?? ""),
    kind: d.kind,
    name: d.name ?? "",
    tagline: d.tagline ?? "",
    intro: d.intro ?? "",
    fee: Number(d.fee ?? 0),
    feeLabel: d.feeLabel ?? "",
    feeNote: d.feeNote ?? "",
    period: d.period ?? "",
    inherits: d.inherits ?? "",
    benefits: Array.isArray(d.benefits) ? d.benefits : [],
    mediaBenefits: Array.isArray(d.mediaBenefits) ? d.mediaBenefits : [],
    suitableFor: Array.isArray(d.suitableFor) ? d.suitableFor : [],
    recognition: d.recognition ?? "",
    featured: !!d.featured,
    published: d.published !== false,
    sortOrder: Number(d.sortOrder ?? 0),
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

/* ---------------- plans ---------------- */

/**
 * Drafts are only requested when an admin session exists, so a public visitor
 * never receives unpublished plans.
 */
async function fetchPlans() {
  const includeHidden = !!getToken();
  const data = await api.get<Record<string, any>[]>(
    `/sponsorship-plans${includeHidden ? "?includeHidden=true" : ""}`,
    includeHidden
  );
  plansCache = data.map(normalizePlan);
  plansLoaded = true;
  notify();
}

export const getPlans = (): SponsorshipPlan[] => plansCache;
export const plansAreLoaded = (): boolean => plansLoaded;
const getServerPlans = (): SponsorshipPlan[] => [];

function subscribePlans(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !plansRequested) {
    plansRequested = true;
    fetchPlans().catch((e) => console.error("Failed to load plans:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Re-reads plans — used after signing in, so drafts appear. */
export function refreshPlans() {
  return fetchPlans();
}

export async function savePlan(plan: SponsorshipPlan, originalId?: string) {
  if (originalId) await api.put(`/sponsorship-plans/${originalId}`, plan);
  else await api.post("/sponsorship-plans", plan, true);
  await fetchPlans();
}

export async function deletePlan(id: string) {
  await api.delete(`/sponsorship-plans/${id}`);
  await fetchPlans();
}

export function newPlanId(): string {
  return "plan_" + Math.random().toString(36).slice(2, 8);
}

/* ---------------- applications ---------------- */

function normalizeApplication(d: Record<string, any>): Application {
  return { ...d, id: String(d._id ?? d.id) } as Application;
}

async function fetchApplications() {
  const data = await api.get<Record<string, any>[]>("/applications", true);
  applicationsCache = data.map(normalizeApplication);
  notify();
}

export const getApplications = (): Application[] => applicationsCache;
const getServerApplications = (): Application[] => [];

function subscribeApplications(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !applicationsRequested && getToken()) {
    applicationsRequested = true;
    fetchApplications().catch((e) => console.error("Failed to load applications:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

/** Public submission. The server assigns the reference, status and amount. */
export async function submitApplication(draft: ApplicationDraft): Promise<{ ref: string }> {
  return api.post<{ ref: string }>("/applications", draft);
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus; adminNote?: string }
) {
  await api.patch(`/applications/${id}`, patch);
  await fetchApplications();
}

export async function deleteApplication(id: string) {
  await api.delete(`/applications/${id}`);
  await fetchApplications();
}

/** Called after login so the next admin screen refetches with the new session. */
export function resetApplicationsSession() {
  applicationsCache = [];
  applicationsRequested = false;
  notify();
}

/* ---------------- hooks ---------------- */

export function usePlans(kind?: PlanKind): SponsorshipPlan[] {
  const plans = useSyncExternalStore(subscribePlans, getPlans, getServerPlans);
  return kind ? plans.filter((p) => p.kind === kind) : plans;
}
export function usePlansLoaded(): boolean {
  return useSyncExternalStore(subscribePlans, plansAreLoaded, () => false);
}
export function usePlan(id: string): SponsorshipPlan | undefined {
  return usePlans().find((p) => p.id === id);
}
export function useApplications(): Application[] {
  return useSyncExternalStore(subscribeApplications, getApplications, getServerApplications);
}
