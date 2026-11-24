"use client";

import Link from "next/link";
import { useState } from "react";
import { BasketMotif } from "@/components/Patterns";
import { btn } from "@/components/ui";
import type { StoryChapter } from "@/content/site";

// The four stories of Epikaizo laid out as the four arms of the
// cross-shaped bunker the guesthouse stands on. Tap an arm to read its story.

const armPosition = [
  "col-start-2 row-start-1", // top
  "col-start-3 row-start-2", // right
  "col-start-2 row-start-3", // bottom
  "col-start-1 row-start-2", // left
];

export function StoryCross({ chapters }: { chapters: StoryChapter[] }) {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
      <div
        role="group"
        aria-label="Choose a story"
        className="mx-auto grid w-full max-w-[22rem] grid-cols-3 grid-rows-3 gap-2 sm:max-w-[26rem]"
      >
        {chapters.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(i)}
              className={`${armPosition[i]} group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 p-2 text-center transition-all duration-300 ${
                isActive
                  ? "scale-105 border-gold bg-brown text-white shadow-lg"
                  : "border-line bg-sand text-brown hover:border-gold hover:bg-sand-deep"
              }`}
            >
              <span
                className={`font-display text-3xl sm:text-4xl ${isActive ? "text-gold-light" : "text-gold-deep"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs leading-tight font-bold sm:text-sm">
                {c.label}
              </span>
            </button>
          );
        })}
        <div
          aria-hidden="true"
          className="col-start-2 row-start-2 flex items-center justify-center rounded-2xl bg-brown-deep"
        >
          <BasketMotif
            colour="#b9942c"
            className="size-[80%] transition-transform duration-700"
            style={{ transform: `rotate(${active * 45}deg)` }}
          />
        </div>
      </div>

      <div aria-live="polite" className="min-h-[16rem]">
        <p className="text-sm font-bold tracking-[0.2em] text-gold-deep uppercase">
          Story {active + 1} of {chapters.length} · {chapter.label}
        </p>
        <h3 key={chapter.id} className="mt-3 animate-rise text-4xl sm:text-5xl">
          {chapter.title}
        </h3>
        <p
          key={`${chapter.id}-body`}
          className="mt-4 max-w-xl animate-rise text-lg text-muted [animation-delay:100ms]"
        >
          {chapter.body}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={chapter.link.href} className={btn.brown}>
            {chapter.link.label}
          </Link>
          <button
            type="button"
            onClick={() => setActive((active + 1) % chapters.length)}
            className={btn.link}
          >
            Next story
          </button>
        </div>
      </div>
    </div>
  );
}
