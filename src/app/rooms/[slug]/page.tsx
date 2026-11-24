import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BasketMotif, WovenBand } from "@/components/Patterns";
import { Photo } from "@/components/Photo";
import { AmenityIcon } from "@/components/RoomVisuals";
import { SetupPicker } from "@/components/SetupPicker";
import { eyebrow } from "@/components/ui";
import { getRoom, getRooms, getSettings } from "@/lib/api";
import { formatTime, paragraphs } from "@/lib/format";

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata(
  props: PageProps<"/rooms/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const room = await getRoom(slug);
  return {
    title: room?.name ?? "Room",
    description: room ? paragraphs(room.description)[0] : undefined,
  };
}

export default async function RoomPage(props: PageProps<"/rooms/[slug]">) {
  const { slug } = await props.params;
  const [room, settings] = await Promise.all([getRoom(slug), getSettings()]);
  if (!room || !room.isActive) notFound();

  const photos = [...room.photos].sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = [0, 1, 2].map((i) => photos[i] ?? null);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brown text-white">
        <BasketMotif
          className="absolute -top-40 -right-40 -z-10 size-[30rem] animate-drift opacity-[0.12]"
          colour="#e8d8a6"
        />
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:pt-12">
          <Link
            href="/rooms"
            className="text-sm font-bold text-gold-light hover:text-white"
          >
            ← All rooms
          </Link>
          <h1 className="mt-4 animate-rise text-4xl text-white sm:text-6xl">
            {room.name}
          </h1>
          <p className="mt-3 text-white/75">
            {room.totalUnits} {room.totalUnits === 1 ? "room" : "rooms"} of this
            type · sleeps up to {room.maxGuests}
          </p>
        </div>
        <WovenBand />
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-3 sm:grid-cols-3 sm:grid-rows-2">
          <Photo
            photo={gallery[0]}
            label={room.name}
            className="aspect-[4/3] rounded-3xl sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[26rem]"
            sizes="(min-width: 640px) 66vw, 100vw"
          />
          <Photo
            photo={gallery[1]}
            label="Inside the room"
            className="hidden aspect-[4/3] rounded-3xl sm:block"
          />
          <Photo
            photo={gallery[2]}
            label="Bathroom"
            className="hidden aspect-[4/3] rounded-3xl sm:block"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className={eyebrow}>About this room</p>
            <div className="mt-4 space-y-4 text-lg text-muted">
              {paragraphs(room.description).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 text-3xl">What&apos;s in the room</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {room.amenities.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl bg-sand px-4 py-3 text-brown"
                >
                  <AmenityIcon icon={a.icon} />
                  {a.name}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-3xl">Good to know</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-gold">
              <li>
                Check-in from {formatTime(settings.checkInTime)}, check-out by{" "}
                {formatTime(settings.checkOutTime)}.
              </li>
              <li>
                Children {settings.freeChildAgeMax} and under stay free. Older
                children pay the adult price.
              </li>
              <li>
                Pay on arrival by cash, card or EFT. No deposit, and you can
                cancel any time for free.
              </li>
              <li>No pets, and no smoking inside the rooms.</li>
            </ul>
          </div>

          <aside
            aria-labelledby="setup-title"
            className="lg:sticky lg:top-36 lg:self-start"
          >
            <div className="rounded-3xl border-2 border-gold/50 bg-white p-6 shadow-lg">
              <h2 id="setup-title" className="text-3xl">
                Choose how you sleep
              </h2>
              <p className="mt-2 text-muted">
                Each setup has its own price. We prepare the room before you
                arrive.
              </p>
              <SetupPicker room={room} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
