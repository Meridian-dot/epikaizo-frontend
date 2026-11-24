"use client";

import { useSyncExternalStore } from "react";

// Renders its children only in the browser. Used for forms that depend on
// the current time in Outapi (today's date, which slots are still open),
// so the page never shows a date baked in when the site was built.

const subscribe = () => () => {};

export function NoSsr({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return isClient ? children : fallback;
}
