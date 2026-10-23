import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import PropertyCard, { CardSkeleton } from "./PropertyCard";
import { PROPERTY_TYPES } from "@/data/seed";

const uniq = (arr) => [...new Set(arr)].sort();
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, children }) {
  return (
    <div className="border-b border-border py-5 first:pt-0 last:border-0">
      <h4 className="mb-3 font-sans text-sm font-bold">{title}</h4>
      {children}
    </div>
  );
}
function Checks({ options, value, onChange, labels = {} }) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input type="checkbox" checked={value.includes(o)} onChange={() => onChange(toggle(value, o))} className="h-4 w-4 accent-[var(--primary)]" />
          {labels[o] || o}
        </label>
      ))}
    </div>
  );
}

/**
 * Filters are generated from the items in this category, so each page
 * (type / city / country / search) gets its own option set.
 */
export default function ListingPage({ title, eyebrow, subtitle, image, items, loading, lockedType }) {
  const prices = items.map((p) => p.price);
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const typeMeta = PROPERTY_TYPES.find((t) => t.slug === lockedType);

  const opts = useMemo(() => ({
    types: uniq(items.map((p) => p.type)),
    cities: uniq(items.map((p) => p.city)),
    amenities: uniq(items.flatMap((p) => p.amenities)),
    features: uniq(items.flatMap((p) => p.features || [])),
    bedrooms: uniq(items.map((p) => p.bedrooms)).map(Number).sort((a, b) => a - b),
  }), [items]);

  const empty = { price: null, types: [], cities: [], amenities: [], features: [], rating: 0, bedrooms: 0, sort: "recommended" };
  const [f, setF] = useState(empty);
  const [showFilters, setShowFilters] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const priceCap = f.price ?? maxPrice;

  const results = useMemo(() => {
    let r = items.filter((p) =>
      p.price <= priceCap &&
      (!f.types.length || f.types.includes(p.type)) &&
      (!f.cities.length || f.cities.includes(p.city)) &&
      f.amenities.every((a) => p.amenities.includes(a)) &&
      f.features.every((a) => (p.features || []).includes(a)) &&
      p.rating >= f.rating && p.bedrooms >= f.bedrooms);
    if (f.sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (f.sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [items, f, priceCap]);

  const typeLabels = Object.fromEntries(PROPERTY_TYPES.map((t) => [t.slug, t.label]));
  const activeCount = f.types.length + f.cities.length + f.amenities.length + f.features.length + (f.rating ? 1 : 0) + (f.bedrooms ? 1 : 0) + (f.price !== null ? 1 : 0);

  const filters = (
    <div>
      <Group title="Max price per night">
        <input type="range" min={0} max={maxPrice} step={5} value={priceCap} onChange={(e) => set("price")(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>$0</span><span className="font-bold text-foreground">${priceCap}</span></div>
      </Group>
      {typeMeta && opts.features.length > 0 && (
        <Group title={`${typeMeta.label} features`}>
          <Checks options={opts.features} value={f.features} onChange={set("features")} />
        </Group>
      )}
      {!lockedType && opts.types.length > 1 && (
        <Group title="Property type"><Checks options={opts.types} value={f.types} onChange={set("types")} labels={typeLabels} /></Group>
      )}
      {opts.cities.length > 1 && (
        <Group title="City"><Checks options={opts.cities} value={f.cities} onChange={set("cities")} /></Group>
      )}
      <Group title="Bedrooms">
        <div className="flex flex-wrap gap-2">
          {[0, ...opts.bedrooms].map((b) => (
            <button key={b} onClick={() => set("bedrooms")(b)} className={`chip ${f.bedrooms === b ? "chip-active" : ""}`}>{b === 0 ? "Any" : `${b}+`}</button>
          ))}
        </div>
      </Group>
      <Group title="Guest rating">
        <div className="flex flex-wrap gap-2">
          {[0, 4.5, 4.7, 4.8].map((r) => (
            <button key={r} onClick={() => set("rating")(r)} className={`chip ${f.rating === r ? "chip-active" : ""}`}>{r === 0 ? "Any" : `${r}+`}</button>
          ))}
        </div>
      </Group>
      <Group title="Amenities"><Checks options={opts.amenities} value={f.amenities} onChange={set("amenities")} /></Group>
      {activeCount > 0 && <button onClick={() => setF(empty)} className="btn-outline mt-2 w-full">Clear all filters</button>}
    </div>
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <div className={`absolute inset-0 ${image ? "bg-hero-overlay" : "bg-forest"}`} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-primary-foreground md:px-8 md:py-20">
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-xl opacity-90">{subtitle}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground"><b className="text-foreground">{results.length}</b> stays found</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(true)} className="btn-outline lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}</button>
            <select value={f.sort} onChange={(e) => set("sort")(e.target.value)} className="field w-auto py-2">
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="panel hidden h-fit p-5 lg:sticky lg:top-24 lg:block">{filters}</aside>
          {showFilters && (
            <div className="fixed inset-0 z-50 flex bg-foreground/40 lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="ml-auto h-full w-[85%] max-w-sm overflow-y-auto bg-card p-5" onClick={(e) => e.stopPropagation()}>
                <div className="mb-4 flex items-center justify-between"><h3 className="text-xl">Filters</h3><button onClick={() => setShowFilters(false)} className="btn-icon"><X className="h-5 w-5" /></button></div>
                {filters}
                <button onClick={() => setShowFilters(false)} className="btn-primary mt-4 w-full">Show {results.length} stays</button>
              </div>
            </div>
          )}
          <div>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
            ) : results.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
            ) : (
              <div className="panel p-12 text-center">
                <h3 className="text-2xl">No stays match</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try widening your filters.</p>
                <button onClick={() => setF(empty)} className="btn-primary mt-5">Reset filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
