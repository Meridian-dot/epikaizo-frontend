"use client";

import { useState } from "react";
import { Stepper } from "@/components/forms/FormBits";
import { Photo } from "@/components/Photo";
import { field } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";

export type Quantities = Record<number, number>;
// The side chosen for a dish with side options, by menu item id.
export type Sides = Record<number, string>;

// Choose dishes and drinks with + and − buttons, one category at a time.
// Dishes with side options (set in the dashboard) ask which side once added.
export function ItemPicker({
  menu,
  quantities,
  onChange,
  sides = {},
  onSidesChange,
}: {
  menu: MenuCategory[];
  quantities: Quantities;
  onChange: (next: Quantities) => void;
  sides?: Sides;
  onSidesChange?: (next: Sides) => void;
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
              {item.photo && (
                <Photo
                  photo={item.photo}
                  label={item.name}
                  className="size-16 shrink-0 rounded-2xl"
                  sizes="64px"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brown">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-muted">{item.description}</p>
                )}
                <p className="text-sm font-bold text-gold-deep">
                  {formatMoney(item.price)}
                </p>
                {onSidesChange &&
                  (quantities[item.id] ?? 0) > 0 &&
                  (item.sideOptions?.length ?? 0) > 0 && (
                    <label className="mt-2 flex items-center gap-2 text-sm">
                      <span className="font-bold text-brown">With</span>
                      <select
                        className={`${field.input} w-auto py-1.5`}
                        value={sides[item.id] ?? item.sideOptions?.[0]}
                        onChange={(e) =>
                          onSidesChange({ ...sides, [item.id]: e.target.value })
                        }
                      >
                        {item.sideOptions?.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                  )}
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

/** Turns chosen quantities (and sides) into order lines and a total. */
export function summarise(
  menu: MenuCategory[],
  quantities: Quantities,
  sides: Sides = {},
) {
  const items = menu.flatMap((c) => c.items);
  const lines = Object.entries(quantities)
    .map(([id, quantity]) => {
      const item = items.find((i) => i.id === Number(id));
      if (!item) return null;
      const options = item.sideOptions ?? [];
      const side = options.length
        ? (options.find((o) => o === sides[item.id]) ?? options[0])
        : undefined;
      return { item, quantity, side };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null && l.quantity > 0);
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { lines, subtotal, count };
}
