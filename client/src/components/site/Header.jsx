import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Search, Menu, X, ChevronDown, Bell, Globe, LayoutDashboard, Building2, ShieldCheck, CalendarCheck, Compass } from "lucide-react";
import { PROPERTY_TYPES } from "@/data/seed";
import { selectUser, setRole } from "@/store";

function useOutside(ref, close) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && close();
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, close]);
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="bg-forest flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"><Compass className="h-5 w-5" /></span>
      <span className="font-display text-xl font-semibold tracking-tight">Staywell</span>
    </Link>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((s) => s.ui.role);
  const favCount = useSelector((s) => s.ui.favorites.length);
  const user = useSelector(selectUser);
  const [mobile, setMobile] = useState(false);
  const [types, setTypes] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const typesRef = useRef(null);
  const userRef = useRef(null);
  useOutside(typesRef, () => setTypes(false));
  useOutside(userRef, () => setUserMenu(false));

  const go = (e) => {
    e.preventDefault();
    setSearch(false);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="hidden bg-forest text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-1.5 text-xs">
          <p>Use code <b className="text-accent">WELCOME15</b> for 15% off your first stay</p>
          <div className="flex items-center gap-4 opacity-90">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> EN · USD</span>
            <Link to="/owner" className="hover:underline">List your property</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 text-sm font-medium lg:flex">
          <Link to="/search" className="rounded-full px-3 py-2 hover:bg-secondary" activeProps={{ className: "text-primary" }}>Stays</Link>
          <div ref={typesRef} className="relative">
            <button onClick={() => setTypes((t) => !t)} className="flex items-center gap-1 rounded-full px-3 py-2 hover:bg-secondary">
              Property types <ChevronDown className={`h-3.5 w-3.5 transition ${types ? "rotate-180" : ""}`} />
            </button>
            {types && (
              <div className="panel absolute left-0 top-full mt-2 grid w-[30rem] grid-cols-2 gap-1 p-2 shadow-lift">
                {PROPERTY_TYPES.map((t) => (
                  <Link key={t.slug} to="/type/$type" params={{ type: t.slug }} onClick={() => setTypes(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-secondary">
                    <img src={t.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div><p className="font-semibold">{t.label}</p><p className="text-xs text-muted-foreground">{t.blurb}</p></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/location/$place" params={{ place: "kenya" }} className="rounded-full px-3 py-2 hover:bg-secondary">Destinations</Link>
          <Link to="/" hash="deals" className="rounded-full px-3 py-2 hover:bg-secondary">Deals</Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button aria-label="Search" onClick={() => setSearch((s) => !s)} className="btn-icon"><Search className="h-5 w-5" /></button>
          <Link to="/favorites" aria-label="Favourites" className="btn-icon">
            <Heart className="h-5 w-5" />
            {favCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{favCount}</span>}
          </Link>
          <button aria-label="Notifications" className="btn-icon hidden sm:inline-flex"><Bell className="h-5 w-5" /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" /></button>
          <div ref={userRef} className="relative">
            <button aria-label="Account" onClick={() => setUserMenu((u) => !u)} className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-1 transition hover:shadow-soft sm:pr-3">
              <span className="bg-gold flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-accent-foreground">{user?.name.split(" ").map((n) => n[0]).join("")}</span>
              <span className="hidden text-sm font-semibold sm:inline">{user?.name.split(" ")[0]}</span>
            </button>
            {userMenu && (
              <div className="panel absolute right-0 mt-2 w-72 p-2 shadow-lift">
                <div className="px-3 py-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="mx-2 mb-2 rounded-xl bg-muted p-1">
                  <p className="px-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Demo: view as</p>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    {["guest", "owner", "admin"].map((r) => (
                      <button key={r} onClick={() => dispatch(setRole(r))} className={`rounded-lg py-1.5 text-xs font-semibold capitalize ${role === r ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>{r}</button>
                    ))}
                  </div>
                </div>
                {[
                  { to: "/dashboard", icon: CalendarCheck, label: "My bookings" },
                  { to: "/favorites", icon: Heart, label: "Favourites" },
                  { to: "/owner", icon: Building2, label: "Owner dashboard" },
                  { to: "/admin", icon: ShieldCheck, label: "Admin dashboard" },
                ].map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                    <l.icon className="h-4 w-4 text-primary" />{l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button aria-label="Menu" onClick={() => setMobile((m) => !m)} className="btn-icon lg:hidden">{mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {search && (
        <form onSubmit={go} className="border-t border-border bg-card">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city, country or property…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
            <button className="btn-primary py-2">Search</button>
          </div>
        </form>
      )}

      {mobile && (
        <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <Link to="/search" onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2 font-medium hover:bg-secondary">All stays</Link>
          <p className="px-3 pt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Property types</p>
          <div className="grid grid-cols-2">
            {PROPERTY_TYPES.map((t) => (
              <Link key={t.slug} to="/type/$type" params={{ type: t.slug }} onClick={() => setMobile(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">{t.label}</Link>
            ))}
          </div>
          <Link to="/dashboard" onClick={() => setMobile(false)} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 font-medium hover:bg-secondary"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
        </nav>
      )}
    </header>
  );
}
