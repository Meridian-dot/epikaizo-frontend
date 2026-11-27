import type { PublicSettings } from "@/lib/types";

// Shown in place of rooms or the menu when they couldn't be loaded (the API is
// asleep or unreachable), so guests still have a way to reach us.
export function CallUsNotice({
  what,
  settings,
}: {
  what: string;
  settings: PublicSettings;
}) {
  return (
    <div
      role="status"
      className="rounded-2xl border-2 border-line bg-sand px-6 py-8 text-center"
    >
      <p className="text-xl font-bold text-brown">
        We can&apos;t show {what} right now.
      </p>
      <p className="mt-2 text-muted">
        Please refresh in a minute, or call us on{" "}
        <a className="font-bold underline" href={`tel:${settings.phone}`}>
          {settings.phone}
        </a>{" "}
        or{" "}
        <a
          className="font-bold underline"
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
        >
          WhatsApp us
        </a>
        .
      </p>
    </div>
  );
}
