// The only place that talks to the backend API.
// Every function returns mock data only when NEXT_PUBLIC_USE_MOCKS is "true".
//
// Paths are the API's /public/* endpoints (epikaizo-backend, branch c/admin-api,
// docs/api.md). If they change, update them here; pages and forms should not need to.
//
// Reads are NOT cached, so an edit saved in the admin dashboard shows on the
// next page refresh. The root layout wraps the page in <Suspense> for this.
//
// The API sleeps when idle (Render free plan) and can take up to a minute to
// wake, so reads wait up to 30 seconds and try once more on a timeout or a
// 502/503/504.
//
// If the API still can't be reached (wrong API_URL, backend down), reads fall
// back instead of crashing the whole site: settings and page text use the
// built-in defaults in src/mocks/data.ts, rooms and menu come back empty (the
// pages then say "call us"), and the error is logged on the server.

import { config } from "@/lib/config";
import { mockContent, mockMenu, mockRooms, mockSettings } from "@/mocks/data";
import type {
  ContentKey,
  EventEnquiryRequest,
  FoodOrderRequest,
  IsoDate,
  MenuCategory,
  PageContent,
  Photo,
  PublicSettings,
  RequestReceived,
  Room,
  RoomAvailability,
  RoomBookingRequest,
  TableBookingRequest,
} from "@/lib/types";
import { addDays, nightsBetween } from "@/lib/format";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

type ErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string[]>;
  };
};

const READ_TIMEOUT_MS = 30_000;
const SEND_TIMEOUT_MS = 45_000;
const RETRY_STATUSES = new Set([502, 503, 504]);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!config.apiUrl) {
    throw new Error(
      "API_URL is not set. Add it to .env.local (or the hosting settings), or set NEXT_PUBLIC_USE_MOCKS=true.",
    );
  }
  const isRead = !init.method || init.method === "GET";
  const attempt = () =>
    fetch(`${config.apiUrl}${path}`, {
      cache: "no-store", // always fresh (see the note at the top)
      ...init,
      signal: AbortSignal.timeout(isRead ? READ_TIMEOUT_MS : SEND_TIMEOUT_MS),
      headers: { "Content-Type": "application/json", ...init.headers },
    });

  let res: Response;
  try {
    res = await attempt();
    // Only reads are retried: sending a booking twice could make two bookings.
    if (isRead && RETRY_STATUSES.has(res.status)) res = await attempt();
  } catch (error) {
    if (!isRead) throw error;
    res = await attempt();
  }

  const body = (await res.json().catch(() => null)) as (T & ErrorBody) | null;
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? "server_error",
      body?.error?.message ?? "Something went wrong. Please try again.",
      body?.error?.fields,
    );
  }
  return body as T;
}

// True when the API couldn't be reached or failed on its side: no API_URL,
// network error, timeout, or a 5xx. A 4xx (e.g. 404) is a real answer.
function isUnreachable(error: unknown) {
  return !(error instanceof ApiError) || error.status >= 500;
}

async function readOr<T>(what: string, read: () => Promise<T>, fallback: T) {
  try {
    return await read();
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    console.error(
      `[api] Could not load ${what} from ${config.apiUrl || "(API_URL not set)"}. ` +
        "Check API_URL and that the backend is awake. Using the fallback.",
      error,
    );
    return fallback;
  }
}

function mockReceived(prefix: string, status: string): RequestReceived {
  const code = Math.random().toString(36).slice(2, 7).toUpperCase();
  return { reference: `EPK-${prefix}-${code}`, status };
}

// ---- Reads (not cached; used by server components) ----

export async function getRooms(): Promise<Room[]> {
  if (config.useMocks) return mockRooms.filter((r) => r.isActive);
  return readOr("rooms", () => request<Room[]>("/public/rooms"), []);
}

export async function getRoom(slug: string): Promise<Room | null> {
  if (config.useMocks) return mockRooms.find((r) => r.slug === slug) ?? null;
  try {
    return await request<Room>(`/public/rooms/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error; // unreachable: app/error.tsx shows a friendly message
  }
}

export async function getMenu(): Promise<MenuCategory[]> {
  if (config.useMocks) return mockMenu;
  return readOr("the menu", () => request<MenuCategory[]>("/public/menu"), []);
}

export async function getPageContent(key: ContentKey): Promise<PageContent> {
  const builtIn = mockContent.find((c) => c.key === key);
  if (config.useMocks) {
    if (!builtIn) throw new Error(`No mock content for "${key}"`);
    return builtIn;
  }
  const read = () => request<PageContent>(`/public/content/${key}`);
  if (!builtIn) return read();
  return readOr(`page text "${key}"`, read, builtIn);
}

export async function getSettings(): Promise<PublicSettings> {
  if (config.useMocks) return mockSettings;
  return readOr(
    "settings",
    () => request<PublicSettings>("/public/settings"),
    mockSettings,
  );
}

// The dashboard's "Gallery photos". PROPOSED endpoint (Dev B): until it
// exists the API answers 404 and the site simply shows no gallery.
export async function getGallery(): Promise<Photo[]> {
  if (config.useMocks) return [];
  try {
    return await request<Photo[]>("/public/gallery");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [];
    if (isUnreachable(error)) return [];
    throw error;
  }
}

// Rooms of one type free on each night from `from` up to, not including, `to`.
// Live at GET /rooms/:id/availability (not under /public yet; ask Dev B to add
// /public/rooms/:id/availability and change the path here). Returns null when
// it can't be checked, so the form still lets the guest send a request.
export async function getRoomAvailability(
  roomTypeId: number,
  from: IsoDate,
  to: IsoDate,
): Promise<RoomAvailability | null> {
  if (config.useMocks) {
    const room = mockRooms.find((r) => r.id === roomTypeId);
    if (!room) return null;
    const nights = Array.from({ length: nightsBetween(from, to) }, (_, i) => ({
      date: addDays(from, i),
      available: room.totalUnits,
    }));
    return { roomTypeId, from, to, nights };
  }
  try {
    const query = new URLSearchParams({ from, to });
    return await request<RoomAvailability>(
      `/rooms/${roomTypeId}/availability?${query}`,
    );
  } catch {
    return null;
  }
}

// ---- Requests (not cached; staff confirm them later) ----

function post<T>(path: string, data: unknown) {
  return request<T>(path, { method: "POST", body: JSON.stringify(data) });
}

export async function requestRoomBooking(
  data: RoomBookingRequest,
): Promise<RequestReceived> {
  if (config.useMocks) return mockReceived("R", "pending");
  return post<RequestReceived>("/public/bookings/rooms", data);
}

export async function requestTableBooking(
  data: TableBookingRequest,
): Promise<RequestReceived> {
  if (config.useMocks) return mockReceived("T", "pending");
  return post<RequestReceived>("/public/bookings/tables", data);
}

export async function placeFoodOrder(
  data: FoodOrderRequest,
): Promise<RequestReceived> {
  if (config.useMocks) return mockReceived("F", "new");
  return post<RequestReceived>("/public/orders", data);
}

export async function sendEventEnquiry(
  data: EventEnquiryRequest,
): Promise<RequestReceived> {
  if (config.useMocks) return mockReceived("E", "new");
  return post<RequestReceived>("/public/event-enquiries", data);
}
