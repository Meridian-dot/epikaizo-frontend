import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { BeadRow } from "@/components/Patterns";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";
import { btn, eyebrow } from "@/components/ui";
import { getPageContent, getRooms, getSettings } from "@/lib/api";
import { formatMoneyShort, formatTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Family, standard and compact bunker rooms in Outapi, from N$ 300 a night.",
};

export default async function RoomsPage() {
  const [content, rooms, settings] = await Promise.all([
    getPageContent("rooms"),
    getRooms(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title={content.title}
        body={content.body}
        note={{
          title: "Makalani country",
          body: "Outapi sits in the Omusati Region, where makalani palms rise over the flat, open land of the north. It is a convenient base for Outapi itself and for journeys on towards Ruacana.",
        }}
      />

      <section
        aria-label="Our rooms"
        className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
      >
        <ul className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room, i) => (
            <Reveal as="li" key={room.id} delay={(i % 2) * 100}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 md:grid-cols-2">
          <Reveal>
            <p className={eyebrow}>A stay unlike any other</p>
            <h2 className="mt-3 text-4xl">Sleep inside a piece of history</h2>
            <BeadRow className="mt-5" />
            <p className="mt-5 text-lg text-muted">
              Some of our compact rooms are set within the foundations of the
              original cross-shaped bunker the guesthouse was built on. The
              bunker also has a shared sitting room with air conditioning and a
              television.
            </p>
            <Link
              href="/about#bunker"
              className={`${btn.link} mt-6 inline-block`}
            >
              Read the bunker&apos;s story
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-3xl">Good to know</h2>
            <dl className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
              {[
                ["Check-in", `From ${formatTime(settings.checkInTime)}`],
                [
                  "Check-out",
                  `By ${formatTime(settings.checkOutTime)}. Later costs ${formatMoneyShort(settings.lateCheckOutFeePerHour)} an hour.`,
                ],
                [
                  "Children",
                  `${settings.freeChildAgeMax} and under stay free. Older children pay the adult price.`,
                ],
                ["Payment", "Pay on arrival by cash, card or EFT. No deposit."],
                ["Cancelling", "Cancel any time, free of charge."],
                ["House rules", "No pets, and no smoking inside the rooms."],
                ["Parking", "Free, on site."],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5"
                >
                  <dt className="font-bold text-brown">{term}</dt>
                  <dd className="text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
