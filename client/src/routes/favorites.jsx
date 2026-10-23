import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import PropertyCard from "@/components/site/PropertyCard";
import { useGetPropertiesQuery } from "@/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your favourites — Staywell" },
      { name: "description", content: "Stays you've saved for later." },
      { property: "og:title", content: "Your favourites — Staywell" },
      { property: "og:description", content: "Stays you've saved for later." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const favs = useSelector((s) => s.ui.favorites);
  const { data = [] } = useGetPropertiesQuery();
  const items = data.filter((p) => favs.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="eyebrow">Saved</p>
      <h1 className="mt-1 text-4xl font-semibold">Your favourites</h1>
      {items.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="panel mt-8 p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Tap the heart on any stay to save it here.</p>
          <Link to="/search" className="btn-primary mt-5">Explore stays</Link>
        </div>
      )}
    </div>
  );
}
