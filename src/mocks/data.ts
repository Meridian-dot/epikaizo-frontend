// All mock data lives in this file. Pages never import it directly:
// they go through src/lib/api.ts, which picks mock or real data.
//
// The shapes match the backend Docking Spec v1.0 and the dashboard
// compatibility guide, so the admin dashboard can share this data.
// Values are the client's real ones (24 Nov 2026). Photos are empty on
// purpose: the owner adds them in the dashboard, and the site shows
// patterned placeholders until then.

import type {
  Amenity,
  DietaryTag,
  MenuCategory,
  MenuItem,
  PageContent,
  PublicSettings,
  Room,
  RoomSetup,
} from "@/lib/types";

// ---------------------------------------------------------------- Settings

export const mockSettings: PublicSettings = {
  phone: "+264 81 8230 233",
  whatsapp: "+264818230233",
  email: "epikaizoguesthouse@gmail.com",
  address: "Erf 1140, Outapi, Omusati Region, Namibia",
  mapsUrl: "https://maps.app.goo.gl/6U1rnV8P3Scc36j1A",
  instagramUrl: "https://www.instagram.com/epikaizoguest/",
  checkInTime: "12:00",
  checkOutTime: "10:00",
  lateCheckOutFeePerHour: 50,
  freeChildAgeMax: 12,
  hallCapacity: 60,
  restaurant: {
    openingTime: "07:00",
    closingTime: "22:00",
    slotMinutes: 300,
    maxCoversPerSlot: 70,
  },
  foodOrders: {
    isOrderingOpen: true,
    roomServiceFrom: "07:00",
    roomServiceUntil: "22:00",
    collectionFrom: "09:00",
    collectionUntil: "22:00",
    roomServiceFee: 20,
    prepMinutes: 45,
    preOrderNoticeHours: 3,
  },
};

// ------------------------------------------------------------------- Rooms

const amenity = {
  aircon: { id: 1, name: "Air conditioning", icon: "aircon" },
  tv: { id: 2, name: "TV", icon: "tv" },
  fridge: { id: 3, name: "Fridge", icon: "fridge" },
  bathroom: { id: 4, name: "Private bathroom", icon: "bath" },
  closet: { id: 5, name: "Closet", icon: "closet" },
  kettle: { id: 6, name: "Kettle and coffee", icon: "kettle" },
  balcony: { id: 7, name: "Balcony", icon: "balcony" },
  sharedBath: { id: 8, name: "Shared bathroom and shower", icon: "bath" },
  sharedLounge: {
    id: 9,
    name: "Shared sitting room with air conditioning and TV",
    icon: "lounge",
  },
  parking: { id: 10, name: "Free parking", icon: "parking" },
} satisfies Record<string, Amenity>;

const standard = [
  amenity.aircon,
  amenity.tv,
  amenity.fridge,
  amenity.bathroom,
  amenity.closet,
  amenity.kettle,
  amenity.parking,
];

let setupId = 0;
function setup(
  roomTypeId: number,
  name: string,
  maxGuests: number,
  pricePerNight: number,
  onRequestOnly = false,
): RoomSetup {
  setupId += 1;
  return {
    id: setupId,
    roomTypeId,
    name,
    maxGuests,
    pricePerNight,
    isActive: true,
    sortOrder: setupId,
    onRequestOnly,
  };
}

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Type I Family Room",
    slug: "type-i-family",
    description:
      "Our most spacious rooms, with two 3/4 beds and room for a single bed when the family comes along.\n\nSet the beds up as a twin, push them together as a double, or add the single bed for a family of three. Tell us what you need and we will have the room ready when you arrive.",
    maxGuests: 3,
    totalUnits: 2,
    isActive: true,
    sortOrder: 1,
    amenities: standard,
    photos: [],
    setups: [
      setup(1, "Single", 1, 440),
      setup(1, "Twin", 2, 550),
      setup(1, "Double", 2, 550),
      setup(1, "Family (twin + single)", 3, 850),
      setup(1, "Family (double + single)", 3, 850),
    ],
  },
  {
    id: 2,
    name: "Type II Standard Room, Upstairs",
    slug: "type-ii-upstairs",
    description:
      "A comfortable standard room on the upper floor with its own balcony, a good spot for the evening breeze after a long day on the road.\n\nTwo 3/4 beds that we set up as a twin or push together as a double.",
    maxGuests: 2,
    totalUnits: 5,
    isActive: true,
    sortOrder: 2,
    amenities: [...standard, amenity.balcony],
    photos: [],
    setups: [
      setup(2, "Single", 1, 400),
      setup(2, "Twin", 2, 550),
      setup(2, "Double", 2, 550),
    ],
  },
  {
    id: 3,
    name: "Type II Standard Room, Downstairs",
    slug: "type-ii-downstairs",
    description:
      "A comfortable standard room on the ground floor, close to the restaurant and the parking.\n\nTwo 3/4 beds that we set up as a twin or push together as a double.",
    maxGuests: 2,
    totalUnits: 5,
    isActive: true,
    sortOrder: 3,
    amenities: standard,
    photos: [],
    setups: [
      setup(3, "Single", 1, 400),
      setup(3, "Twin", 2, 550),
      setup(3, "Double", 2, 550),
    ],
  },
  {
    id: 4,
    name: "Type III Compact Bunker Room",
    slug: "type-iii-bunker",
    description:
      "Sleep inside the foundations of the original cross-shaped bunker the guesthouse was built on. These compact rooms have one 3/4 bed and offer something rather unusual: a night within a structure that is part of the site's history.\n\nBathroom and shower are shared, and guests share the bunker's sitting room, with air conditioning and a television.",
    maxGuests: 1,
    totalUnits: 5,
    isActive: true,
    sortOrder: 4,
    amenities: [
      amenity.aircon,
      amenity.sharedBath,
      amenity.sharedLounge,
      amenity.parking,
    ],
    photos: [],
    setups: [
      setup(4, "Single", 1, 300),
      setup(4, "Couple on one 3/4 bed", 2, 400, true),
    ],
  },
];

// -------------------------------------------------------------------- Menu

const SIDES =
  "Served with one of: chips, rice, veggies, pasta, spaghetti, pap, baked or boiled potatoes.";

type Row = [
  name: string,
  price: number,
  description?: string,
  tags?: DietaryTag[],
];

let itemId = 0;
function category(id: number, name: string, rows: Row[]): MenuCategory {
  const items: MenuItem[] = rows.map(
    ([itemName, price, description, tags], i) => {
      itemId += 1;
      return {
        id: itemId,
        categoryId: id,
        name: itemName,
        description: description ?? "",
        price,
        dietaryTags: tags ?? [],
        isAvailable: true,
        sortOrder: i + 1,
        photo: null,
      };
    },
  );
  return { id, name, sortOrder: id, items };
}

export const mockMenu: MenuCategory[] = [
  category(1, "Soups", [
    ["Butternut / Pumpkin Soup", 40, "", ["vegetarian"]],
    ["Chicken Soup", 40],
    ["Mushroom Soup", 40, "", ["vegetarian"]],
  ]),
  category(2, "Salads", [
    [
      "Greek Salad",
      65,
      "Lettuce, cucumber, feta, onion, olives, tomato and peppers.",
      ["vegetarian"],
    ],
    [
      "Green Salad",
      60,
      "Lettuce, cucumber, onion, tomato and peppers.",
      ["vegetarian", "vegan"],
    ],
    [
      "Chicken Salad",
      65,
      "Lettuce, Cajun chicken strips, onion, tomato and green peppers.",
    ],
    ["Beef Salad", 80, "Lettuce, tomato, onion and green peppers."],
  ]),
  category(3, "Traditional Cuisine", [
    [
      "Marathon Chicken (half)",
      145,
      "Free-range chicken, the way it is cooked at home in the north.",
    ],
    ["Marathon Chicken (whole)", 250],
    ["Mopane Shrimps", 75],
    ["Eedhingu (dry meat)", 110],
    ["Ekaka (traditional spinach)", 65, "", ["vegetarian"]],
    ["Extra Pap", 25, "", ["vegetarian", "vegan"]],
    ["Ondjove (marula oil), 5 ml", 25],
  ]),
  category(4, "Pizza", [
    [
      "Epikaizo Pizza",
      160,
      "Our signature. Red meat, tomato, onion, green pepper and cheese.",
    ],
    ["Chicken Pizza", 140, "Chicken, onion, mushroom, tomato and cheese."],
    ["Hawaii Pizza", 140, "Bacon, pineapple and cheese."],
    [
      "Mexican Pizza",
      140,
      "Mince, tomato, onion, green pepper, mushroom and cheese.",
      ["spicy"],
    ],
    [
      "Vegetarian Pizza",
      140,
      "Mushroom, tomato, onion, pineapple and cheese.",
      ["vegetarian"],
    ],
    ["Pizza Box", 5, "For take-away pizzas."],
  ]),
  category(5, "Red Meat", [
    ["Grilled T-bone Steak", 210, SIDES],
    ["Grilled Lamb Chops", 165, SIDES],
    ["Grilled Goat Steak", 165, SIDES],
    ["Grilled Beef Steak", 165, SIDES],
    ["Beef Strips", 155, SIDES],
    ["Beef Stew", 175, SIDES],
    ["Goat Stew", 175, SIDES],
  ]),
  category(6, "Chicken", [
    ["Grilled Chicken (drumsticks)", 155, SIDES],
    ["Grilled Chicken BBQ Wings (4)", 135, SIDES],
    ["Chicken Schnitzel", 165, SIDES],
    ["Chicken Stir-fry", 145, SIDES],
    ["Chicken Curry", 155, SIDES, ["spicy"]],
  ]),
  category(7, "Fish", [
    ["Hake Fillet", 175, SIDES],
    ["Baby Hake", 155, SIDES],
    ["Prawns (6)", 185, SIDES],
  ]),
  category(8, "Pork", [
    ["Grilled Pork Chops", 155, SIDES],
    ["Pork Schnitzel", 155, SIDES],
    ["Spare Ribs", 155, SIDES],
  ]),
  category(9, "Pasta", [
    ["Chicken Pasta", 145],
    ["Spaghetti Bolognese", 145],
  ]),
  category(10, "Light Meals", [
    ["Russian with Chips", 70],
    ["Boerewors with Chips", 70],
    ["Plain Chips", 35, "", ["vegetarian", "vegan"]],
    ["Russian only", 35],
    ["Boerewors only", 35],
  ]),
  category(11, "Sauces", [
    ["Mushroom Sauce", 25],
    ["Garlic Sauce", 25],
    ["Lemon Sauce", 25],
    ["Pepper Sauce", 25],
  ]),
  category(12, "Desserts", [
    ["Ice Cream", 30, "", ["vegetarian"]],
    ["Fruit Salad", 45, "", ["vegetarian", "vegan"]],
    ["Milkshake", 50, "", ["vegetarian"]],
  ]),
  category(13, "Platters (serve 8 to 10)", [
    ["Epikaizo Platter", 750, "Chicken, baby hake, meatballs and beef."],
    ["Cocktail Dip Platter", 660, "Chicken, meatballs and russians."],
    ["Veggie Platter", 590, "A variety of vegetables.", ["vegetarian"]],
    ["Savoury Platter", 520, "Pizza, meat pie and fish fingers."],
    ["Egg & Sausage Platter", 450, "Russians, eggs and Epikaizo sauce."],
    ["Sandwich Platter", 350, "Bread, cheese and polony."],
  ]),
  category(14, "Soft Drinks", [
    ["Cool Drink Can, 300 ml", 18],
    ["Lemonade / Dry Lemon / Ginger Ale / Tonic", 18],
    ["Appletiser / Grapetiser, 300 ml", 30],
    ["Liquifruit Juice, 300 ml", 22],
    ["Glass of Fruit Juice", 16],
    ["Fruit Juice, 1 L", 35],
    ["Bonaqua Water, 500 ml", 16],
  ]),
  category(15, "Cocktails", [
    ["Epikaizo Cocktail", 75],
    ["Rock Shandy", 55],
    ["Beer Shandy", 50],
    ["Passion Fruit", 45],
  ]),
  category(16, "Beer & Cider", [
    ["Beer, dumpy 330 ml (all brands)", 25],
    ["Beer, can 440 / 500 ml (all brands)", 30],
    ["Savanna Lemon / Light / Dry, 330 ml", 30],
    ["Savanna Dry, 500 ml", 30],
    ["Hunter's Dry / Gold, 330 ml", 25],
    ["Belgravia, 440 ml", 30],
    ["Clausthaler can, 440 ml", 30],
  ]),
  category(17, "Wine", [
    ["Annabelle Rosé, 750 ml", 150],
    ["Nederburg Rosé, 750 ml", 130],
    ["Nederburg Rosé, 250 ml", 55],
    ["JC le Roux, 750 ml", 150],
    ["JC le Roux, 250 ml", 55],
    ["Royal non-alcoholic, 750 ml", 90],
    ["Saint Céline Natural Sweet, 750 ml", 120],
    ["Cellar Cask, 750 ml", 120],
    ["Four Cousins, 750 ml", 120],
    ["4th Street, 750 ml", 120],
    ["Delush, 750 ml", 120],
    ["Du Toitskloof, 750 ml", 150],
    ["Bonne Esperance, 750 ml", 120],
    ["Nederburg Baronne, 750 ml", 150],
    ["Nederburg Baronne, 250 ml", 55],
    ["KWV Pinotage, 750 ml", 150],
    ["King's Road, 750 ml", 150],
    ["Tassenberg / Oshitufi Dry, 750 ml", 90],
    ["Chateau, 750 ml", 140],
    ["ROB Mimosa Sparkling, 750 ml", 160],
    ["Spice Route, 750 ml", 190],
    ["Bellingham, 750 ml", 250],
    ["Arco do Esporão, 750 ml", 250],
    ["Plaisir de Merle, 750 ml", 250],
    ["Optima, 750 ml", 450],
    ["Rupert & Rothschild, 750 ml", 450],
    ["Hennessy, 750 ml", 950],
  ]),
  category(18, "Spirits & Liqueurs", [
    ["White Horse, 200 ml", 110],
    ["Richelieu, 200 ml", 95],
    ["Jameson, 200 ml", 195],
    ["Jack Daniel's, 50 ml", 65],
    ["Jack Daniel's, 200 ml", 190],
    ["Jägermeister, 20 ml", 35],
    ["Gordon's Gin, 200 ml", 95],
    ["Clubman, 200 ml", 45],
    ["Moni's Cream, 750 ml", 250],
    ["Oude Meester Peppermint, 750 ml", 350],
    ["PO 10 C, 750 ml", 295],
    ["Amarula Cream, 375 ml", 140],
    ["Amarula Cream, 50 ml", 40],
    ["Underberg, 20 ml", 35],
    ["Old Brown Sherry, 750 ml", 130],
    ["Old Brown Sherry, 200 ml", 35],
    ["Mokador, 200 ml", 45],
    ["Squadron, 200 ml", 85],
  ]),
];

// ----------------------------------------------------------- Page content
// The owner edits these intro texts in the dashboard ("Website text").

export const mockContent: PageContent[] = [
  {
    key: "home",
    title: "Stay Somewhere with a Story to Tell.",
    body: "Discover the warmth of Namibian hospitality at Epikaizo Guesthouse, where history, culture and comfort meet. Right beside the iconic Ombalantu Baobab Tree in the heart of Outapi, we offer a welcoming place to rest, dine and experience the character of northern Namibia.",
  },
  {
    key: "about",
    title: "A Place Where History Lives On.",
    body: "Epikaizo Guesthouse was established in 2011 with a simple purpose: to give visitors to Outapi a welcoming place to stay, good food and genuine hospitality.\n\nOver the years it has become more than accommodation. It is a place where travellers, locals and business visitors meet, share experiences and enjoy a little of what northern Namibia has to offer.\n\nWhat makes Epikaizo particularly special is its history. The guesthouse was built on the foundations of an old cross-shaped military bunker. Rather than letting it disappear into the past, parts of it have become part of the guesthouse itself.",
  },
  {
    key: "contact",
    title: "Come and Say Hello.",
    body: "Whether you are planning a stay, booking a table for the family or organising a training for your team, we are happy to help. Call or WhatsApp us, send an email, or simply walk in. You will find us right beside the Ombalantu Baobab Tree in Outapi.",
  },
  {
    key: "rooms",
    title: "Rest Easy. Feel at Home.",
    body: "After a long day on the road, a busy schedule or an adventure through northern Namibia, you deserve somewhere comfortable to unwind.\n\nWhether you are travelling alone, visiting with family or staying in Outapi for business, we have a room for you, with a welcoming atmosphere, a convenient location and free parking.",
  },
  {
    key: "restaurant",
    title: "Good Food. Generous Hospitality. A Taste of Home.",
    body: "At Epikaizo Restaurant we believe good food should bring people together. Our kitchen combines traditional Namibian flavours with familiar Western dishes, so there is something for adventurous diners and for those who simply enjoy a good, satisfying meal.\n\nWhether you are a local stopping by for lunch, a traveller exploring the north or a guest staying with us, there is always a seat waiting.",
  },
  {
    key: "events",
    title: "A Space to Meet, Learn and Connect.",
    body: "Whether you are organising a corporate meeting, a training session, a community gathering or a workshop, Epikaizo Guesthouse offers a practical venue for bringing people together in the heart of Outapi.\n\nOur hall holds about 60 people, and our kitchen can feed the whole group.",
  },
];
