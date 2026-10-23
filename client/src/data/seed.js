const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

export const IMAGES = {
  pool: img("photo-1566073771259-6a8506099945"),
  room: img("photo-1582719478250-c89cae4dc85b"),
  resort: img("photo-1520250497591-112f2f40a3f4"),
  hotel: img("photo-1542314831-068cd1dbfeeb"),
  house: img("photo-1564013799919-ab600027ffc6"),
  villa: img("photo-1512917774080-9991f1c4c750"),
  aptInterior: img("photo-1502672260266-1c1ef2d93688"),
  apt: img("photo-1522708323590-d24dbb6b0267"),
  apt2: img("photo-1560448204-e02f11c3d0e2"),
  villa2: img("photo-1613490493576-7fde63acd811"),
  modern: img("photo-1600596542815-ffad4c1539a9"),
  cottage: img("photo-1449844908441-8829872d2607"),
  bedroom: img("photo-1505693416388-ac5ce068fe85"),
};

export const PROPERTY_TYPES = [
  { slug: "apartment", label: "Apartment", image: IMAGES.apt, blurb: "City living with hotel comfort",
    features: ["High floor", "Elevator", "Balcony", "City view", "Concierge"] },
  { slug: "bungalow", label: "Bungalow", image: IMAGES.house, blurb: "Single-storey homes with gardens",
    features: ["Private garden", "Veranda", "BBQ area", "Pet friendly", "Fenced compound"] },
  { slug: "condominium", label: "Condominium", image: IMAGES.apt2, blurb: "Shared amenities, private space",
    features: ["Shared pool", "Gym access", "24/7 security", "Rooftop terrace", "Co-working lounge"] },
  { slug: "villa", label: "Villa", image: IMAGES.villa2, blurb: "Private luxury for groups",
    features: ["Private pool", "Chef on request", "Sea view", "Staff quarters", "Outdoor dining"] },
  { slug: "cottage", label: "Cottage", image: IMAGES.cottage, blurb: "Cosy retreats in nature",
    features: ["Fireplace", "Mountain view", "Hiking trails", "Wood cabin", "Farm breakfast"] },
  { slug: "hotel", label: "Boutique Hotel", image: IMAGES.hotel, blurb: "Curated rooms with service",
    features: ["Room service", "Spa", "Restaurant", "Airport shuttle", "Daily housekeeping"] },
];

export const AMENITIES = ["Wi-Fi", "Pool", "Parking", "Air conditioning", "Kitchen", "Breakfast", "Workspace", "Washer", "TV", "Beach access"];

const P = (o) => ({ status: "approved", ownerId: "owner-1", reviews: 120, ...o });

export const PROPERTIES = [
  P({ id: "p1", title: "Skyline Loft Westlands", type: "apartment", city: "Nairobi", country: "Kenya", price: 95, rating: 4.8, reviews: 214, bedrooms: 2, maxGuests: 4, image: IMAGES.apt, images: [IMAGES.apt, IMAGES.aptInterior, IMAGES.bedroom], amenities: ["Wi-Fi", "Parking", "Kitchen", "Workspace", "TV"], features: ["High floor", "Elevator", "City view"], description: "A bright two-bedroom loft above Westlands with sweeping skyline views, walking distance to cafés and galleries." }),
  P({ id: "p2", title: "Kilimani Garden Bungalow", type: "bungalow", city: "Nairobi", country: "Kenya", price: 140, rating: 4.6, bedrooms: 3, maxGuests: 6, image: IMAGES.house, images: [IMAGES.house, IMAGES.room, IMAGES.bedroom], amenities: ["Wi-Fi", "Parking", "Kitchen", "Washer"], features: ["Private garden", "Veranda", "Pet friendly"], description: "A leafy family bungalow with a wide veranda, lush lawn and quiet neighbourhood." }),
  P({ id: "p3", title: "Diani Ocean Villa", type: "villa", city: "Diani", country: "Kenya", price: 420, rating: 4.9, reviews: 98, bedrooms: 5, maxGuests: 10, image: IMAGES.villa2, images: [IMAGES.villa2, IMAGES.pool, IMAGES.bedroom], amenities: ["Wi-Fi", "Pool", "Beach access", "Air conditioning", "Kitchen", "Breakfast"], features: ["Private pool", "Sea view", "Chef on request"], description: "Beachfront villa on Diani's white sands with infinity pool and staff on hand." }),
  P({ id: "p4", title: "Nyali Shores Condo", type: "condominium", city: "Mombasa", country: "Kenya", price: 110, rating: 4.5, bedrooms: 2, maxGuests: 4, image: IMAGES.apt2, images: [IMAGES.apt2, IMAGES.aptInterior], amenities: ["Wi-Fi", "Pool", "Air conditioning", "Parking"], features: ["Shared pool", "Gym access", "24/7 security"], description: "Modern condo steps from Nyali beach with a resort-style shared pool." }),
  P({ id: "p5", title: "Stone Town Heritage House", type: "hotel", city: "Zanzibar", country: "Tanzania", price: 160, rating: 4.7, reviews: 301, bedrooms: 1, maxGuests: 2, image: IMAGES.hotel, images: [IMAGES.hotel, IMAGES.room], amenities: ["Wi-Fi", "Breakfast", "Air conditioning"], features: ["Room service", "Restaurant", "Spa"], description: "A restored merchant's house with carved doors, rooftop dining and spice-scented courtyards." }),
  P({ id: "p6", title: "Nungwi Beach Retreat", type: "villa", city: "Zanzibar", country: "Tanzania", price: 360, rating: 4.8, bedrooms: 4, maxGuests: 8, image: IMAGES.pool, images: [IMAGES.pool, IMAGES.resort], amenities: ["Pool", "Beach access", "Breakfast", "Wi-Fi"], features: ["Private pool", "Sea view", "Outdoor dining"], description: "Sunset-facing villa on the northern tip of Zanzibar." }),
  P({ id: "p7", title: "Arusha Coffee Farm Cottage", type: "cottage", city: "Arusha", country: "Tanzania", price: 85, rating: 4.7, bedrooms: 2, maxGuests: 4, image: IMAGES.cottage, images: [IMAGES.cottage, IMAGES.bedroom], amenities: ["Wi-Fi", "Parking", "Breakfast"], features: ["Fireplace", "Mountain view", "Farm breakfast"], description: "A wooden cottage among coffee rows with views of Mount Meru." }),
  P({ id: "p8", title: "Camps Bay Glass House", type: "villa", city: "Cape Town", country: "South Africa", price: 510, rating: 4.9, reviews: 76, bedrooms: 4, maxGuests: 8, image: IMAGES.modern, images: [IMAGES.modern, IMAGES.villa], amenities: ["Wi-Fi", "Pool", "Parking", "Air conditioning", "Workspace"], features: ["Private pool", "Sea view"], description: "Architectural villa beneath the Twelve Apostles overlooking the Atlantic." }),
  P({ id: "p9", title: "V&A Waterfront Apartment", type: "apartment", city: "Cape Town", country: "South Africa", price: 130, rating: 4.6, bedrooms: 1, maxGuests: 2, image: IMAGES.aptInterior, images: [IMAGES.aptInterior, IMAGES.apt], amenities: ["Wi-Fi", "Kitchen", "TV", "Washer"], features: ["Balcony", "Concierge", "Elevator"], description: "Stylish one-bedroom by the harbour, close to restaurants and the ferry to Robben Island." }),
  P({ id: "p10", title: "Medina Riad Courtyard", type: "hotel", city: "Marrakech", country: "Morocco", price: 120, rating: 4.8, reviews: 412, bedrooms: 1, maxGuests: 3, image: IMAGES.resort, images: [IMAGES.resort, IMAGES.room], amenities: ["Wi-Fi", "Breakfast", "Pool", "Air conditioning"], features: ["Spa", "Restaurant", "Airport shuttle"], description: "A tranquil riad with a plunge pool and rooftop terrace in the heart of the medina." }),
  P({ id: "p11", title: "Kigali Hills Condominium", type: "condominium", city: "Kigali", country: "Rwanda", price: 90, rating: 4.5, bedrooms: 2, maxGuests: 4, image: IMAGES.villa, images: [IMAGES.villa, IMAGES.aptInterior], amenities: ["Wi-Fi", "Parking", "Workspace", "Kitchen"], features: ["Rooftop terrace", "Co-working lounge", "24/7 security"], description: "Calm, modern condo on Kigali's green hills with a shared rooftop." }),
  P({ id: "p12", title: "Lake Kivu Bungalow", type: "bungalow", city: "Gisenyi", country: "Rwanda", price: 105, rating: 4.4, bedrooms: 2, maxGuests: 5, image: IMAGES.room, images: [IMAGES.room, IMAGES.house], amenities: ["Wi-Fi", "Parking", "Breakfast", "Beach access"], features: ["Private garden", "BBQ area", "Veranda"], description: "Lakeside bungalow with its own garden path down to the water." }),
];

export const USERS = [
  { id: "guest-1", name: "Amina Wanjiru", email: "amina@example.com", role: "guest", joined: "2025-03-12" },
  { id: "guest-2", name: "Lucas Meyer", email: "lucas@example.com", role: "guest", joined: "2025-07-02" },
  { id: "owner-1", name: "David Otieno", email: "david@example.com", role: "owner", joined: "2024-11-20" },
  { id: "admin-1", name: "Grace Admin", email: "admin@example.com", role: "admin", joined: "2024-01-01" },
];

export const BOOKINGS = [
  { id: "b1", propertyId: "p3", userId: "guest-1", guestName: "Amina Wanjiru", checkIn: "2026-12-20", checkOut: "2026-12-26", rooms: 2, adults: 4, children: [6, 9], total: 5040, status: "confirmed", createdAt: "2026-09-01" },
  { id: "b2", propertyId: "p5", userId: "guest-1", guestName: "Amina Wanjiru", checkIn: "2026-05-02", checkOut: "2026-05-05", rooms: 1, adults: 2, children: [], total: 480, status: "completed", createdAt: "2026-03-14" },
  { id: "b3", propertyId: "p1", userId: "guest-2", guestName: "Lucas Meyer", checkIn: "2026-11-10", checkOut: "2026-11-14", rooms: 1, adults: 2, children: [], total: 380, status: "pending", createdAt: "2026-10-10" },
];

export const CURRENT_USER = { guest: "guest-1", owner: "owner-1", admin: "admin-1" };
