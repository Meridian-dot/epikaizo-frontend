"use client";

import { useOutapiTime } from "@/components/useOutapiTime";

// A thin bar above the header: the greeting of the hour in Oshiwambo and
// the time in Outapi, so guests far away feel where they are going.
export function GreetingBar({ phone }: { phone: string }) {
  const now = useOutapiTime();
  return (
    <div className="bg-brown text-sm text-white/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-1.5">
        <p className="truncate">
          {now ? (
            <>
              <span className="font-bold text-gold-light">
                {now.greeting.local}
              </span>{" "}
              <span className="text-white/70">({now.greeting.english})</span>
              <span className="hidden sm:inline">
                {" "}
                · It&apos;s <span className="tabular-nums">{now.time}</span> in
                Outapi
              </span>
            </>
          ) : (
            <span className="text-white/70">Welcome to Outapi</span>
          )}
        </p>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="shrink-0 font-bold text-gold-light hover:text-white"
        >
          {phone}
        </a>
      </div>
    </div>
  );
}
