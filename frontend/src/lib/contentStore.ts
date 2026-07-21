import { useSyncExternalStore } from "react";
import { api } from "@/lib/api";

/**
 * API-backed store for editable site content:
 *   - Team members (CRUD, shown on the About page)
 *   - Site settings singleton (hero text, org contact, socials, stats)
 */

export type Socials = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  image?: string;
  order: number;
  socials: Socials;
};

export type SiteSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  orgPhones: string[];
  orgEmail: string;
  orgAddress: string;
  website: string;
  socials: Socials;
  stats: { label: string; value: string }[];
};

const SETTINGS_FALLBACK: SiteSettings = {
  heroBadge: "Healing · Meditation · Dharma Discourse · Charity",
  heroTitle: "A Day of Healing, Blessings & Inner Peace",
  heroSubtitle: "",
  orgPhones: ["+91-8178804502"],
  orgEmail: "info@btmcfoundation.in",
  orgAddress: "Head Office: Siliguri, West Bengal · Contact Office: Paharganj, New Delhi",
  website: "www.btmcfoundation.in",
  socials: {
    facebook: "https://www.facebook.com/BTMCFoundation",
    instagram: "https://www.instagram.com/btmcfoundation/",
    youtube: "https://www.youtube.com/@dharmatelevision",
  },
  stats: [],
};

const isBrowser = typeof window !== "undefined";

let teamCache: TeamMember[] = [];
let settingsCache: SiteSettings = SETTINGS_FALLBACK;
let teamRequested = false;
let settingsRequested = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/* ---------------- team ---------------- */

async function fetchTeam() {
  const data = await api.get<Record<string, any>[]>("/team");
  teamCache = data as unknown as TeamMember[];
  notify();
}

export function getTeam(): TeamMember[] {
  return teamCache;
}

function subscribeTeam(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !teamRequested) {
    teamRequested = true;
    fetchTeam().catch((e) => console.error("Failed to load team:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

export function newTeamId(): string {
  return "tm_" + Math.random().toString(36).slice(2, 8);
}

export async function saveTeamMember(member: TeamMember, originalId?: string) {
  if (originalId) await api.put(`/team/${originalId}`, member);
  else await api.post("/team", member, true);
  await fetchTeam();
}

export async function deleteTeamMember(id: string) {
  await api.delete(`/team/${id}`);
  await fetchTeam();
}

/* ---------------- settings ---------------- */

async function fetchSettings() {
  const data = await api.get<SiteSettings>("/settings");
  settingsCache = { ...SETTINGS_FALLBACK, ...data };
  notify();
}

export function getSettings(): SiteSettings {
  return settingsCache;
}
const getServerSettings = (): SiteSettings => SETTINGS_FALLBACK;

function subscribeSettings(cb: () => void) {
  listeners.add(cb);
  if (isBrowser && !settingsRequested) {
    settingsRequested = true;
    fetchSettings().catch((e) => console.error("Failed to load settings:", e.message));
  }
  return () => {
    listeners.delete(cb);
  };
}

export async function saveSettings(settings: SiteSettings) {
  const saved = await api.put<SiteSettings>("/settings", settings);
  settingsCache = { ...SETTINGS_FALLBACK, ...saved };
  notify();
}

/* ---------------- hooks ---------------- */

export function useTeam(): TeamMember[] {
  return useSyncExternalStore(subscribeTeam, getTeam, () => []);
}
export function useSettings(): SiteSettings {
  return useSyncExternalStore(subscribeSettings, getSettings, getServerSettings);
}
