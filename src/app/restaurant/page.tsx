import type { Metadata } from "next";
import Link from "next/link";
import { CallUsNotice } from "@/components/CallUsNotice";
import { DishMarquee } from "@/components/DishMarquee";
import { PageHero } from "@/components/PageHero";
import { PageSections } from "@/components/PageSections";
import { BeadRow } from "@/components/Patterns";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { btn, eyebrow } from "@/components/ui";
import { getMenu, getPageContent, getSettings } from "@/lib/api";
import { splitPageContent } from "@/lib/content";
import { formatMoney, formatMoneyShort, formatTime } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Restaurant and menu",
  description:
    "Traditional Namibian dishes, Western favourites and Outapi's favourite pizza. Open every day.",
};

const tagLabel: Record<string, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  halal: "Halal",
  "gluten-free": "Gluten-free",
  "contains-nuts": "Contains nuts",
  spicy: "Spicy",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className={`flex gap-4 py-3.5 ${item.isAvailable ? "" : "opacity-55"}`}>
      {item.photo && (
        <Photo
          photo={item.photo}
          label={item.name}
          className="size-20 shrink-0 rounded-2xl"
          sizes="80px"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="font-bold text-brown">{item.name}</span>
          <span
            aria-hidden="true"
            className="flex-1 border-b-2 border-dotted border-gold/50"
          />
          <span className="font-display text-lg whitespace-nowrap text-brown">
            {formatMoney(item.price)}
          </span>
        </div>
        {(item.description ||
          item.dietaryTags.length > 0 ||
          !item.isAvailable) && (
          <p className="mt-1 text-sm text-muted">
            {!item.isAvailable && (
              <span className="mr-2 rounded-full bg-brown px-2 py-0.5 text-xs font-bold text-white">
                Not available today
              </span>
            )}
            {item.description}
            {item.dietaryTags.map((t) => (
              <span
                key={t}
                className="ml-2 rounded-full bg-sand-deep px-2 py-0.5 text-xs font-bold text-gold-deep"
              >
                {tagLabel[t] ?? t}
              </span>
            ))}
          </p>
        )}
        {(item.sideOptions?.length ?? 0) > 0 && (
          <p className="mt-1 text-sm text-muted">
            With {item.sideOptions?.join(", ").replace(/, ([^,]*)$/, " or $1")}
          </p>
        )}
      </div>
    </li>
  );
}

export default async function RestaurantPage() {
  const [content, menu, settings] = await Promise.all([
    getPageContent("restaurant"),
    getMenu(),
    getSettings(),
  ]);
  const categories = [...menu].sort((a, b) => a.sortOrder - b.sortOrder);
  const traditional = categories.find((c) =>
    c.name.toLowerCase().includes("traditional"),
  );
  const r = settings.restaurant;
  const f = settings.foodOrders;
  const { intro, sections } = splitPageContent(content);

  return (
    <>
      <PageHero
        eyebrow="Epikaizo Restaurant"
        title={content.title}
        body={intro}
        note={{
          title: "Oshifima on the table",
          body: "In the north, a meal often means stiff porridge made from mahangu, with a stew or spinach beside it. On our menu you will find pap, ekaka and eedhingu alongside the steaks and pizza.",
        }}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/book/table" className={btn.gold}>
            Book a table
          </Link>
          <Link href="/order" className={btn.outlineLight}>
            Order food
          </Link>
        </div>
      </PageHero>

      <DishMarquee />

      <PageSections sections={sections} />

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:grid-cols-3">
        {[
          {
            title: "Open every day",
            body: `${formatTime(r.openingTime)} to ${formatTime(r.closingTime)}, for guests and visitors alike.`,
          },
          {
            title: "Small kitchen. Big appetite.",
            body: `We seat about ${r.maxCoversPerSlot} people and happily cater for big groups and organised visits.`,
          },
          {
            title: "Room service or collection",
            body: `Order online. Room service ${formatTime(f.roomServiceFrom)} to ${formatTime(f.roomServiceUntil)} (${formatMoneyShort(f.roomServiceFee)} delivery), collection ${formatTime(f.collectionFrom)} to ${formatTime(f.collectionUntil)}.`,
          },
        ].map((card, i) => (
          <Reveal
            key={card.title}
            delay={i * 100}
            className="rounded-3xl bg-sand p-6"
          >
            <h2 className="text-2xl">{card.title}</h2>
            <p className="mt-2 text-muted">{card.body}</p>
          </Reveal>
        ))}
      </section>

      {traditional && (
        <section className="bg-brown text-white">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <p className={`${eyebrow} text-gold-light`}>Traditional flavours</p>
            <h2 className="mt-3 text-4xl text-white">Tastes of the north</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {traditional.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-gold/30 bg-brown-deep/50 p-5"
                >
                  <p className="font-display text-2xl text-gold-light">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-white/75">{item.description}</p>
                  )}
                  <p className="mt-3 font-bold">{formatMoney(item.price)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        aria-labelledby="menu-title"
        className="mx-auto max-w-6xl px-5 py-16"
      >
        <h2 id="menu-title" className="text-4xl sm:text-5xl">
          The full menu
        </h2>
        <BeadRow className="mt-4" />
        {categories.length === 0 && (
          <div className="mt-8">
            <CallUsNotice what="the menu" settings={settings} />
          </div>
        )}
        <nav
          aria-label="Menu sections"
          className="sticky top-[7.5rem] z-10 -mx-5 mt-6 overflow-x-auto bg-white/95 px-5 py-3 backdrop-blur"
        >
          <ul className="flex gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${slugify(c.name)}`}
                  className="block rounded-full border-2 border-line px-4 py-1.5 text-sm font-bold whitespace-nowrap text-brown hover:border-gold hover:bg-sand"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 columns-1 gap-12 md:columns-2">
          {categories.map((c) => (
            <section
              key={c.id}
              id={slugify(c.name)}
              aria-labelledby={`${slugify(c.name)}-title`}
              className="mb-10 scroll-mt-48 break-inside-avoid"
            >
              <h3 id={`${slugify(c.name)}-title`} className="text-2xl">
                {c.name}
              </h3>
              <ul className="mt-2 divide-y divide-line">
                {[...c.items]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <MenuRow key={item.id} item={item} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Prices in Namibian dollars (N$). Mains come with one side of your
          choice.
        </p>
      </section>
    </>
  );
}
