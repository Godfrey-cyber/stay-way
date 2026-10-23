import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import GuestPicker from "./GuestPicker";
import { validateGuests } from "@/lib/pricing";

export default function BookingSearch() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: [] });

  const submit = (e) => {
    e.preventDefault();
    const err = validateGuests(guests);
    if (err) return toast.error(err);
    if (checkIn && checkOut && checkOut <= checkIn) return toast.error("Check-out must be after check-in.");
    navigate({
      to: "/search",
      search: { q: destination, checkIn, checkOut, rooms: guests.rooms, adults: guests.adults, children: guests.children.join(",") },
    });
  };

  return (
    <form onSubmit={submit} className="panel grid gap-3 p-4 shadow-lift md:grid-cols-[1.4fr_1fr_1fr_1.4fr_auto] md:items-end md:p-5">
      <label className="block">
        <span className="field-label">Destination</span>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City, country or property" className="field pl-9" list="destinations" />
          <datalist id="destinations">
            {["Nairobi", "Diani", "Mombasa", "Zanzibar", "Arusha", "Cape Town", "Marrakech", "Kigali", "Kenya", "Tanzania"].map((d) => <option key={d} value={d} />)}
          </datalist>
        </div>
      </label>
      <label className="block">
        <span className="field-label flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Check-in</span>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="field" />
      </label>
      <label className="block">
        <span className="field-label flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Check-out</span>
        <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="field" />
      </label>
      <div>
        <span className="field-label">Guests & rooms</span>
        <GuestPicker value={guests} onChange={setGuests} />
      </div>
      <button type="submit" className="btn-gold h-[42px] px-6">
        <Search className="h-4 w-4" /> Search
      </button>
    </form>
  );
}
