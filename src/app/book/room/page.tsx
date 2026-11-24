import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomRequestForm } from "@/components/forms/RoomRequestForm";
import { NoSsr } from "@/components/NoSsr";
import { PageHero } from "@/components/PageHero";
import { getRooms, getSettings } from "@/lib/api";

export const metadata: Metadata = { title: "Request a room" };

export default async function BookRoomPage() {
  const [rooms, settings] = await Promise.all([getRooms(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Request a room"
        title="Your stay in Outapi starts here"
        body="Tell us when you're coming and how you'd like the room set up. We'll confirm by phone or email. No payment now: you pay on arrival."
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
          <NoSsr fallback={<p className="text-muted">Loading the form…</p>}>
            <RoomRequestForm rooms={rooms} settings={settings} />
          </NoSsr>
        </Suspense>
      </div>
    </>
  );
}
