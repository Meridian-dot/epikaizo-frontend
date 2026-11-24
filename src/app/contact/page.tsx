import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { btn } from "@/components/ui";
import { getPageContent, getSettings } from "@/lib/api";
import { formatMoneyShort, formatTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or visit Epikaizo Guesthouse in Outapi.",
};

export default async function ContactPage() {
  const [content, s] = await Promise.all([
    getPageContent("contact"),
    getSettings(),
  ]);
  const tel = s.phone.replace(/\s/g, "");
  const wa = s.whatsapp.replace(/\D/g, "");

  const ways = [
    {
      title: "Call us",
      detail: s.phone,
      href: `tel:${tel}`,
      action: "Call now",
    },
    {
      title: "WhatsApp",
      detail: s.phone,
      href: `https://wa.me/${wa}`,
      action: "Open WhatsApp",
    },
    {
      title: "Email",
      detail: s.email,
      href: `mailto:${s.email}`,
      action: "Write an email",
    },
    {
      title: "Instagram",
      detail: "@epikaizoguest",
      href: s.instagramUrl,
      action: "See our photos",
    },
  ];

  const hours: [string, string][] = [
    [
      "Restaurant",
      `Every day, ${formatTime(s.restaurant.openingTime)} to ${formatTime(s.restaurant.closingTime)}`,
    ],
    [
      "Room service",
      `${formatTime(s.foodOrders.roomServiceFrom)} to ${formatTime(s.foodOrders.roomServiceUntil)}`,
    ],
    [
      "Food collection",
      `${formatTime(s.foodOrders.collectionFrom)} to ${formatTime(s.foodOrders.collectionUntil)}`,
    ],
    ["Check-in", `From ${formatTime(s.checkInTime)}`],
    [
      "Check-out",
      `By ${formatTime(s.checkOutTime)} (later: ${formatMoneyShort(s.lateCheckOutFeePerHour)} an hour)`,
    ],
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title={content.title} body={content.body} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 80}>
              <a
                href={w.href}
                className="group flex h-full flex-col rounded-3xl border-2 border-line p-6 transition-colors hover:border-gold hover:bg-sand"
              >
                <span className="font-display text-2xl text-brown">
                  {w.title}
                </span>
                <span className="mt-1 break-all text-muted">{w.detail}</span>
                <span className="mt-auto pt-5 font-bold text-gold-deep group-hover:text-brown">
                  {w.action} →
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl">Finding us</h2>
            <p className="mt-4 text-lg text-muted">{s.address}</p>
            <p className="mt-2 text-lg text-muted">
              Right beside the Ombalantu Baobab Tree. Ask anyone in town for the
              baobab, and you will find us next door. Free parking on site.
            </p>
            <a href={s.mapsUrl} className={`${btn.brown} mt-6`}>
              Open in Google Maps
            </a>
            <h2 className="mt-12 text-3xl">Opening hours</h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
              {hours.map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3"
                >
                  <dt className="font-bold text-brown">{term}</dt>
                  <dd className="text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-lg">
            <iframe
              title="Map showing Epikaizo Guesthouse in Outapi"
              src="https://www.google.com/maps?q=Epikaizo+Guesthouse,+Outapi,+Namibia&output=embed"
              className="h-full min-h-[24rem] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h2 className="text-4xl">Ready when you are</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/book/room" className={btn.gold}>
            Request a room
          </Link>
          <Link href="/book/table" className={btn.outlineBrown}>
            Book a table
          </Link>
          <Link href="/order" className={btn.outlineBrown}>
            Order food
          </Link>
        </div>
      </section>
    </>
  );
}
