"use client";

import { useSyncExternalStore } from "react";
import { greetings } from "@/content/site";
import { outapiNow } from "@/lib/format";

// The current time in Outapi, updated every 30 seconds. Returns null while
// rendering on the server, so the page never shows a wrong time.

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}

// Rounded to the minute so the snapshot stays stable between ticks.
const getSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerSnapshot = () => null;

export function useOutapiTime() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (now === null) return null;
  const time = outapiNow(now);
  const greeting =
    greetings.find((g) => time.hour >= g.from && time.hour < g.until) ??
    greetings[0];
  return { ...time, greeting };
}

export type DayPhase = "dawn" | "day" | "dusk" | "night";

export function phaseOf(hour: number): DayPhase {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}
