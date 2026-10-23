import { configureStore, createSlice } from "@reduxjs/toolkit";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { PROPERTIES, BOOKINGS, USERS, CURRENT_USER } from "@/data/seed";

/* ---------- Mock "server" (in-memory, persisted to localStorage) ---------- */
const KEY = "staywell-db-v1";
let db = null;
function getDb() {
  if (db) return db;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return (db = JSON.parse(raw));
    } catch {}
  }
  db = { properties: structuredClone(PROPERTIES), bookings: structuredClone(BOOKINGS), users: USERS };
  return db;
}
const save = () => typeof window !== "undefined" && localStorage.setItem(KEY, JSON.stringify(db));
const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const uid = (p) => `${p}${Date.now().toString(36)}`;

/* ---------- RTK Query API ---------- */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Property", "Booking"],
  endpoints: (b) => ({
    getProperties: b.query({
      async queryFn() { await wait(); return { data: getDb().properties }; },
      providesTags: ["Property"],
    }),
    getProperty: b.query({
      async queryFn(id) {
        await wait(120);
        const p = getDb().properties.find((x) => x.id === id);
        return p ? { data: p } : { error: { status: 404, message: "Not found" } };
      },
      providesTags: ["Property"],
    }),
    addProperty: b.mutation({
      async queryFn(body) {
        await wait();
        const p = { id: uid("p"), rating: 0, reviews: 0, status: "pending", images: [body.image], ...body };
        getDb().properties.unshift(p); save();
        return { data: p };
      },
      invalidatesTags: ["Property"],
    }),
    updateProperty: b.mutation({
      async queryFn({ id, ...patch }) {
        const d = getDb(); d.properties = d.properties.map((p) => (p.id === id ? { ...p, ...patch } : p)); save();
        return { data: id };
      },
      invalidatesTags: ["Property"],
    }),
    deleteProperty: b.mutation({
      async queryFn(id) {
        const d = getDb(); d.properties = d.properties.filter((p) => p.id !== id); save();
        return { data: id };
      },
      invalidatesTags: ["Property"],
    }),
    getBookings: b.query({
      async queryFn() { await wait(); return { data: getDb().bookings }; },
      providesTags: ["Booking"],
    }),
    addBooking: b.mutation({
      async queryFn(body) {
        await wait(400);
        const bk = { id: uid("b"), status: "pending", createdAt: new Date().toISOString().slice(0, 10), ...body };
        getDb().bookings.unshift(bk); save();
        return { data: bk };
      },
      invalidatesTags: ["Booking"],
    }),
    updateBooking: b.mutation({
      async queryFn({ id, ...patch }) {
        const d = getDb(); d.bookings = d.bookings.map((x) => (x.id === id ? { ...x, ...patch } : x)); save();
        return { data: id };
      },
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetPropertiesQuery, useGetPropertyQuery, useAddPropertyMutation, useUpdatePropertyMutation,
  useDeletePropertyMutation, useGetBookingsQuery, useAddBookingMutation, useUpdateBookingMutation,
} = api;

/* ---------- UI slice: demo role + favourites ---------- */
const ui = createSlice({
  name: "ui",
  initialState: { role: "guest", favorites: ["p3", "p10"] },
  reducers: {
    setRole: (s, a) => { s.role = a.payload; },
    toggleFavorite: (s, a) => {
      s.favorites = s.favorites.includes(a.payload) ? s.favorites.filter((f) => f !== a.payload) : [...s.favorites, a.payload];
    },
  },
});
export const { setRole, toggleFavorite } = ui.actions;

export const selectUser = (s) => USERS.find((u) => u.id === CURRENT_USER[s.ui.role]);

export const makeStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer, ui: ui.reducer },
    middleware: (gdm) => gdm().concat(api.middleware),
  });
