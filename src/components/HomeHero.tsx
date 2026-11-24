"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Baobab, Homestead, Horizon, Palm } from "@/components/Landscape";
import { WovenBand } from "@/components/Patterns";
import {
  phaseOf,
  useOutapiTime,
  type DayPhase,
} from "@/components/useOutapiTime";
import { btn } from "@/components/ui";
import { paragraphs } from "@/lib/format";

// The home page hero. The sky follows the real time of day in Outapi, so a
// guest browsing at night sees the stars over the baobab, and someone
// browsing at lunchtime sees the bright, hazy north. The scene shifts gently
// with the pointer and scroll (not with reduced motion).

const skies: Record<
  DayPhase,
  { top: string; mid: string; low: string; sun: string; light: boolean }
> = {
  dawn: {
    top: "#4a1e14",
    mid: "#a2522c",
    low: "#ecb769",
    sun: "#f6d48a",
    light: false,
  },
  day: {
    top: "#efdcb2",
    mid: "#f6ead0",
    low: "#fbf4e4",
    sun: "#ffffff",
    light: true,
  },
  dusk: {
    top: "#3e160c",
    mid: "#943f1e",
    low: "#e2a043",
    sun: "#f4c66a",
    light: false,
  },
  night: {
    top: "#0f0506",
    mid: "#2c120c",
    low: "#6a3520",
    sun: "#f3ead6",
    light: false,
  },
};

export function HomeHero({ title, body }: { title: string; body: string }) {
  const now = useOutapiTime();
  const phase: DayPhase = now ? phaseOf(now.hour) : "dusk";
  const sky = skies[phase];
  const sceneRef = useRef<HTMLDivElement>(null);

  // Gentle parallax: each layer moves a little with the pointer and scroll.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let px = 0;
    let frame = 0;
    const apply = () => {
      frame = 0;
      const sy = Math.min(window.scrollY, 600);
      scene.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const depth = Number(el.dataset.depth);
        el.style.transform = `translate3d(${px * depth * 18}px, ${sy * depth * -0.12}px, 0)`;
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onPointer = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      queue();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", queue);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The sun (or moon) travels across the sky with the hour.
  const hour = now ? now.hour + now.minute / 60 : 18.5;
  const dayProgress =
    phase === "night" ? ((hour + 4) % 24) / 9 : (hour - 5) / 15;
  // Kept to the right half, so it never sits behind the headline.
  const progress = Math.min(Math.max(dayProgress, 0), 1);
  const sunX = 56 + progress * 34;
  const sunY = 62 - Math.sin(progress * Math.PI) * 48;
  const textColour = sky.light ? "text-brown" : "text-white";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 55%, ${sky.low} 100%)`,
        transition: "background 1.5s ease",
      }}
    >
      <div ref={sceneRef} aria-hidden="true" className="absolute inset-0 -z-10">
        {phase === "night" && (
          <div data-depth="0.15" className="absolute inset-0">
            {Array.from({ length: 60 }, (_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 60}%`,
                  width: i % 5 === 0 ? 3 : 2,
                  height: i % 5 === 0 ? 3 : 2,
                  opacity: 0.35 + ((i * 7) % 6) / 10,
                }}
              />
            ))}
          </div>
        )}
        <div
          data-depth="0.2"
          className="absolute top-[66%] left-[var(--sun-x)] size-20 rounded-full blur-[1px] sm:top-[var(--sun-y)] sm:size-32"
          style={{
            ["--sun-x" as string]: `${sunX}%`,
            ["--sun-y" as string]: `${sunY}%`,
            background: sky.sun,
            boxShadow: `0 0 80px 30px ${sky.sun}66`,
            transition: "left 2s ease, top 2s ease",
          }}
        />
        <div
          data-depth="0.35"
          className="absolute inset-x-0 bottom-[16%] opacity-40"
        >
          <Horizon className="h-16 w-full sm:h-24" />
        </div>
        <div
          data-depth="0.5"
          className="absolute bottom-[14%] left-[4%] w-28 sm:w-40"
        >
          <Homestead className="w-full" />
        </div>
        <div
          data-depth="0.6"
          className="absolute bottom-[12%] left-[30%] hidden w-16 sm:block md:w-20"
        >
          <Palm className="w-full" />
        </div>
        <div
          data-depth="0.75"
          className="absolute -right-16 bottom-[6%] w-[22rem] sm:right-[2%] sm:w-[30rem] lg:w-[38rem]"
        >
          <Baobab className="w-full" />
        </div>
        <div
          data-depth="0.9"
          className="absolute right-[46%] bottom-[8%] w-14 sm:w-20"
        >
          <Palm className="w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Horizon className="h-20 w-full sm:h-28" />
          <div className="h-[6vh] bg-brown-deep" />
        </div>
      </div>

      <div
        className={`mx-auto flex min-h-[88svh] max-w-6xl flex-col px-5 pt-14 pb-56 sm:pt-24 sm:pb-72 ${textColour}`}
      >
        <p className="animate-rise text-sm font-bold tracking-[0.2em] uppercase opacity-90">
          {now ? (
            <>
              <span>{now.greeting.local}</span> · {now.greeting.english} from
              Outapi · <span className="tabular-nums">{now.time}</span>
            </>
          ) : (
            "Welcome to Outapi"
          )}
        </p>
        <h1
          id="hero-title"
          className={`mt-4 max-w-3xl animate-rise text-5xl [animation-delay:120ms] sm:text-7xl ${textColour}`}
        >
          {title}
        </h1>
        <div className="mt-6 max-w-xl animate-rise space-y-3 text-lg [animation-delay:240ms] sm:text-xl">
          {paragraphs(body).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
          <Link href="/rooms" className={btn.gold}>
            Explore our rooms
          </Link>
          <Link
            href="/restaurant"
            className={sky.light ? btn.outlineBrown : btn.outlineLight}
          >
            Discover our restaurant
          </Link>
        </div>
      </div>
      <WovenBand className="absolute inset-x-0 bottom-0 bg-brown-deep" />
    </section>
  );
}
