"use client";

import { useState, useTransition } from "react";
import {
  Confirmation,
  ContactFields,
  Field,
  FormError,
  Stepper,
} from "@/components/forms/FormBits";
import {
  ItemPicker,
  summarise,
  type Quantities,
  type Sides,
} from "@/components/forms/ItemPicker";
import { btn, field } from "@/components/ui";
import { submitTableBooking } from "@/lib/actions";
import {
  addDays,
  formatDate,
  formatMoney,
  formatTime,
  minutesOf,
  outapiNow,
} from "@/lib/format";
import type {
  MenuCategory,
  PublicSettings,
  RequestReceived,
} from "@/lib/types";

function slotsFor(settings: PublicSettings) {
  const { openingTime, closingTime, slotMinutes } = settings.restaurant;
  const open = minutesOf(openingTime);
  const close = minutesOf(closingTime);
  const step = Math.max(15, slotMinutes);
  const slots: { start: string; end: string }[] = [];
  for (let m = open; m < close; m += step) {
    const end = Math.min(m + step, close);
    const hhmm = (x: number) =>
      `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
    slots.push({ start: hhmm(m), end: hhmm(end) });
  }
  return slots;
}

const slotName = (start: string) => {
  const h = Number(start.slice(0, 2));
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
};

export function TableBookingForm({
  menu,
  settings,
}: {
  menu: MenuCategory[];
  settings: PublicSettings;
}) {
  const now = outapiNow();
  const slots = slotsFor(settings);
  const [date, setDate] = useState(now.date);
  const [slot, setSlot] = useState<string | null>(null);
  const [party, setParty] = useState(2);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [notes, setNotes] = useState("");
  const [wantsFood, setWantsFood] = useState(false);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [sides, setSides] = useState<Sides>({});
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState<RequestReceived | null>(null);
  const [pending, startTransition] = useTransition();

  const isToday = date === now.date;
  const slotOver = (s: { end: string }) =>
    isToday && minutesOf(s.end) <= now.minutesOfDay;
  const noticeMinutes = settings.foodOrders.preOrderNoticeHours * 60;
  const canPreOrder =
    !slot || !isToday || minutesOf(slot) - now.minutesOfDay >= noticeMinutes;
  const order = summarise(
    menu,
    wantsFood && canPreOrder ? quantities : {},
    sides,
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) {
      setError("Please choose a time.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitTableBooking({
        date,
        timeSlot: slot,
        partySize: party,
        guestName: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        notes: notes.trim(),
        preOrder: order.lines.map((l) => ({
          menuItemId: l.item.id,
          quantity: l.quantity,
          ...(l.side ? { side: l.side } : {}),
        })),
      });
      if (result.ok) {
        setReceived(result.received);
        window.scrollTo({ top: 0 });
      } else setError(result.message);
    });
  };

  if (received && slot) {
    return (
      <Confirmation received={received} title="Your table request is in">
        <p>
          {party} {party === 1 ? "person" : "people"}, {formatDate(date)}, from{" "}
          {formatTime(slot)}.
        </p>
        {order.count > 0 && (
          <p>
            Your food ({order.count} {order.count === 1 ? "item" : "items"},{" "}
            {formatMoney(order.subtotal)}) will be ready when you arrive. Pay at
            the table.
          </p>
        )}
        <p>We will call or email you to confirm.</p>
      </Confirmation>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0 space-y-10">
        <fieldset>
          <legend className="font-display text-2xl text-brown">
            1. When are you coming?
          </legend>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Date">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={field.input}
                  min={now.date}
                  max={addDays(now.date, 365)}
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlot(null);
                  }}
                />
              )}
            </Field>
            <div>
              <p className={field.label}>How many people?</p>
              <div className="mt-2">
                <Stepper
                  label="People"
                  value={party}
                  min={1}
                  max={settings.restaurant.maxCoversPerSlot}
                  onChange={setParty}
                />
              </div>
            </div>
          </div>
          <p className={`${field.label} mt-6`}>Time</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {slots.map((s) => {
              const over = slotOver(s);
              return (
                <label
                  key={s.start}
                  className={`rounded-2xl border-2 p-4 text-center transition-colors ${
                    over
                      ? "cursor-not-allowed border-dashed border-line text-muted opacity-60"
                      : "cursor-pointer border-line hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-sand"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    className="sr-only"
                    disabled={over}
                    checked={slot === s.start}
                    onChange={() => setSlot(s.start)}
                  />
                  <span className="block font-display text-xl text-brown">
                    {slotName(s.start)}
                  </span>
                  <span className="text-sm text-muted">
                    {formatTime(s.start)} to {formatTime(s.end)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl text-brown">
            2. Your details
          </legend>
          <div className="mt-4 space-y-5">
            <ContactFields
              name={contact.name}
              phone={contact.phone}
              email={contact.email}
              onChange={(k, v) => setContact((c) => ({ ...c, [k]: v }))}
            />
            <Field
              label="Anything we should know? (optional)"
              hint="A birthday, a high chair, a group."
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

        <fieldset className="rounded-3xl bg-sand p-5 sm:p-6">
          <legend className="sr-only">
            3. Food ready when you arrive (optional)
          </legend>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={wantsFood}
              onChange={(e) => setWantsFood(e.target.checked)}
              className="mt-1 size-5 accent-[#3e160c]"
            />
            <span>
              <span className="block font-display text-2xl text-brown">
                3. Have your food ready when you arrive
              </span>
              <span className="text-muted">
                Optional. Order at least{" "}
                {settings.foodOrders.preOrderNoticeHours} hours ahead.
              </span>
            </span>
          </label>
          {wantsFood &&
            (canPreOrder ? (
              <div className="mt-5">
                <ItemPicker
                  menu={menu}
                  quantities={quantities}
                  onChange={setQuantities}
                  sides={sides}
                  onSidesChange={setSides}
                />
              </div>
            ) : (
              <p className="mt-4 font-bold text-brown">
                That time is less than {settings.foodOrders.preOrderNoticeHours}{" "}
                hours away, so please order when you arrive.
              </p>
            ))}
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="rounded-3xl bg-brown p-6 text-white">
          <h2 className="text-2xl text-gold-light">Your table</h2>
          <dl className="mt-4 space-y-2 text-white/85">
            <div className="flex justify-between gap-4">
              <dt>Date</dt>
              <dd className="font-bold text-white">
                {date ? formatDate(date) : "Choose a date"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Time</dt>
              <dd className="font-bold text-white">
                {slot ? `From ${formatTime(slot)}` : "Choose a time"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>People</dt>
              <dd className="font-bold text-white">{party}</dd>
            </div>
          </dl>
          {order.count > 0 && (
            <div className="mt-5 border-t border-white/20 pt-4">
              <p className="font-bold text-gold-light">Food ready on arrival</p>
              <ul className="mt-2 space-y-1 text-sm text-white/85">
                {order.lines.map((l) => (
                  <li key={l.item.id} className="flex justify-between gap-3">
                    <span>
                      {l.quantity} × {l.item.name}
                      {l.side ? ` with ${l.side}` : ""}
                    </span>
                    <span>{formatMoney(l.item.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between font-bold">
                <span>Food total</span>
                <span>{formatMoney(order.subtotal)}</span>
              </p>
            </div>
          )}
          <p className="mt-4 text-sm text-white/70">
            No payment now. Pay at the restaurant.
          </p>
        </div>
        <div className="mt-5 space-y-4">
          <FormError message={error} />
          <button
            type="submit"
            disabled={pending}
            className={`${btn.gold} w-full`}
          >
            {pending ? "Sending…" : "Request my table"}
          </button>
        </div>
      </aside>
    </form>
  );
}
