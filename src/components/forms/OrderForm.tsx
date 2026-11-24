"use client";

import { useState, useTransition } from "react";
import {
  Confirmation,
  ContactFields,
  Field,
  FormError,
} from "@/components/forms/FormBits";
import {
  ItemPicker,
  summarise,
  type Quantities,
} from "@/components/forms/ItemPicker";
import { btn, field } from "@/components/ui";
import { submitFoodOrder } from "@/lib/actions";
import { formatMoney, formatTime, minutesOf, outapiNow } from "@/lib/format";
import type {
  Fulfilment,
  MenuCategory,
  PublicSettings,
  RequestReceived,
} from "@/lib/types";

export function OrderForm({
  menu,
  settings,
}: {
  menu: MenuCategory[];
  settings: PublicSettings;
}) {
  const f = settings.foodOrders;
  const [fulfilment, setFulfilment] = useState<Fulfilment>("collection");
  const [quantities, setQuantities] = useState<Quantities>({});
  const [roomNumber, setRoomNumber] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState<RequestReceived | null>(null);
  const [pending, startTransition] = useTransition();

  const order = summarise(menu, quantities);
  const fee = fulfilment === "room-service" ? f.roomServiceFee : 0;
  const total = order.subtotal + fee;

  const now = outapiNow().minutesOfDay;
  const [from, until] =
    fulfilment === "room-service"
      ? [f.roomServiceFrom, f.roomServiceUntil]
      : [f.collectionFrom, f.collectionUntil];
  const isOpen =
    f.isOrderingOpen && now >= minutesOf(from) && now < minutesOf(until);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitFoodOrder({
        fulfilment,
        roomNumber: fulfilment === "room-service" ? roomNumber.trim() : null,
        items: order.lines.map((l) => ({
          menuItemId: l.item.id,
          quantity: l.quantity,
        })),
        guestName: contact.name.trim(),
        phone: contact.phone.trim(),
        notes: notes.trim(),
      });
      if (result.ok) {
        setReceived(result.received);
        window.scrollTo({ top: 0 });
      } else setError(result.message);
    });
  };

  if (received) {
    return (
      <Confirmation received={received} title="Your order is with the kitchen">
        <p>
          {fulfilment === "room-service"
            ? `We'll bring it to room ${roomNumber} in about ${f.prepMinutes} minutes.`
            : `It will be ready to collect in about ${f.prepMinutes} minutes.`}
        </p>
        <p>
          Total {formatMoney(total)}. Pay by cash or card when you{" "}
          {fulfilment === "room-service" ? "receive it" : "collect it"}.
        </p>
      </Confirmation>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-10 pb-28 lg:grid-cols-[1.5fr_1fr] lg:pb-0"
    >
      <div className="min-w-0 space-y-10">
        <fieldset>
          <legend className="font-display text-2xl text-brown">
            1. How would you like it?
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: "collection",
                  title: "Collect it",
                  text: `Anyone can order. ${formatTime(f.collectionFrom)} to ${formatTime(f.collectionUntil)}.`,
                },
                {
                  value: "room-service",
                  title: "Bring it to my room",
                  text: `For our guests. ${formatTime(f.roomServiceFrom)} to ${formatTime(f.roomServiceUntil)}, ${formatMoney(f.roomServiceFee)} delivery.`,
                },
              ] as const
            ).map((o) => (
              <label
                key={o.value}
                className="cursor-pointer rounded-2xl border-2 border-line p-4 transition-colors hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-sand"
              >
                <input
                  type="radio"
                  name="fulfilment"
                  className="sr-only"
                  checked={fulfilment === o.value}
                  onChange={() => setFulfilment(o.value)}
                />
                <span className="block font-display text-xl text-brown">
                  {o.title}
                </span>
                <span className="text-sm text-muted">{o.text}</span>
              </label>
            ))}
          </div>
          {!isOpen && (
            <p className="mt-4 rounded-2xl bg-sand-deep px-4 py-3 font-bold text-brown">
              {f.isOrderingOpen
                ? `The kitchen takes these orders from ${formatTime(from)} to ${formatTime(until)}. You can look through the menu now and order then.`
                : "Online ordering is paused right now. Please call us to order."}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl text-brown">
            2. Choose your food
          </legend>
          <div className="mt-4">
            <ItemPicker
              menu={menu}
              quantities={quantities}
              onChange={setQuantities}
            />
          </div>
        </fieldset>

        <fieldset id="order-details">
          <legend className="font-display text-2xl text-brown">
            3. Your details
          </legend>
          <div className="mt-4 space-y-5">
            {fulfilment === "room-service" && (
              <Field label="Room number">
                {(id) => (
                  <input
                    id={id}
                    className={`${field.input} max-w-40`}
                    inputMode="numeric"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                )}
              </Field>
            )}
            <ContactFields
              name={contact.name}
              phone={contact.phone}
              showEmail={false}
              onChange={(k, v) => setContact((c) => ({ ...c, [k]: v }))}
            />
            <Field
              label="Notes for the kitchen (optional)"
              hint="No onions, extra sauce, which side you want."
            >
              {(id, hint) => (
                <textarea
                  id={id}
                  aria-describedby={hint}
                  rows={2}
                  className={field.input}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              )}
            </Field>
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="rounded-3xl bg-brown p-6 text-white">
          <h2 className="text-2xl text-gold-light">Your order</h2>
          {order.count === 0 ? (
            <p className="mt-3 text-white/75">
              Nothing yet. Add something from the menu.
            </p>
          ) : (
            <ul className="mt-4 space-y-1.5 text-white/85">
              {order.lines.map((l) => (
                <li key={l.item.id} className="flex justify-between gap-3">
                  <span>
                    {l.quantity} × {l.item.name}
                  </span>
                  <span className="whitespace-nowrap">
                    {formatMoney(l.item.price * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-5 space-y-1 border-t border-white/20 pt-4 text-white/85">
            <div className="flex justify-between">
              <dt>Food</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            {fee > 0 && (
              <div className="flex justify-between">
                <dt>Room delivery</dt>
                <dd>{formatMoney(fee)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-bold text-white">Total</dt>
              <dd className="font-display text-3xl text-gold-light">
                {formatMoney(total)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-white/70">
            Ready in about {f.prepMinutes} minutes. Pay by cash or card on{" "}
            {fulfilment === "room-service" ? "delivery" : "collection"}.
          </p>
        </div>
        <div className="mt-5 space-y-4">
          <FormError message={error} />
          <button
            type="submit"
            disabled={pending || order.count === 0 || !isOpen}
            className={`${btn.gold} w-full`}
          >
            {pending ? "Sending…" : `Place order · ${formatMoney(total)}`}
          </button>
        </div>
      </aside>

      {/* On phones, a bar at the bottom keeps the total in view. */}
      {order.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/40 bg-brown px-5 py-3 text-white lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p>
              <span className="font-bold">{order.count}</span>{" "}
              {order.count === 1 ? "item" : "items"} ·{" "}
              <span className="font-display text-xl text-gold-light">
                {formatMoney(total)}
              </span>
            </p>
            <a
              href="#order-details"
              className={`${btn.gold} min-h-11 px-5 py-2`}
            >
              Continue
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
