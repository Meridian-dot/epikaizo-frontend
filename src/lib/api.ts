// The only place that talks to the backend API.
// Every function returns mock data while NEXT_PUBLIC_USE_MOCKS is not "false".
//
// Paths are the PUBLIC endpoints proposed to the backend developer
// (backend-followups.pdf). Confirm them and update them here; pages and
// forms should not need to change.

import { cacheLife } from "next/cache";
import { config } from "@/lib/config";
import { mockContent, mockMenu, mockRooms, mockSettings } from "@/mocks/data";
import type {
  ContentKey,
  EventEnquiryRequest,
  FoodOrderRequest,
  MenuCategory,
  PageContent,
  PublicSettings,
  RequestReceived,
  Room,
  RoomBookingRequest,
  TableBookingRequest,
} from "@/lib/types";

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

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
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

function mockReceived(prefix: string, status: string): RequestReceived {
  const code = Math.random().toString(36).slice(2, 7).toUpperCase();
  return { reference: `EPK-${prefix}-${code}`, status };
}

// ---- Reads (cached; used by server components) ----

export async function getRooms(): Promise<Room[]> {
  "use cache";
  cacheLife("minutes");
  if (config.useMocks) return mockRooms.filter((r) => r.isActive);
  return request<Room[]>("/public/rooms");
}

export async function getRoom(slug: string): Promise<Room | null> {
  "use cache";
  cacheLife("minutes");
  if (config.useMocks) return mockRooms.find((r) => r.slug === slug) ?? null;
  try {
    return await request<Room>(`/public/rooms/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getMenu(): Promise<MenuCategory[]> {
  "use cache";
  cacheLife("minutes");
  if (config.useMocks) return mockMenu;
  return request<MenuCategory[]>("/public/menu");
}

export async function getPageContent(key: ContentKey): Promise<PageContent> {
  "use cache";
  cacheLife("minutes");
  if (config.useMocks) {
    const found = mockContent.find((c) => c.key === key);
    if (!found) throw new Error(`No mock content for "${key}"`);
    return found;
  }
  return request<PageContent>(`/public/content/${key}`);
}

export async function getSettings(): Promise<PublicSettings> {
  "use cache";
  cacheLife("minutes");
  if (config.useMocks) return mockSettings;
  return request<PublicSettings>("/public/settings");
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
