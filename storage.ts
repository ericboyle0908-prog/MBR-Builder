"use client";

import { GeoSubmission } from "./types";
import { seedSubmissions } from "./mock-data";

const KEY = "mbr-hub-submissions-v1";

export function loadSubmissions(): GeoSubmission[] {
  if (typeof window === "undefined") return seedSubmissions;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return seedSubmissions;
  try {
    return JSON.parse(raw) as GeoSubmission[];
  } catch {
    return seedSubmissions;
  }
}

export function saveSubmissions(items: GeoSubmission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function resetSubmissions() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
