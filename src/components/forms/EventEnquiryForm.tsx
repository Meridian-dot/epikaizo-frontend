"use client";

import { useState, useTransition } from "react";
import {
  Confirmation,
  ContactFields,
  Field,
  FormError,
} from "@/components/forms/FormBits";
import { btn, field } from "@/components/ui";
import { submitEventEnquiry } from "@/lib/actions";
import { addDays, outapiNow } from "@/lib/format";
import type { RequestReceived } from "@/lib/types";

export function EventEnquiryForm() {
  const today = outapiNow().date;
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    date: "",
    people: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState<RequestReceived | null>(null);
  const [pending, startTransition] = useTransition();
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const people = Number.parseInt(form.people, 10);
      const result = await submitEventEnquiry({
        guestName: form.name.trim(),
        organisation: form.organisation.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date || null,
        people: Number.isFinite(people) ? people : null,
        message: form.message.trim(),
      });
      if (result.ok) setReceived(result.received);
      else setError(result.message);
    });
  };

  if (received) {
    return (
      <Confirmation received={received} title="Thank you for your enquiry">
        <p>We&apos;ll be in touch soon to talk about your event.</p>
      </Confirmation>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ContactFields
        name={form.name}
        phone={form.phone}
        email={form.email}
        onChange={(k, v) => set(k, v)}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Organisation (optional)">
          {(id) => (
            <input
              id={id}
              className={field.input}
              autoComplete="organization"
              value={form.organisation}
              onChange={(e) => set("organisation", e.target.value)}
            />
          )}
        </Field>
        <Field label="Date (if you know it)">
          {(id) => (
            <input
              id={id}
              type="date"
              className={field.input}
              min={today}
              max={addDays(today, 730)}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          )}
        </Field>
        <Field label="Number of people">
          {(id) => (
            <input
              id={id}
              type="number"
              min={1}
              max={500}
              inputMode="numeric"
              className={field.input}
              value={form.people}
              onChange={(e) => set("people", e.target.value)}
            />
          )}
        </Field>
      </div>
      <Field
        label="Tell us about your event"
        hint="What kind of event, how long, and whether you need meals."
      >
        {(id, hint) => (
          <textarea
            id={id}
            aria-describedby={hint}
            rows={4}
            required
            className={field.input}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
        )}
      </Field>
      <FormError message={error} />
      <button type="submit" disabled={pending} className={btn.brown}>
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
