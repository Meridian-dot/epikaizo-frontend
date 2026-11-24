// Small formatting and date helpers shared by pages and forms.
// Dates stay as "YYYY-MM-DD" strings. Never use new Date("2026-12-20"):
// it reads the string as midnight UTC and can show the day before.

const TIME_ZONE = "Africa/Windhoek";

const money = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1450 → "N$ 1,450.00" */
export function formatMoney(amount: number): string {
  return `N$ ${money.format(amount)}`;
}

/** 1450 → "N$ 1,450" (for short labels like "from N$ 300") */
export function formatMoneyShort(amount: number): string {
  return `N$ ${Math.round(amount).toLocaleString("en-US")}`;
}

function toUtc(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtc(ms: number): string {
  const dt = new Date(ms);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "2026-12-20" + 3 → "2026-12-23" */
export function addDays(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * 86_400_000);
}

/** Nights between check-in and check-out (check-out is exclusive). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toUtc(checkOut) - toUtc(checkIn)) / 86_400_000);
}

/** "2026-12-20" → "Sun 20 Dec 2026" */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtc(date));
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Current date and time in Outapi (Windhoek time). */
export function outapiNow(now: number = Date.now()) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => p.find((x) => x.type === type)?.value ?? "00";
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour,
    minute,
    minutesOfDay: hour * 60 + minute,
    time: `${get("hour")}:${get("minute")}`,
  };
}

/** "19:30" → 1170 */
export function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "19:00" → "7 pm", "09:30" → "9:30 am" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Splits plain text into paragraphs on blank lines. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Lowest active setup price, for "from N$ 300 a night". */
export function fromPrice(
  setups: { pricePerNight: number; isActive: boolean }[],
) {
  const prices = setups.filter((s) => s.isActive).map((s) => s.pricePerNight);
  return prices.length ? Math.min(...prices) : null;
}
