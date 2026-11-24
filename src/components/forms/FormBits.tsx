"use client";

import Link from "next/link";
import { useId } from "react";
import { BasketMotif } from "@/components/Patterns";
import { btn, field } from "@/components/ui";
import type { RequestReceived } from "@/lib/types";

// Small building blocks shared by the booking and order forms.

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className={field.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={field.hint}>
          {hint}
        </p>
      )}
      {children(id, hintId)}
    </div>
  );
}

export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border-2 border-line bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="size-11 rounded-full text-2xl font-bold text-brown disabled:opacity-30"
      >
        <span aria-hidden="true">−</span>
        <span className="sr-only">One fewer</span>
      </button>
      <output
        aria-live="polite"
        className="w-10 text-center text-lg font-bold tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="size-11 rounded-full text-2xl font-bold text-brown disabled:opacity-30"
      >
        <span aria-hidden="true">+</span>
        <span className="sr-only">One more</span>
      </button>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  return (
    <div aria-live="assertive">
      {message && (
        <p className="rounded-2xl border-2 border-[#a3341b]/40 bg-[#fbeee9] px-4 py-3 font-bold text-[#a3341b]">
          {message}
        </p>
      )}
    </div>
  );
}

export function ContactFields({
  name,
  phone,
  email,
  onChange,
  emailRequired = true,
  showEmail = true,
}: {
  name: string;
  phone: string;
  email?: string;
  onChange: (field: "name" | "phone" | "email", value: string) => void;
  emailRequired?: boolean;
  showEmail?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" className="sm:col-span-2">
        {(id) => (
          <input
            id={id}
            className={field.input}
            autoComplete="name"
            required
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        )}
      </Field>
      <Field label="Phone or WhatsApp" hint="So we can reach you quickly.">
        {(id, hint) => (
          <input
            id={id}
            aria-describedby={hint}
            className={field.input}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+264 81 ..."
            required
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        )}
      </Field>
      {showEmail && (
        <Field
          label={emailRequired ? "Email" : "Email (optional)"}
          hint="We send your confirmation here."
        >
          {(id, hint) => (
            <input
              id={id}
              aria-describedby={hint}
              className={field.input}
              type="email"
              autoComplete="email"
              required={emailRequired}
              value={email ?? ""}
              onChange={(e) => onChange("email", e.target.value)}
            />
          )}
        </Field>
      )}
    </div>
  );
}

export function Confirmation({
  received,
  title,
  children,
}: {
  received: RequestReceived;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="relative animate-rise overflow-hidden rounded-[2rem] bg-brown px-6 py-12 text-center text-white sm:px-12"
    >
      <BasketMotif
        className="absolute -top-24 -right-24 size-72 animate-drift opacity-15"
        colour="#e8d8a6"
      />
      <p className="relative font-display text-5xl text-gold-light">
        Tangi unene!
      </p>
      <p className="relative mt-1 text-sm text-white/70">Thank you very much</p>
      <h2 className="relative mt-6 text-3xl text-white">{title}</h2>
      <p className="relative mt-4 text-white/80">Your reference</p>
      <p className="relative mt-1 inline-block rounded-xl bg-white/10 px-4 py-2 font-mono text-2xl tracking-wider">
        {received.reference}
      </p>
      <div className="relative mx-auto mt-6 max-w-lg space-y-2 text-white/85">
        {children}
      </div>
      <Link href="/" className={`${btn.gold} relative mt-8`}>
        Back to the home page
      </Link>
    </div>
  );
}
