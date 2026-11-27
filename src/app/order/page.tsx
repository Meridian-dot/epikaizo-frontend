import type { Metadata } from "next";
import { CallUsNotice } from "@/components/CallUsNotice";
import { OrderForm } from "@/components/forms/OrderForm";
import { NoSsr } from "@/components/NoSsr";
import { PageHero } from "@/components/PageHero";
import { getMenu, getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Order food",
  description:
    "Order from our kitchen for collection, or to your room if you're staying with us.",
};

export default async function OrderPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Order food"
        title="Good food, wherever you are"
        body="Order for collection, whether you're staying with us or not, or have it brought to your room. Pay when you get it."
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        {menu.length === 0 ? (
          <CallUsNotice what="the menu" settings={settings} />
        ) : (
          <NoSsr fallback={<p className="text-muted">Loading the menu…</p>}>
            <OrderForm menu={menu} settings={settings} />
          </NoSsr>
        )}
      </div>
    </>
  );
}
