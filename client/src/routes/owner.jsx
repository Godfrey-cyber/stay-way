import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LayoutGrid, Home, PlusCircle, CalendarCheck, DollarSign, Star, Trash2, Check, X } from "lucide-react";
import DashboardShell, { StatusBadge, Stat } from "@/components/site/DashboardShell";
import { BookingRow } from "./dashboard";
import {
  useGetPropertiesQuery, useGetBookingsQuery, useAddPropertyMutation, useUpdatePropertyMutation,
  useDeletePropertyMutation, useUpdateBookingMutation, selectUser,
} from "@/store";
import { PROPERTY_TYPES, AMENITIES, IMAGES } from "@/data/seed";
import { money } from "@/lib/pricing";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Owner dashboard — Staywell" },
      { name: "description", content: "List your destination, set amenities and prices, and manage guest bookings." },
      { property: "og:title", content: "Owner dashboard — Staywell" },
      { property: "og:description", content: "List and manage your properties on Staywell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerDashboard,
});

const blank = { title: "", type: "apartment", city: "", country: "", price: 100, bedrooms: 1, maxGuests: 2, image: IMAGES.aptInterior, description: "", amenities: ["Wi-Fi"], features: [] };

function AddListing({ ownerId, onDone }) {
  const [f, setF] = useState(blank);
  const [add, { isLoading }] = useAddPropertyMutation();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  const toggle = (k, v) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });
  const typeMeta = PROPERTY_TYPES.find((t) => t.slug === f.type);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title || !f.city || !f.country) return toast.error("Title, city and country are required.");
    await add({ ...f, ownerId, images: [f.image] }).unwrap();
    toast.success("Listing submitted — awaiting admin approval");
    setF(blank); onDone();
  };

  return (
    <form onSubmit={submit} className="panel space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="field-label">Property name</span><input value={f.title} onChange={set("title")} className="field" placeholder="e.g. Lamu Sunset House" /></label>
        <label><span className="field-label">Property type</span>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value, features: [] })} className="field">{PROPERTY_TYPES.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}</select>
        </label>
        <label><span className="field-label">Price per night (USD)</span><input type="number" min={1} value={f.price} onChange={set("price")} className="field" /></label>
        <label><span className="field-label">City</span><input value={f.city} onChange={set("city")} className="field" /></label>
        <label><span className="field-label">Country</span><input value={f.country} onChange={set("country")} className="field" /></label>
        <label><span className="field-label">Bedrooms</span><input type="number" min={1} value={f.bedrooms} onChange={set("bedrooms")} className="field" /></label>
        <label><span className="field-label">Max guests per room</span><input type="number" min={1} value={f.maxGuests} onChange={set("maxGuests")} className="field" /></label>
        <label className="sm:col-span-2"><span className="field-label">Cover image URL</span><input value={f.image} onChange={set("image")} className="field" /></label>
        <label className="sm:col-span-2"><span className="field-label">Description</span><textarea rows={3} value={f.description} onChange={set("description")} className="field" /></label>
      </div>
      <div>
        <span className="field-label">Amenities</span>
        <div className="flex flex-wrap gap-2">{AMENITIES.map((a) => <button type="button" key={a} onClick={() => toggle("amenities", a)} className={`chip ${f.amenities.includes(a) ? "chip-active" : ""}`}>{a}</button>)}</div>
      </div>
      <div>
        <span className="field-label">{typeMeta.label} features</span>
        <div className="flex flex-wrap gap-2">{typeMeta.features.map((a) => <button type="button" key={a} onClick={() => toggle("features", a)} className={`chip ${f.features.includes(a) ? "chip-active" : ""}`}>{a}</button>)}</div>
      </div>
      <button disabled={isLoading} className="btn-primary"><PlusCircle className="h-4 w-4" />{isLoading ? "Saving…" : "Publish listing"}</button>
    </form>
  );
}

function OwnerDashboard() {
  const user = useSelector(selectUser);
  const [tab, setTab] = useState("overview");
  const { data: props = [] } = useGetPropertiesQuery();
  const { data: bookings = [] } = useGetBookingsQuery();
  const [updateProp] = useUpdatePropertyMutation();
  const [del] = useDeletePropertyMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const mine = props.filter((p) => p.ownerId === user?.id);
  const ids = mine.map((p) => p.id);
  const myBookings = bookings.filter((b) => ids.includes(b.propertyId));
  const revenue = myBookings.filter((b) => ["confirmed", "completed"].includes(b.status)).reduce((s, b) => s + b.total, 0);
  const avg = mine.filter((p) => p.rating).reduce((s, p, _, a) => s + p.rating / a.length, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "listings", label: "My listings", icon: Home },
    { id: "add", label: "Add listing", icon: PlusCircle },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
  ];

  const bookingList = (list) => list.length ? list.map((b) => (
    <BookingRow key={b.id} b={b} p={props.find((p) => p.id === b.propertyId)} actions={b.status === "pending" && (
      <>
        <button onClick={() => { updateBooking({ id: b.id, status: "confirmed" }); toast.success("Booking confirmed"); }} className="btn-primary py-1.5"><Check className="h-4 w-4" />Accept</button>
        <button onClick={() => updateBooking({ id: b.id, status: "cancelled" })} className="btn-outline py-1.5"><X className="h-4 w-4" /></button>
      </>
    )} />
  )) : <div className="panel p-10 text-center text-muted-foreground">No bookings yet.</div>;

  return (
    <DashboardShell title="Owner dashboard" role="owner" tabs={tabs} active={tab} onTab={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Listings" value={mine.length} icon={Home} />
            <Stat label="Bookings" value={myBookings.length} icon={CalendarCheck} />
            <Stat label="Revenue" value={money(revenue)} icon={DollarSign} />
            <Stat label="Avg rating" value={avg ? avg.toFixed(1) : "—"} icon={Star} />
          </div>
          <h2 className="text-2xl font-semibold">Pending requests</h2>
          <div className="space-y-4">{bookingList(myBookings.filter((b) => b.status === "pending"))}</div>
        </div>
      )}
      {tab === "listings" && (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Property</th><th>Type</th><th>Status</th><th>Price / night</th><th></th></tr>
            </thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-4"><Link to="/property/$id" params={{ id: p.id }} className="flex items-center gap-3 font-semibold hover:text-primary"><img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />{p.title}</Link><p className="ml-[4.25rem] text-xs text-muted-foreground">{p.city}, {p.country}</p></td>
                  <td className="capitalize">{p.type}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><input type="number" defaultValue={p.price} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.price) { updateProp({ id: p.id, price: v }); toast.success("Price updated"); } }} className="field w-24 py-1.5" /></td>
                  <td className="pr-4 text-right"><button aria-label="Delete listing" onClick={() => { del(p.id); toast("Listing removed"); }} className="btn-icon hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "add" && <AddListing ownerId={user?.id} onDone={() => setTab("listings")} />}
      {tab === "bookings" && <div className="space-y-4">{bookingList(myBookings)}</div>}
    </DashboardShell>
  );
}
