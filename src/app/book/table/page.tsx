import type { Metadata } from "next";
import { TableBookingForm } from "@/components/forms/TableBookingForm";
import { NoSsr } from "@/components/NoSsr";
import { PageHero } from "@/components/PageHero";
import { getMenu, getSettings } from "@/lib/api";

export const metadata: Metadata = { title: "Book a table" };

export default async function BookTablePage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Book a table"
        title="There's always a seat waiting"
        body="Reserve a table for yourself, your family or a whole group. If you like, order your food ahead and it will be ready when you sit down."
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <NoSsr fallback={<p className="text-muted">Loading the form…</p>}>
          <TableBookingForm menu={menu} settings={settings} />
        </NoSsr>
      </div>
    </>
  );
}
