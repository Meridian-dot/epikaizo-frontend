import Link from "next/link";
import { Baobab } from "@/components/Landscape";
import { WovenBand } from "@/components/Patterns";
import { footerNav, site } from "@/content/site";
import { formatTime } from "@/lib/format";
import type { PublicSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: PublicSettings }) {
  const r = settings.restaurant;
  return (
    <footer className="relative mt-auto overflow-hidden bg-brown-deep text-white/85">
      <WovenBand />
      <Baobab className="pointer-events-none absolute -right-20 bottom-0 w-[28rem] opacity-[0.18] [&_path]:stroke-gold [&_path[fill]]:fill-gold" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr_1fr]">
        <div>
          <p className="font-display text-3xl text-white">{site.name}</p>
          <p className="mt-3 text-white/70">
            Come for the location. Stay for the experience.
          </p>
          <p className="mt-4 text-sm tracking-[0.18em] text-gold-light uppercase">
            Since 2011
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-gold-light">Visit</h2>
          <p className="mt-3">{settings.address}</p>
          <p className="mt-1 text-white/70">Beside the Ombalantu Baobab Tree</p>
          <a
            href={settings.mapsUrl}
            className="mt-3 inline-block font-bold text-gold-light underline underline-offset-4 hover:text-white"
          >
            Open in Google Maps
          </a>
        </div>

        <div>
          <h2 className="font-display text-xl text-gold-light">Talk to us</h2>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                className="hover:text-white"
              >
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.email}`}
                className="text-[0.95rem] [overflow-wrap:anywhere] hover:text-white"
              >
                {settings.email}
              </a>
            </li>
            <li>
              <a href={settings.instagramUrl} className="hover:text-white">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-gold-light">Hours</h2>
          <dl className="mt-3 space-y-1.5">
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Restaurant</dt>
              <dd>
                {formatTime(r.openingTime)} to {formatTime(r.closingTime)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Check-in</dt>
              <dd>from {formatTime(settings.checkInTime)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Check-out</dt>
              <dd>by {formatTime(settings.checkOutTime)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-white/60">{site.place}</p>
        </div>
      </div>
    </footer>
  );
}
