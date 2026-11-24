import Link from "next/link";
import { Photo } from "@/components/Photo";
import { AmenityIcon } from "@/components/RoomVisuals";
import { formatMoneyShort, fromPrice, paragraphs } from "@/lib/format";
import type { Room } from "@/lib/types";

export function RoomCard({ room }: { room: Room }) {
  const price = fromPrice(room.setups);
  const intro = paragraphs(room.description)[0] ?? "";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_0_#e6dac6] transition-shadow duration-300 hover:shadow-xl">
      <Photo
        photo={room.photos[0]}
        label={room.name}
        className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl">
          <Link
            href={`/rooms/${room.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {room.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-muted">{intro}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Some amenities">
          {room.amenities.slice(0, 4).map((a) => (
            <li
              key={a.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-sm text-brown"
            >
              <AmenityIcon icon={a.icon} />
              {a.name}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {price !== null && (
            <p className="text-muted">
              from{" "}
              <span className="font-display text-3xl text-brown">
                {formatMoneyShort(price)}
              </span>{" "}
              a night
            </p>
          )}
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full bg-gold text-brown-deep transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}
