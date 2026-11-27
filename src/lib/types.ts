// Shared data shapes for the customer website.
//
// Field names follow the backend's "Admin Dashboard ⇄ API Docking Spec v1.0"
// and the team's "Dashboard compatibility guide" (dashboard-compatibility.pdf),
// so the website and the admin dashboard read and write the same data.
// Anything marked PROPOSED is not in the Docking Spec yet: confirm it with the
// backend developer and change it here, in one place.
//
// Rules from the spec: camelCase, money is a number in N$, calendar dates are
// "YYYY-MM-DD" strings, times are "HH:MM", end dates are exclusive.

export type IsoDate = string; // "2026-12-20"
export type TimeOfDay = string; // "19:00"

export type Photo = {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
};

export type Amenity = {
  id: number;
  name: string;
  icon: string | null;
};

// PROPOSED: each room type has setups with their own price.
export type RoomSetup = {
  id: number;
  roomTypeId: number;
  name: string; // "Double", "Family (twin + single)"
  maxGuests: number;
  pricePerNight: number; // N$
  isActive: boolean;
  sortOrder: number;
  onRequestOnly: boolean; // shown, but only booked in person or by phone
};

// A room type as the public website sees it (only active ones are returned).
export type Room = {
  id: number;
  name: string;
  slug: string;
  description: string; // plain text, a blank line starts a new paragraph
  maxGuests: number;
  totalUnits: number;
  isActive: boolean;
  sortOrder: number;
  amenities: Amenity[];
  photos: Photo[];
  setups: RoomSetup[]; // PROPOSED
};

export type DietaryTag =
  "vegetarian" | "vegan" | "halal" | "gluten-free" | "contains-nuts" | "spicy";

export type MenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number; // N$
  dietaryTags: DietaryTag[];
  isAvailable: boolean; // false = "Not available today"
  sortOrder: number;
  photo: Photo | null;
  // Choices the guest picks one of, e.g. ["Chips", "Rice", "Pap"]. Empty = none.
  // Optional only so older mock data still type-checks; the API always sends it.
  sideOptions?: string[];
};

export type MenuCategory = {
  id: number;
  name: string;
  sortOrder: number;
  items: MenuItem[];
};

// Spec keys are home, about and contact. rooms, restaurant and events are PROPOSED.
export type ContentKey =
  "home" | "about" | "contact" | "rooms" | "restaurant" | "events";

// One block of page text from the dashboard's "Website text" screen.
export type PageSection = {
  heading: string; // may be empty
  body: string; // plain text, a blank line starts a new paragraph
};

export type PageContent = {
  key: ContentKey;
  title: string;
  // All section texts joined with blank lines (headings left out). Used when a
  // page has no sections, e.g. the mock data.
  body: string;
  subtitle?: string; // "Line under the heading" in the dashboard
  sections?: PageSection[];
  // PROPOSED (Dev B, photos per page): the page's photos in order. The site
  // fills its fixed photo spots from these; a missing one shows a placeholder.
  photos?: Photo[];
};

// GET /rooms/:id/availability. End date exclusive, like bookings.
export type RoomAvailability = {
  roomTypeId: number;
  from: IsoDate;
  to: IsoDate;
  nights: { date: IsoDate; available: number }[];
};

// Public settings in one object. Restaurant hours and seats are in the spec
// (RestaurantSettings); the rest is PROPOSED (SiteSettings, FoodOrderSettings).
export type PublicSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  instagramUrl: string;
  checkInTime: TimeOfDay;
  checkOutTime: TimeOfDay;
  lateCheckOutFeePerHour: number;
  freeChildAgeMax: number;
  hallCapacity: number;
  restaurant: {
    openingTime: TimeOfDay;
    closingTime: TimeOfDay;
    slotMinutes: number;
    maxCoversPerSlot: number;
  };
  foodOrders: {
    isOrderingOpen: boolean;
    roomServiceFrom: TimeOfDay;
    roomServiceUntil: TimeOfDay;
    collectionFrom: TimeOfDay;
    collectionUntil: TimeOfDay;
    roomServiceFee: number;
    prepMinutes: number;
    preOrderNoticeHours: number;
  };
};

// ---- Requests the website sends. Staff confirm them; nothing is paid online.

export type OrderLineRequest = {
  menuItemId: number;
  quantity: number;
  side?: string; // one of the item's sideOptions, when it has any
};

export type RoomBookingRequest = {
  roomTypeId: number;
  setupId: number;
  checkIn: IsoDate;
  checkOut: IsoDate; // exclusive: the morning the guest leaves
  guests: number;
  childrenUnder12: number; // PROPOSED: free of charge
  guestName: string;
  email: string;
  phone: string;
  notes: string;
};

export type TableBookingRequest = {
  date: IsoDate;
  timeSlot: TimeOfDay;
  partySize: number;
  guestName: string;
  email: string;
  phone: string;
  notes: string;
  preOrder: OrderLineRequest[]; // PROPOSED, empty when nothing is pre-ordered
};

export type Fulfilment = "room-service" | "collection";

// PROPOSED: food ordering is not in the Docking Spec yet.
export type FoodOrderRequest = {
  fulfilment: Fulfilment;
  roomNumber: string | null; // only for room service
  items: OrderLineRequest[];
  guestName: string;
  phone: string;
  notes: string;
};

// PROPOSED
export type EventEnquiryRequest = {
  guestName: string;
  organisation: string;
  email: string;
  phone: string;
  date: IsoDate | null;
  people: number | null;
  message: string;
};

export type RequestReceived = {
  reference: string; // e.g. "EPK-R-7K3Q9"
  status: string; // "pending" for bookings, "new" for orders and enquiries
};
