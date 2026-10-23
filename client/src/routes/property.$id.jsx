import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Heart, MapPin, Star, BedDouble, Users, Check, Sparkles, ChevronLeft } from "lucide-react";
import GuestPicker from "@/components/site/GuestPicker";
import { useGetPropertyQuery, useAddBookingMutation, toggleFavorite, selectUser } from "@/store";
import { PROPERTY_TYPES } from "@/data/seed";
import { quote, validateGuests, money } from "@/lib/pricing";

export const Route = createFileRoute("/property/$id")({
  head: () => ({
    meta: [
      { title: "Property details — Staywell" },
      { name: "description", content: "See photos, amenities and prices, then book rooms for adults and children." },
      { property: "og:title", content: "Property details — Staywell" },
      { property: "og:description", content: "See photos, amenities and prices, then book your stay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertyPage,
});

function PropertyPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fav = useSelector((s) => s.ui.favorites.includes(id));
  const { data: p, isLoading, isError } = useGetPropertyQuery(id);
  const [addBooking, { isLoading: saving }] = useAddBookingMutation();
  const [active, setActive] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: [] });
  const [coupon, setCoupon] = useState("");

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-10 md:px-8"><div className="h-[28rem] animate-pulse rounded-3xl bg-muted" /></div>;
  if (isError || !p) return (
    <div className="py-24 text-center"><h1 className="text-3xl">Property not found</h1><Link to="/search" className="btn-primary mt-6">Browse stays</Link></div>
  );

  const type = PROPERTY_TYPES.find((t) => t.slug === p.type);
  const q = quote({ price: p.price, checkIn, checkOut, rooms: guests.rooms, coupon });
  const gallery = p.images?.length ? p.images : [p.image];

  const book = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut || q.nights < 1) return toast.error("Please choose valid check-in and check-out dates.");
    const err = validateGuests(guests);
    if (err) return toast.error(err);
    if (guests.adults + guests.children.length > p.maxGuests * guests.rooms) return toast.error(`Max ${p.maxGuests} guests per room.`);
    await addBooking({ propertyId: p.id, userId: user.id, guestName: user.name, checkIn, checkOut, rooms: guests.rooms, adults: guests.adults, children: guests.children, total: q.total, coupon: q.couponValid ? coupon.toUpperCase() : "" }).unwrap();
    toast.success("Booking request sent! The host will confirm shortly.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Link to="/search" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Back to stays</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{type?.label}</p>
          <h1 className="mt-1 text-3xl font-semibold md:text-5xl">{p.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.city}, {p.country}</span>
            {p.rating > 0 && <span className="flex items-center gap-1 font-semibold text-foreground"><Star className="h-4 w-4 fill-accent text-accent" />{p.rating} <span className="font-normal text-muted-foreground">({p.reviews} reviews)</span></span>}
          </div>
        </div>
        <button onClick={() => dispatch(toggleFavorite(p.id))} className="btn-outline"><Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />{fav ? "Saved" : "Save"}</button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[3fr_1fr]">
        <img src={gallery[active]} alt={p.title} className="aspect-[16/10] w-full rounded-3xl object-cover" />
        <div className="flex gap-3 md:flex-col">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-2xl ring-2 transition ${active === i ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"}`}>
              <img src={g} alt="" className="aspect-[4/3] w-24 object-cover md:w-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="chip"><BedDouble className="h-4 w-4" /> {p.bedrooms} bedrooms</span>
            <span className="chip"><Users className="h-4 w-4" /> Up to {p.maxGuests} guests / room</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed">{p.description}</p>
          <h2 className="mt-10 text-2xl font-semibold">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {p.amenities.map((a) => <div key={a} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" />{a}</div>)}
          </div>
          {p.features?.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-semibold">{type?.label} highlights</h2>
              <div className="mt-4 flex flex-wrap gap-2">{p.features.map((f) => <span key={f} className="chip"><Sparkles className="h-3.5 w-3.5 text-accent" />{f}</span>)}</div>
            </>
          )}
        </div>

        <form onSubmit={book} className="panel h-fit space-y-4 p-6 shadow-lift lg:sticky lg:top-24">
          <p><span className="font-display text-3xl font-semibold text-primary">{money(p.price)}</span><span className="text-muted-foreground"> / night / room</span></p>
          <div className="grid grid-cols-2 gap-3">
            <label><span className="field-label">Check-in</span><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="field" /></label>
            <label><span className="field-label">Check-out</span><input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="field" /></label>
          </div>
          <div><span className="field-label">Rooms & guests</span><GuestPicker value={guests} onChange={setGuests} /></div>
          <label className="block">
            <span className="field-label">Coupon code</span>
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. WELCOME15" className="field uppercase" />
            {coupon && <span className={`mt-1 block text-xs ${q.couponValid ? "text-success" : "text-muted-foreground"}`}>{q.couponValid ? "Coupon applied" : "Code not valid for this stay"}</span>}
          </label>
          {q.nights > 0 && (
            <div className="space-y-1.5 rounded-xl bg-muted p-4 text-sm">
              <div className="flex justify-between"><span>{money(p.price)} × {q.nights} night{q.nights > 1 ? "s" : ""} × {guests.rooms} room{guests.rooms > 1 ? "s" : ""}</span><span>{money(q.subtotal)}</span></div>
              {q.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−{money(q.discount)}</span></div>}
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{money(q.total)}</span></div>
            </div>
          )}
          <button disabled={saving} className="btn-gold w-full py-3 text-base">{saving ? "Booking…" : "Reserve now"}</button>
          <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>
        </form>
      </div>
    </div>
  );
}
