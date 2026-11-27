"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Confirmation,
  ContactFields,
  Field,
  FormError,
  Stepper,
} from "@/components/forms/FormBits";
import { BedDiagram } from "@/components/RoomVisuals";
import { btn, field } from "@/components/ui";
import { checkRoomAvailability, submitRoomBooking } from "@/lib/actions";
import {
  addDays,
  formatDate,
  formatMoney,
  nightsBetween,
  outapiNow,
} from "@/lib/format";
import type { PublicSettings, RequestReceived, Room } from "@/lib/types";

export function RoomRequestForm({
  rooms,
  settings,
}: {
  rooms: Room[];
  settings: PublicSettings;
}) {
  const params = useSearchParams();
  const initialRoom =
    rooms.find((r) => r.slug === params.get("room")) ?? rooms[0];
  const bookable = (room: Room | undefined) =>
    (room?.setups ?? [])
      .filter((s) => s.isActive && !s.onRequestOnly)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  const initialSetup =
    bookable(initialRoom).find((s) => s.id === Number(params.get("setup"))) ??
    bookable(initialRoom)[0];

  const today = outapiNow().date;
  const [roomId, setRoomId] = useState(initialRoom?.id);
  const [setupId, setSetupId] = useState(initialSetup?.id);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState<RequestReceived | null>(null);
  const [pending, startTransition] = useTransition();

  const room = rooms.find((r) => r.id === roomId);
  const setups = bookable(room);
  const setup = setups.find((s) => s.id === setupId) ?? setups[0];
  const maxGuests = setup?.maxGuests ?? 1;
  const nights = Math.max(0, nightsBetween(checkIn, checkOut));
  const total = setup ? setup.pricePerNight * nights : 0;
  const lastDate = addDays(today, 365);

  // Ask the API which nights are full whenever the room or dates change.
  // `checkKey` names what was asked, so an old answer is never shown for new
  // dates. If the check fails, the guest can still send the request.
  const checkKey =
    room && nights > 0 ? `${room.id}|${checkIn}|${checkOut}` : "";
  const [availability, setAvailability] = useState<{
    key: string;
    known: boolean;
    fullNights: string[];
  } | null>(null);
  useEffect(() => {
    if (!checkKey) return;
    let cancelled = false;
    const [id, from, to] = checkKey.split("|");
    checkRoomAvailability(Number(id), from, to)
      .then((result) => {
        if (cancelled) return;
        setAvailability({
          key: checkKey,
          known: result !== null,
          fullNights: (result?.nights ?? [])
            .filter((n) => n.available < 1)
            .map((n) => n.date),
        });
      })
      .catch(() => {
        if (!cancelled)
          setAvailability({ key: checkKey, known: false, fullNights: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [checkKey]);
  const current = availability?.key === checkKey ? availability : null;
  const checking = Boolean(checkKey) && current === null;
  const fullNights = current?.fullNights ?? [];

  const chooseRoom = (id: number) => {
    setRoomId(id);
    const first = bookable(rooms.find((r) => r.id === id))[0];
    setSetupId(first?.id);
    setGuests((g) => Math.min(g, first?.maxGuests ?? 1));
  };

  const chooseCheckIn = (value: string) => {
    setCheckIn(value);
    if (value && nightsBetween(value, checkOut) < 1)
      setCheckOut(addDays(value, 1));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !setup) return;
    setError(null);
    startTransition(async () => {
      const result = await submitRoomBooking({
        roomTypeId: room.id,
        setupId: setup.id,
        checkIn,
        checkOut,
        guests: Math.min(guests, maxGuests),
        childrenUnder12: children,
        guestName: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        notes: notes.trim(),
      });
      if (result.ok) {
        setReceived(result.received);
        window.scrollTo({ top: 0 });
      } else setError(result.message);
    });
  };

  if (received && room && setup) {
    return (
      <Confirmation received={received} title="Your room request is in">
        <p>
          {room.name}, {setup.name.toLowerCase()}. {formatDate(checkIn)} to{" "}
          {formatDate(checkOut)} ({nights} {nights === 1 ? "night" : "nights"}).
        </p>
        <p>
          We will call or email you to confirm. Nothing is booked until we do.
          You pay on arrival.
        </p>
      </Confirmation>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0 space-y-10">
        <fieldset>
          <legend className="font-display text-2xl text-brown">
            1. Choose your room
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => (
              <label
                key={r.id}
                className="cursor-pointer rounded-2xl border-2 border-line p-4 transition-colors hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-sand"
              >
                <input
                  type="radio"
                  name="room"
                  className="sr-only"
                  checked={r.id === roomId}
                  onChange={() => chooseRoom(r.id)}
                />
                <span className="block font-bold text-brown">{r.name}</span>
                <span className="text-sm text-muted">
                  Sleeps up to {r.maxGuests}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {setups.length > 0 && (
          <fieldset>
            <legend className="font-display text-2xl text-brown">
              2. How should we set up the beds?
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {setups.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-line p-3 transition-colors hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-sand"
                >
                  <input
                    type="radio"
                    name="setup"
                    className="sr-only"
                    checked={s.id === setup?.id}
                    onChange={() => {
                      setSetupId(s.id);
                      setGuests((g) => Math.min(g, s.maxGuests));
                    }}
                  />
                  <BedDiagram setupName={s.name} />
                  <span>
                    <span className="block font-bold text-brown">{s.name}</span>
                    <span className="text-sm text-muted">
                      {formatMoney(s.pricePerNight)} a night
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="font-display text-2xl text-brown">
            3. When and who
          </legend>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Arriving">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={field.input}
                  min={today}
                  max={lastDate}
                  required
                  value={checkIn}
                  onChange={(e) => chooseCheckIn(e.target.value)}
                />
              )}
            </Field>
            <Field label="Leaving">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={field.input}
                  min={checkIn ? addDays(checkIn, 1) : today}
                  max={addDays(lastDate, 1)}
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              )}
            </Field>
            <div aria-live="polite" className="sm:col-span-2">
              {checking && (
                <p className="text-sm text-muted">
                  Checking which nights are free…
                </p>
              )}
              {fullNights.length > 0 && room && (
                <p className="rounded-2xl bg-sand-deep px-4 py-3 font-bold text-brown">
                  Sorry, the {room.name} is fully booked on{" "}
                  {fullNights.map(formatDate).join(", ")}. Please try other
                  dates or another room, or call us.
                </p>
              )}
              {current?.known && fullNights.length === 0 && (
                <p className="text-sm font-bold text-gold-deep">
                  Good news: we have rooms free for these dates.
                </p>
              )}
            </div>
            <div>
              <p className={field.label}>Guests</p>
              <p className={field.hint}>
                Adults and children over {settings.freeChildAgeMax}
              </p>
              <div className="mt-2">
                <Stepper
                  label="Guests"
                  value={Math.min(guests, maxGuests)}
                  min={1}
                  max={maxGuests}
                  onChange={setGuests}
                />
              </div>
            </div>
            <div>
              <p className={field.label}>
                Children {settings.freeChildAgeMax} and under
              </p>
              <p className={field.hint}>They stay free</p>
              <div className="mt-2">
                <Stepper
                  label={`Children ${settings.freeChildAgeMax} and under`}
                  value={children}
                  min={0}
                  max={4}
                  onChange={setChildren}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl text-brown">
            4. Your details
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
              hint="Arriving late, a special occasion, a question."
            >
              {(id, hint) => (
                <textarea
                  id={id}
                  aria-describedby={hint}
                  rows={3}
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
          <h2 className="text-2xl text-gold-light">Your request</h2>
          <dl className="mt-4 space-y-2 text-white/85">
            <div className="flex justify-between gap-4">
              <dt>Room</dt>
              <dd className="text-right font-bold text-white">{room?.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Setup</dt>
              <dd className="text-right font-bold text-white">{setup?.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Dates</dt>
              <dd className="text-right font-bold text-white">
                {checkIn && checkOut && nights > 0
                  ? `${formatDate(checkIn)} to ${formatDate(checkOut)}`
                  : "Choose dates"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Nights</dt>
              <dd className="font-bold text-white">{nights}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-white/20 pt-4">
            <p className="flex items-baseline justify-between">
              <span>Estimated total</span>
              <span className="font-display text-3xl text-gold-light">
                {formatMoney(total)}
              </span>
            </p>
            <p className="mt-2 text-sm text-white/70">
              Pay on arrival by cash, card or EFT. No deposit. Cancel any time
              for free.
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <FormError message={error} />
          <button
            type="submit"
            disabled={pending || nights < 1 || !setup || fullNights.length > 0}
            className={`${btn.gold} w-full`}
          >
            {pending ? "Sending…" : "Send my request"}
          </button>
          <p className="text-center text-sm text-muted">
            This is a request, not a booking yet. We confirm by phone or email.
          </p>
        </div>
      </aside>
    </form>
  );
}
