"use client";

import { Baobab } from "@/components/Landscape";
import { btn } from "@/components/ui";

// Last safety net: if a page still fails to load (for example the API is
// down), show a friendly message instead of a crash.
export default function PageError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center">
      <Baobab className="w-64 opacity-90" />
      <h1 className="mt-6 text-5xl">We couldn&apos;t load this page</h1>
      <p className="mt-4 text-lg text-muted">
        Sorry, something is slow on our side. Please try again in a minute, or
        call us on +264 81 8230 233.
      </p>
      <button type="button" onClick={reset} className={`${btn.brown} mt-8`}>
        Try again
      </button>
    </section>
  );
}
