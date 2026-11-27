import Link from "next/link";
import { DishMarquee } from "@/components/DishMarquee";
import { HomeHero } from "@/components/HomeHero";
import { PageSections } from "@/components/PageSections";
import { BasketMotif, BeadRow } from "@/components/Patterns";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";
import { StoryCross } from "@/components/StoryCross";
import { btn, eyebrow } from "@/components/ui";
import { homeHighlights, storyChapters } from "@/content/site";
import { getMenu, getPageContent, getRooms, getSettings } from "@/lib/api";
import { pagePhoto, splitPageContent } from "@/lib/content";
import { formatMoneyShort, formatTime } from "@/lib/format";

export default async function HomePage() {
  const [content, rooms, settings, menu] = await Promise.all([
    getPageContent("home"),
    getRooms(),
    getSettings(),
    getMenu(),
  ]);
  const { intro, sections } = splitPageContent(content);
  const highlight = homeHighlights[0];
  const roomCount = rooms.reduce((sum, r) => sum + r.totalUnits, 0);
  const pizza = menu
    .flatMap((c) => c.items)
    .find((item) => item.name.toLowerCase().startsWith("epikaizo pizza"));

  return (
    <>
      <HomeHero title={content.title} body={intro} />

      <PageSections sections={sections} className="pb-0 sm:pb-0" />

      {/* More than just a place to stay */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-28 md:grid-cols-[1fr_1.1fr] md:items-center">
        <Reveal>
          <p className={eyebrow}>Since 2011</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">{highlight.title}</h2>
          <BeadRow className="mt-5" />
          <p className="mt-5 text-lg text-muted">{highlight.body}</p>
        </Reveal>
        <Reveal delay={150} className="grid grid-cols-2 gap-4">
          <Photo
            photo={pagePhoto(content, 0)}
            label="The guesthouse"
            className="aspect-[3/4] rounded-[2rem]"
          />
          <div className="flex flex-col gap-4 pt-10">
            <Photo
              photo={pagePhoto(content, 1)}
              label="The bunker"
              className="aspect-square rounded-[2rem]"
            />
            <div className="rounded-[2rem] bg-brown p-5 text-white">
              <p className="font-display text-4xl text-gold-light">
                {roomCount}
              </p>
              <p className="text-sm text-white/80">
                rooms, a restaurant and a hall, all on one historic site
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Four stories, laid out like the bunker */}
      <section
        aria-labelledby="stories-title"
        className="relative overflow-hidden bg-sand py-20 sm:py-28"
      >
        <BasketMotif
          className="absolute -top-32 -left-32 size-96 opacity-[0.06]"
          colour="#3e160c"
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <p className={eyebrow}>Four stories, one place</p>
            <h2 id="stories-title" className="mt-3 text-4xl sm:text-5xl">
              Built on a cross, rooted beside a baobab
            </h2>
            <p className="mt-4 text-lg text-muted">
              The guesthouse stands on an old cross-shaped bunker. Each arm of
              the cross below holds one of our stories. Tap one to read it.
            </p>
          </Reveal>
          <div className="mt-12">
            <StoryCross chapters={storyChapters} />
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section
        aria-labelledby="rooms-title"
        className="mx-auto max-w-6xl px-5 py-20 sm:py-28"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <p className={eyebrow}>Rest easy</p>
            <h2 id="rooms-title" className="mt-3 text-4xl sm:text-5xl">
              A room for every kind of journey
            </h2>
          </Reveal>
          <Link href="/rooms" className={btn.link}>
            See all rooms
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, i) => (
            <Reveal as="li" key={room.id} delay={i * 90}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-muted">
          Pay on arrival. No deposit, and you can cancel any time at no cost.
          Children {settings.freeChildAgeMax} and under stay free.
        </p>
      </section>

      {/* Restaurant */}
      <section aria-labelledby="food-title" className="bg-brown text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className={`${eyebrow} text-gold-light`}>A taste of Namibia</p>
            <h2
              id="food-title"
              className="mt-3 text-4xl text-white sm:text-5xl"
            >
              The pizza everyone in Outapi talks about
            </h2>
            <p className="mt-5 text-lg text-white/80">
              A signature recipe, a loyal local following and a favourite stop
              for travellers passing through. Next to it on the menu: eedhingu,
              ekaka, Marathon chicken and the comforting plates of the north.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/restaurant" className={btn.gold}>
                See the menu
              </Link>
              <Link href="/book/table" className={btn.outlineLight}>
                Book a table
              </Link>
              <Link href="/order" className={btn.outlineLight}>
                Order food
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Open every day, {formatTime(settings.restaurant.openingTime)} to{" "}
              {formatTime(settings.restaurant.closingTime)}. Room service{" "}
              {formatMoneyShort(settings.foodOrders.roomServiceFee)} extra.
            </p>
          </Reveal>
          <Reveal delay={150} className="relative">
            <Photo
              photo={pizza?.photo}
              label="Our signature Epikaizo pizza"
              className="aspect-square rounded-[3rem] border-8 border-gold/30"
            />
            {pizza && (
              <div className="absolute -top-4 -right-2 rounded-2xl bg-gold px-5 py-3 text-brown-deep shadow-lg sm:right-6">
                <p className="text-xs font-bold tracking-[0.2em] uppercase">
                  {pizza.name}
                </p>
                <p className="font-display text-3xl">
                  {formatMoneyShort(pizza.price)}
                </p>
              </div>
            )}
          </Reveal>
        </div>
        <DishMarquee dark />
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-sand-deep px-6 py-14 text-center sm:px-14">
          <BasketMotif
            className="absolute -right-24 -bottom-24 size-80 animate-drift opacity-15"
            colour="#b9942c"
          />
          <p className={eyebrow}>Your stay in Outapi starts here</p>
          <h2 className="relative mx-auto mt-3 max-w-3xl text-4xl sm:text-5xl">
            A short stopover, a business trip or a family visit. We&apos;re
            ready to welcome you.
          </h2>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book/room" className={btn.brown}>
              Request a room
            </Link>
            <Link href="/book/table" className={btn.outlineBrown}>
              Book a table
            </Link>
            <Link href="/events" className={btn.outlineBrown}>
              Plan a meeting
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
