import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CalendarCheck, History, XCircle, User, Heart, Wallet, CalendarDays } from "lucide-react";
import DashboardShell, { StatusBadge, Stat } from "@/components/site/DashboardShell";
import { useGetBookingsQuery, useGetPropertiesQuery, useUpdateBookingMutation, selectUser } from "@/store";
import { money } from "@/lib/pricing";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My bookings — Staywell" },
      { name: "description", content: "View, manage and cancel your Staywell bookings." },
      { property: "og:title", content: "My bookings — Staywell" },
      { property: "og:description", content: "Manage your Staywell bookings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuestDashboard,
});

const today = () => new Date().toISOString().slice(0, 10);

export function BookingRow({ b, p, actions }) {
  return (
    <div className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <img src={p?.image} alt="" className="h-24 w-full rounded-xl object-cover sm:w-32" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-semibold">{p?.title || "Removed property"}</h3>
          <StatusBadge status={b.status} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{b.checkIn} → {b.checkOut}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {b.rooms} room(s) · {b.adults} adult(s){b.children.length > 0 && ` · ${b.children.length} child(ren), ages ${b.children.join(", ")}`}
          {b.guestName && ` · ${b.guestName}`}
        </p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <p className="font-display text-xl font-semibold">{money(b.total)}</p>
        <div className="flex gap-2">{actions}</div>
      </div>
    </div>
  );
}

function GuestDashboard() {
  const user = useSelector(selectUser);
  const favCount = useSelector((s) => s.ui.favorites.length);
  const [tab, setTab] = useState("upcoming");
  const { data: bookings = [], isLoading } = useGetBookingsQuery();
  const { data: props = [] } = useGetPropertiesQuery();
  const [update] = useUpdateBookingMutation();

  const mine = bookings.filter((b) => b.userId === user?.id);
  const lists = {
    upcoming: mine.filter((b) => b.checkOut >= today() && !["cancelled", "completed"].includes(b.status)),
    past: mine.filter((b) => b.status === "completed" || (b.checkOut < today() && b.status !== "cancelled")),
    cancelled: mine.filter((b) => b.status === "cancelled"),
  };
  const spent = mine.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0);

  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: CalendarCheck },
    { id: "past", label: "Past stays", icon: History },
    { id: "cancelled", label: "Cancelled", icon: XCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <DashboardShell title="My bookings" role="guest" tabs={tabs} active={tab} onTab={setTab}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Upcoming trips" value={lists.upcoming.length} icon={CalendarCheck} />
        <Stat label="Total spent" value={money(spent)} icon={Wallet} />
        <Link to="/favorites"><Stat label="Saved stays" value={favCount} icon={Heart} /></Link>
      </div>
      {tab === "profile" ? (
        <div className="panel max-w-lg space-y-4 p-6">
          <label className="block"><span className="field-label">Full name</span><input defaultValue={user?.name} className="field" /></label>
          <label className="block"><span className="field-label">Email</span><input defaultValue={user?.email} className="field" /></label>
          <label className="block"><span className="field-label">Phone</span><input placeholder="+254…" className="field" /></label>
          <button onClick={() => toast.success("Profile saved")} className="btn-primary">Save changes</button>
        </div>
      ) : isLoading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      ) : lists[tab].length ? (
        <div className="space-y-4">
          {lists[tab].map((b) => (
            <BookingRow key={b.id} b={b} p={props.find((p) => p.id === b.propertyId)} actions={
              tab === "upcoming" && (
                <>
                  <Link to="/property/$id" params={{ id: b.propertyId }} className="btn-outline py-1.5">View</Link>
                  <button onClick={() => { update({ id: b.id, status: "cancelled" }); toast("Booking cancelled"); }} className="btn-outline py-1.5 hover:border-destructive hover:text-destructive">Cancel</button>
                </>
              )
            } />
          ))}
        </div>
      ) : (
        <div className="panel p-10 text-center text-muted-foreground">
          Nothing here yet. <Link to="/search" className="font-semibold text-primary underline">Find your next stay</Link>
        </div>
      )}
    </DashboardShell>
  );
}
