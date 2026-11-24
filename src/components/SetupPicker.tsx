"use client";

import Link from "next/link";
import { useState } from "react";
import { BedDiagram } from "@/components/RoomVisuals";
import { btn } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { Room } from "@/lib/types";

// Pick a bed setup and see the price, then go to the request form with it.
export function SetupPicker({ room }: { room: Room }) {
  const setups = room.setups
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const bookable = setups.filter((s) => !s.onRequestOnly);
  const [selectedId, setSelectedId] = useState(bookable[0]?.id ?? null);
  const selected = setups.find((s) => s.id === selectedId);

  return (
    <fieldset className="mt-5">
      <legend className="sr-only">Bed setup</legend>
      <div className="space-y-2.5">
        {setups.map((s) => {
          const disabled = s.onRequestOnly;
          return (
            <label
              key={s.id}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition-colors ${
                disabled
                  ? "cursor-not-allowed border-dashed border-line bg-sand/60"
                  : "cursor-pointer border-line hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-sand"
              }`}
            >
              <input
                type="radio"
                name="setup"
                value={s.id}
                checked={selectedId === s.id}
                disabled={disabled}
                onChange={() => setSelectedId(s.id)}
                className="size-5 accent-[#3e160c]"
              />
              <BedDiagram setupName={s.name} />
              <span className="flex-1">
                <span className="block font-bold text-brown">{s.name}</span>
                <span className="block text-sm text-muted">
                  {disabled
                    ? "On request only. Ask us in person or by phone."
                    : `Up to ${s.maxGuests} ${s.maxGuests === 1 ? "guest" : "guests"}`}
                </span>
              </span>
              <span className="text-right font-display text-xl text-brown">
                {formatMoney(s.pricePerNight).replace(".00", "")}
                <span className="block font-sans text-xs text-muted">
                  a night
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {selected && (
        <Link
          href={`/book/room?room=${room.slug}&setup=${selected.id}`}
          className={`${btn.brown} mt-5 w-full`}
        >
          Request this room
        </Link>
      )}
      <p className="mt-3 text-center text-sm text-muted">
        No payment now. We confirm by phone or email.
      </p>
    </fieldset>
  );
}
