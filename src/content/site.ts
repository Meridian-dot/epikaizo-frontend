// Fixed website text and links. Text the owner can edit (page intros,
// contact details, prices, hours) comes from the API instead, through
// src/lib/api.ts. Copy is from Pen-Sar's "Website copy" (24 Nov 2026).

export const site = {
  name: "Epikaizo Guesthouse",
  description:
    "A welcoming guesthouse and restaurant beside the Ombalantu Baobab Tree in Outapi, northern Namibia. Built on a historic bunker, open since 2011.",
  place: "Outapi · Omusati Region · Namibia",
} as const;

export const mainNav = [
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/order", label: "Order food" },
  { href: "/events", label: "Meetings & Events" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = [
  { href: "/book/room", label: "Request a room" },
  { href: "/book/table", label: "Book a table" },
  { href: "/order", label: "Order food" },
  { href: "/events", label: "Meetings & Events" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

// Oshiwambo greetings by time of day in Outapi. Used sparingly, always with
// the English beside it.
export const greetings = [
  { from: 0, until: 12, local: "Wa lalapo", english: "Good morning" },
  { from: 12, until: 18, local: "Wa uhala po", english: "Good afternoon" },
  { from: 18, until: 24, local: "Wa tokelwa po", english: "Good evening" },
] as const;

export type StoryChapter = {
  id: string;
  label: string;
  title: string;
  body: string;
  link: { href: string; label: string };
};

// The four stories of Epikaizo, shown on the home page as the four arms of
// the cross-shaped bunker the guesthouse is built on.
export const storyChapters: StoryChapter[] = [
  {
    id: "baobab",
    label: "The Tree of Life",
    title: "A landmark at our doorstep",
    body: "Stay beside the Ombalantu Baobab Tree, a remarkable landmark deeply connected to the heritage of the Ombalantu people. Over centuries it has been a place of refuge, worship and communication, and today it is one of the region's best-loved heritage sites.",
    link: { href: "/about#outapi", label: "About Outapi" },
  },
  {
    id: "bunker",
    label: "The Bunker",
    title: "History beneath your feet",
    body: "The guesthouse is built on the foundations of a cross-shaped military bunker. Today it holds some of our compact rooms, a cool sitting room and a small display of memorabilia, political clothing and other artefacts.",
    link: { href: "/about#bunker", label: "Explore the bunker" },
  },
  {
    id: "table",
    label: "The Table",
    title: "A taste of Namibia",
    body: "Traditional Namibian favourites like eedhingu, ekaka and Marathon chicken, familiar Western dishes, and our much-loved signature pizza. Locals know exactly what to order. Travellers find out why.",
    link: { href: "/restaurant", label: "See the menu" },
  },
  {
    id: "gathering",
    label: "The Gathering",
    title: "Spaces for gathering",
    body: "From small meetings to workshops and training sessions, our hall welcomes groups of about 60 people, and the kitchen can feed everyone.",
    link: { href: "/events", label: "Meetings & Events" },
  },
];

export const homeHighlights = [
  {
    title: "More than just a place to stay",
    body: "Established in 2011, Epikaizo has grown into a familiar stop for travellers, locals and visitors passing through Outapi. Whether you are here on business, travelling through the north or simply looking for somewhere to unwind, there is a place for you.",
  },
] as const;

// Dishes that scroll past on the home and restaurant pages.
export const signatureDishes = [
  "Eedhingu",
  "Ekaka",
  "Marathon chicken",
  "Mopane shrimps",
  "Pap with stew",
  "Goat stew",
  "Epikaizo pizza",
  "Ondjove marula oil",
  "Grilled T-bone",
  "Hake & chips",
] as const;

// Parts of the bunker for the interactive plan on the About page.
// Illustrative only: not an architectural drawing.
export const bunkerParts = [
  {
    id: "north",
    label: "Compact rooms",
    body: "Some of our Type III rooms sit inside the bunker's thick walls, cool in the heat of the day.",
  },
  {
    id: "east",
    label: "Sitting room",
    body: "A shared sitting room with air conditioning and a television, for bunker guests to relax in.",
  },
  {
    id: "south",
    label: "Historical display",
    body: "A small collection of memorabilia, political clothing and other artefacts from the site's past.",
  },
  {
    id: "west",
    label: "More rooms",
    body: "More compact rooms, with a shared bathroom and shower close by.",
  },
] as const;
