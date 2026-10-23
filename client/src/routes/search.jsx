import { createFileRoute } from "@tanstack/react-router";
import ListingPage from "@/components/site/ListingPage";
import { useGetPropertiesQuery } from "@/store";
import { IMAGES } from "@/data/seed";

export const Route = createFileRoute("/search")({
  validateSearch: (s) => s,
  head: () => ({
    meta: [
      { title: "Search stays — Staywell" },
      { name: "description", content: "Browse and filter every Staywell property by price, type, city and amenities." },
      { property: "og:title", content: "Search stays — Staywell" },
      { property: "og:description", content: "Browse and filter every Staywell property." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const { data = [], isLoading } = useGetPropertiesQuery();
  const q = (s.q || "").toString().toLowerCase().trim();
  const kids = s.children ? String(s.children).split(",").filter(Boolean).length : 0;
  const guests = Number(s.adults || 1) + kids;
  const perRoomCap = Number(s.rooms || 1);
  const items = data.filter((p) =>
    p.status === "approved" &&
    (!q || [p.city, p.country, p.title, p.type].some((v) => v.toLowerCase().includes(q))) &&
    p.maxGuests * perRoomCap >= guests);

  return (
    <ListingPage
      eyebrow={s.adults ? `${s.adults} adults · ${kids} children · ${s.rooms || 1} room(s)` : "All destinations"}
      title={q ? `Stays matching “${s.q}”` : "All stays"}
      subtitle="Refine by price, type, city and amenities."
      image={IMAGES.resort}
      items={items}
      loading={isLoading}
    />
  );
}
