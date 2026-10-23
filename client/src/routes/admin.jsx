import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LayoutGrid, Building2, CalendarCheck, Users, DollarSign, Clock, Check, X, Trash2 } from "lucide-react";
import DashboardShell, { StatusBadge, Stat } from "@/components/site/DashboardShell";
import { useGetPropertiesQuery, useGetBookingsQuery, useUpdatePropertyMutation, useDeletePropertyMutation, useUpdateBookingMutation } from "@/store";
import { USERS, PROPERTY_TYPES } from "@/data/seed";
import { money } from "@/lib/pricing";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Staywell" },
      { name: "description", content: "Approve listings, oversee bookings and manage users." },
      { property: "og:title", content: "Admin dashboard — Staywell" },
      { property: "og:description", content: "Platform administration for Staywell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const { data: props = [] } = useGetPropertiesQuery();
  const { data: bookings = [] } = useGetBookingsQuery();
  const [updateProp] = useUpdatePropertyMutation();
  const [del] = useDeletePropertyMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const revenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0);
  const pending = props.filter((p) => p.status === "pending");
  const byType = PROPERTY_TYPES.map((t) => ({ label: t.label, n: props.filter((p) => p.type === t.slug).length }));
  const maxN = Math.max(1, ...byType.map((t) => t.n));

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "users", label: "Users", icon: Users },
  ];

  const approveBtns = (p) => (
    <div className="flex justify-end gap-1">
      {p.status !== "approved" && <button aria-label="Approve" onClick={() => { updateProp({ id: p.id, status: "approved" }); toast.success("Listing approved"); }} className="btn-icon text-success"><Check className="h-4 w-4" /></button>}
      {p.status !== "rejected" && <button aria-label="Reject" onClick={() => updateProp({ id: p.id, status: "rejected" })} className="btn-icon"><X className="h-4 w-4" /></button>}
      <button aria-label="Delete" onClick={() => del(p.id)} className="btn-icon hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
    </div>
  );

  return (
    <DashboardShell title="Admin dashboard" role="admin" tabs={tabs} active={tab} onTab={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Properties" value={props.length} icon={Building2} />
            <Stat label="Bookings" value={bookings.length} icon={CalendarCheck} />
            <Stat label="Gross bookings" value={money(revenue)} icon={DollarSign} />
            <Stat label="Awaiting approval" value={pending.length} icon={Clock} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="panel p-6">
              <h3 className="text-xl font-semibold">Listings by type</h3>
              <div className="mt-5 space-y-3">
                {byType.map((t) => (
                  <div key={t.label} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 text-muted-foreground">{t.label}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="bg-forest h-full rounded-full" style={{ width: `${(t.n / maxN) * 100}%` }} /></div>
                    <span className="w-5 text-right font-bold">{t.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel p-6">
              <h3 className="text-xl font-semibold">Pending approvals</h3>
              <div className="mt-4 divide-y divide-border">
                {pending.length ? pending.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.title}</p><p className="text-xs text-muted-foreground">{p.city} · {money(p.price)}/night</p></div>
                    {approveBtns(p)}
                  </div>
                )) : <p className="py-6 text-sm text-muted-foreground">All caught up.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === "properties" && (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Property</th><th>Location</th><th>Owner</th><th>Price</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {props.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-semibold"><Link to="/property/$id" params={{ id: p.id }} className="hover:text-primary">{p.title}</Link></td>
                  <td className="text-muted-foreground">{p.city}, {p.country}</td>
                  <td>{USERS.find((u) => u.id === p.ownerId)?.name}</td>
                  <td>{money(p.price)}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="pr-4">{approveBtns(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "bookings" && (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Guest</th><th>Property</th><th>Dates</th><th>Party</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-semibold">{b.guestName}</td>
                  <td>{props.find((p) => p.id === b.propertyId)?.title || "—"}</td>
                  <td className="text-muted-foreground">{b.checkIn} → {b.checkOut}</td>
                  <td className="text-xs">{b.rooms}R · {b.adults}A · {b.children.length}C</td>
                  <td>{money(b.total)}</td>
                  <td>
                    <select value={b.status} onChange={(e) => updateBooking({ id: b.id, status: e.target.value })} className="field w-auto py-1 text-xs">
                      {["pending", "confirmed", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "users" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {USERS.map((u) => (
            <div key={u.id} className="panel flex items-center gap-4 p-5">
              <span className="bg-gold flex h-12 w-12 items-center justify-center rounded-full font-bold text-accent-foreground">{u.name.split(" ").map((n) => n[0]).join("")}</span>
              <div className="min-w-0 flex-1"><p className="font-semibold">{u.name}</p><p className="truncate text-xs text-muted-foreground">{u.email} · joined {u.joined}</p></div>
              <StatusBadge status={u.role === "admin" ? "approved" : u.role === "owner" ? "pending" : "completed"} />
              <span className="sr-only">{u.role}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
