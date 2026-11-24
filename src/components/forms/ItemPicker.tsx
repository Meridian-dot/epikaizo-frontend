"use client";

import { useState } from "react";
import { Stepper } from "@/components/forms/FormBits";
import { formatMoney } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";

export type Quantities = Record<number, number>;

// Choose dishes and drinks with + and − buttons, one category at a time.
export function ItemPicker({
  menu,
  quantities,
  onChange,
}: {
  menu: MenuCategory[];
  quantities: Quantities;
  onChange: (next: Quantities) => void;
}) {
  const categories = [...menu].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  const countIn = (categoryId: number) =>
    categories
      .find((c) => c.id === categoryId)
      ?.items.reduce((sum, i) => sum + (quantities[i.id] ?? 0), 0) ?? 0;

  const set = (id: number, qty: number) => {
    const next = { ...quantities };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    onChange(next);
  };

  if (!active) return null;

  return (
    <div>
      <div
        role="group"
        aria-label="Menu sections"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
      >
        {categories.map((c) => {
          const count = countIn(c.id);
          const selected = c.id === active.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(c.id)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors ${
                selected
                  ? "border-brown bg-brown text-white"
                  : "border-line text-brown hover:border-gold"
              }`}
            >
              {c.name}
              {count > 0 && (
                <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs text-brown-deep">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ul aria-label={active.name} className="mt-3 divide-y divide-line">
        {[...active.items]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brown">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-muted">{item.description}</p>
                )}
                <p className="text-sm font-bold text-gold-deep">
                  {formatMoney(item.price)}
                </p>
              </div>
              {item.isAvailable ? (
                <Stepper
                  label={`How many ${item.name}`}
                  value={quantities[item.id] ?? 0}
                  min={0}
                  max={20}
                  onChange={(qty) => set(item.id, qty)}
                />
              ) : (
                <span className="rounded-full bg-sand-deep px-3 py-1 text-xs font-bold text-muted">
                  Not available today
                </span>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

/** Turns chosen quantities into order lines and a total. */
export function summarise(menu: MenuCategory[], quantities: Quantities) {
  const items = menu.flatMap((c) => c.items);
  const lines = Object.entries(quantities)
    .map(([id, quantity]) => {
      const item = items.find((i) => i.id === Number(id));
      return item ? { item, quantity } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null && l.quantity > 0);
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { lines, subtotal, count };
}
