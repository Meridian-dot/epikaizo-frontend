"use client";

import { useState } from "react";
import { bunkerParts } from "@/content/site";

// An illustrated, tappable plan of the cross-shaped bunker. Not to scale.
const arms = {
  north: "M140 10 H260 V140 H140 Z",
  east: "M260 140 H390 V260 H260 Z",
  south: "M140 260 H260 V390 H140 Z",
  west: "M10 140 H140 V260 H10 Z",
} as const;

const labelPos = {
  north: { x: 200, y: 80 },
  east: { x: 325, y: 205 },
  south: { x: 200, y: 330 },
  west: { x: 75, y: 205 },
} as const;

export function BunkerPlan() {
  const [active, setActive] =
    useState<(typeof bunkerParts)[number]["id"]>("north");
  const part = bunkerParts.find((p) => p.id === active) ?? bunkerParts[0];

  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="relative mx-auto w-full max-w-sm">
        <svg viewBox="0 0 400 400" className="w-full" aria-hidden="true">
          <defs>
            <pattern
              id="bunker-hatch"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <path
                d="M0 0 V10"
                stroke="#b9942c"
                strokeWidth="2"
                opacity="0.35"
              />
            </pattern>
          </defs>
          {bunkerParts.map((p) => {
            const on = p.id === active;
            return (
              <g key={p.id}>
                <path
                  d={arms[p.id]}
                  fill={on ? "#3e160c" : "url(#bunker-hatch)"}
                  stroke="#3e160c"
                  strokeWidth="4"
                  className="transition-colors duration-300"
                />
                <text
                  x={labelPos[p.id].x}
                  y={labelPos[p.id].y}
                  textAnchor="middle"
                  className="font-sans text-[12px] font-bold"
                  fill={on ? "#e8d8a6" : "#3e160c"}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          <rect
            x="140"
            y="140"
            width="120"
            height="120"
            fill="#b9942c"
            stroke="#3e160c"
            strokeWidth="4"
          />
          <circle cx="200" cy="200" r="10" fill="#3e160c" />
        </svg>
        {/* Real buttons over each arm, for touch, mouse and keyboard. */}
        {bunkerParts.map((p) => {
          const pos = {
            north: "left-[35%] top-[2.5%] h-[32.5%] w-[30%]",
            east: "left-[65%] top-[35%] h-[30%] w-[32.5%]",
            south: "left-[35%] top-[65%] h-[32.5%] w-[30%]",
            west: "left-[2.5%] top-[35%] h-[30%] w-[32.5%]",
          }[p.id];
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === active}
              onClick={() => setActive(p.id)}
              className={`absolute ${pos} rounded-md`}
            >
              <span className="sr-only">{p.label}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        <p className="text-sm font-bold tracking-[0.2em] text-gold-deep uppercase">
          Inside the bunker
        </p>
        <h3 key={part.id} className="mt-2 animate-rise text-3xl">
          {part.label}
        </h3>
        <p
          key={`${part.id}-b`}
          className="mt-3 animate-rise text-lg text-muted"
        >
          {part.body}
        </p>
        <p className="mt-6 text-sm text-muted">
          Tap an arm of the cross to explore. Illustration, not to scale.
        </p>
      </div>
    </div>
  );
}
