import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Copy, Ticket, ShieldCheck, Headphones, BadgePercent } from "lucide-react";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import BookingSearch from "@/components/site/BookingSearch";
import PropertyCard, { CardSkeleton } from "@/components/site/PropertyCard";
import { useGetPropertiesQuery } from "@/store";
import { PROPERTY_TYPES } from "@/data/seed";
import { COUPONS, slugify } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Staywell — Handpicked stays & destinations across Africa" },
      { name: "description", content: "Search and book villas, apartments, bungalows and boutique hotels by city or country." },
      { property: "og:title", content: "Staywell — Handpicked stays across Africa" },
      { property: "og:description", content: "Search and book villas, apartments, bungalows and boutique hotels by city or country." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Home() {
  const { data = [], isLoading } = useGetPropertiesQuery();
  const live = data.filter((p) => p.status === "approved");
  const [groupBy, setGroupBy] = useState("city");

  const places = useMemo(() => {
    const map = new Map();
    live.forEach((p) => {
      const key = groupBy === "city" ? p.city : p.country;
      const cur = map.get(key) || { name: key, sub: groupBy === "city" ? p.country : "", count: 0, image: p.image, from: p.price };
      cur.count += 1; cur.from = Math.min(cur.from, p.price);
      map.set(key, cur);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [live, groupBy]);

  const featured = [...live].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      {/* Showcase */}
      <section className="relative">
        <img src={hero} alt="Villa infinity pool overlooking the sea at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-32">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Handpicked stays · Africa</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] text-primary-foreground md:text-6xl">
            Find a place that feels like <em className="font-normal text-accent">your</em> escape.
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/85">From Nairobi lofts to Zanzibar villas — book rooms for the whole family in minutes.</p>
          <div className="mt-10"><BookingSearch /></div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 md:px-8">
          {[[ShieldCheck, "Verified properties", "Every host is reviewed"], [BadgePercent, "Best price promise", "Exclusive member coupons"], [Headphones, "24/7 support", "Real people, any time"]].map(([I, t, d]) => (
            <div key={t} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary"><I className="h-5 w-5" /></span>
              <div><p className="text-sm font-bold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* By city / country */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <SectionHead eyebrow="Destinations" title="Explore by place"
          action={
            <div className="flex rounded-full border border-border bg-card p-1">
              {["city", "country"].map((g) => (
                <button key={g} onClick={() => setGroupBy(g)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${groupBy === g ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>By {g}</button>
              ))}
            </div>
          } />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />) : places.slice(0, 8).map((pl, i) => (
            <Link key={pl.name} to="/location/$place" params={{ place: slugify(pl.name) }}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 min-h-[22rem]" : "min-h-[10.5rem]"}`}>
              <img src={pl.image} alt={pl.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="bg-card-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <h3 className={`${i === 0 ? "text-3xl" : "text-xl"} font-semibold`}>{pl.name}</h3>
                <p className="text-xs opacity-90">{pl.sub && `${pl.sub} · `}{pl.count} stay{pl.count > 1 ? "s" : ""} · from ${pl.from}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* By type */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <SectionHead eyebrow="Property types" title="Stay your way" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PROPERTY_TYPES.map((t) => {
            const n = live.filter((p) => p.type === t.slug).length;
            return (
              <Link key={t.slug} to="/type/$type" params={{ type: t.slug }} className="group panel overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-square overflow-hidden"><img src={t.image} alt={t.label} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /></div>
                <div className="p-3">
                  <p className="font-display text-lg font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{n} propert{n === 1 ? "y" : "ies"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <SectionHead eyebrow="Guest favourites" title="Top-rated stays"
          action={<Link to="/search" className="btn-outline">View all <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />) : featured.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Coupons */}
      <section id="deals" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 md:px-8">
        <SectionHead eyebrow="Exclusive deals" title="Coupons for your next trip" />
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(COUPONS).map(([code, c], i) => (
            <div key={code} className={`relative overflow-hidden rounded-3xl p-8 ${i === 0 ? "bg-forest text-primary-foreground" : "bg-gold text-accent-foreground"}`}>
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-background/10" />
              <div className="absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-background/10" />
              <Ticket className="h-8 w-8 opacity-80" />
              <p className="mt-4 font-display text-6xl font-semibold">{c.percent}%<span className="text-2xl"> off</span></p>
              <p className="mt-1 text-lg font-semibold">{c.title}</p>
              <p className="text-sm opacity-80">{c.note}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-xl border-2 border-dashed border-current px-4 py-2 font-mono text-lg font-bold tracking-widest">{code}</span>
                <button onClick={() => { navigator.clipboard?.writeText(code); toast.success(`${code} copied`); }} className="flex items-center gap-1.5 rounded-full bg-background/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-background/30">
                  <Copy className="h-4 w-4" /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <div className="panel flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-3xl font-semibold">Own a property? Earn with Staywell.</h2>
            <p className="mt-2 text-muted-foreground">List your destination, set amenities and prices, and manage bookings from one dashboard.</p>
          </div>
          <Link to="/owner" className="btn-primary shrink-0">Start hosting <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
