"use server";

// Server Actions the forms call. They pass the request on to src/lib/api.ts,
// so the browser never talks to the backend directly. The API has the final
// say on validation; these checks just catch obvious mistakes early.

import {
  ApiError,
  getRoomAvailability,
  placeFoodOrder,
  requestRoomBooking,
  requestTableBooking,
  sendEventEnquiry,
} from "@/lib/api";
import { isIsoDate, nightsBetween } from "@/lib/format";
import type {
  EventEnquiryRequest,
  FoodOrderRequest,
  RequestReceived,
  RoomAvailability,
  RoomBookingRequest,
  TableBookingRequest,
} from "@/lib/types";

export type ActionResult =
  | { ok: true; received: RequestReceived }
  | { ok: false; message: string; fields?: Record<string, string[]> };

async function run(
  check: () => string | null,
  send: () => Promise<RequestReceived>,
): Promise<ActionResult> {
  const problem = check();
  if (problem) return { ok: false, message: problem };
  try {
    return { ok: true, received: await send() };
  } catch (error) {
    // 404 on a request path means the API doesn't take this kind of request
    // yet (the endpoint isn't built), not that the guest did something wrong.
    if (error instanceof ApiError && error.status === 404) {
      return {
        ok: false,
        message:
          "We can't take this request online just yet. Please call or WhatsApp us and we'll sort it out.",
      };
    }
    if (error instanceof ApiError) {
      return { ok: false, message: error.message, fields: error.fields };
    }
    return {
      ok: false,
      message:
        "We couldn't send your request just now. Please try again, or call us.",
    };
  }
}

function contactProblem(name: string, phone: string): string | null {
  if (name.trim().length < 2) return "Please tell us your name.";
  if (phone.replace(/\D/g, "").length < 7)
    return "Please give a phone number we can reach you on.";
  return null;
}

export async function submitRoomBooking(
  data: RoomBookingRequest,
): Promise<ActionResult> {
  return run(
    () => {
      if (!isIsoDate(data.checkIn) || !isIsoDate(data.checkOut))
        return "Please choose your dates.";
      if (nightsBetween(data.checkIn, data.checkOut) < 1)
        return "Check-out must be at least one day after check-in.";
      if (!data.email.includes("@"))
        return "Please give a valid email address.";
      return contactProblem(data.guestName, data.phone);
    },
    () => requestRoomBooking(data),
  );
}

export async function submitTableBooking(
  data: TableBookingRequest,
): Promise<ActionResult> {
  return run(
    () => {
      if (!isIsoDate(data.date)) return "Please choose a date.";
      if (!data.timeSlot) return "Please choose a time.";
      if (data.partySize < 1) return "How many people are coming?";
      if (!data.email.includes("@"))
        return "Please give a valid email address.";
      return contactProblem(data.guestName, data.phone);
    },
    () => requestTableBooking(data),
  );
}

export async function submitFoodOrder(
  data: FoodOrderRequest,
): Promise<ActionResult> {
  return run(
    () => {
      if (data.items.length === 0) return "Please add something to your order.";
      if (data.fulfilment === "room-service" && !data.roomNumber?.trim())
        return "Please tell us your room number.";
      return contactProblem(data.guestName, data.phone);
    },
    () => placeFoodOrder(data),
  );
}

export async function submitEventEnquiry(
  data: EventEnquiryRequest,
): Promise<ActionResult> {
  return run(
    () => {
      if (!data.email.includes("@") && data.phone.replace(/\D/g, "").length < 7)
        return "Please give an email address or phone number.";
      if (data.message.trim().length < 5)
        return "Please tell us a little about your event.";
      return data.guestName.trim().length < 2
        ? "Please tell us your name."
        : null;
    },
    () => sendEventEnquiry(data),
  );
}

// The longest stay the availability check asks about (the API allows 90 nights).
const MAX_CHECK_NIGHTS = 90;

/** Free rooms per night for the request form. null = couldn't check. */
export async function checkRoomAvailability(
  roomTypeId: number,
  checkIn: string,
  checkOut: string,
): Promise<RoomAvailability | null> {
  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return null;
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || nights > MAX_CHECK_NIGHTS) return null;
  return getRoomAvailability(roomTypeId, checkIn, checkOut);
}
