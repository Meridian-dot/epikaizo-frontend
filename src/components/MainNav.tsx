"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { btn } from "@/components/ui";
import { mainNav } from "@/content/site";

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className="rounded-full px-3 py-2 font-bold text-brown transition-colors hover:bg-sand-deep aria-[current=page]:bg-sand-deep aria-[current=page]:text-brown-deep"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/book/room"
          className={`${btn.gold} ml-2 min-h-11 px-5 py-2`}
        >
          Book a room
        </Link>
      </nav>

      <div className="flex items-center gap-2 lg:hidden">
        <Link
          href="/book/room"
          className={`${btn.gold} min-h-11 px-4 py-2 text-sm`}
        >
          Book
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-full border-2 border-brown text-brown"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6 L18 18 M18 6 L6 18" />
            ) : (
              <path d="M4 7 H20 M4 12 H20 M4 17 H20" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full border-t border-line bg-white shadow-xl lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block border-b border-line py-4 font-display text-2xl text-brown aria-[current=page]:text-gold-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-wrap gap-3 py-4">
              <Link href="/book/room" className={btn.gold}>
                Request a room
              </Link>
              <Link href="/book/table" className={btn.outlineBrown}>
                Book a table
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
