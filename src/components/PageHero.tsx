import { BasketMotif, WovenBand } from "@/components/Patterns";
import { eyebrow as eyebrowClass } from "@/components/ui";
import { paragraphs } from "@/lib/format";

// The hero at the top of inner pages. Each one carries a short "story note"
// about the north, so every page tells a little of the people and place.

type Props = {
  eyebrow: string;
  title: string;
  body?: string;
  note?: { title: string; body: string };
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, body, note, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-brown text-white">
      <BasketMotif
        className="absolute -top-40 -right-40 -z-10 size-[34rem] animate-drift opacity-[0.14]"
        colour="#e8d8a6"
      />
      <BasketMotif
        className="absolute -bottom-24 -left-24 -z-10 size-72 opacity-[0.08]"
        colour="#e8d8a6"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className={`${eyebrowClass} text-gold-light`}>{eyebrow}</p>
          <h1 className="mt-3 animate-rise text-4xl text-white sm:text-6xl">
            {title}
          </h1>
          {body && (
            <div className="mt-5 max-w-2xl animate-rise space-y-3 text-lg text-white/85 [animation-delay:150ms]">
              {paragraphs(body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {note && (
          <aside className="animate-rise rounded-2xl border border-gold/40 bg-brown-deep/60 p-6 [animation-delay:300ms]">
            <p className="text-xs font-bold tracking-[0.2em] text-gold-light uppercase">
              From the north
            </p>
            <p className="mt-2 font-display text-2xl text-white">
              {note.title}
            </p>
            <p className="mt-2 text-white/80">{note.body}</p>
          </aside>
        )}
      </div>
      <WovenBand />
    </section>
  );
}
