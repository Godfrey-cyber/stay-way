import { createFileRoute } from "@tanstack/react-router";
import ListingPage from "@/components/site/ListingPage";
import { useGetPropertiesQuery } from "@/store";
import { slugify } from "@/lib/pricing";

const nice = (slug) => slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");

export const Route = createFileRoute("/location/$place")({
  head: ({ params }) => ({
    meta: [
      { title: `Stays in ${nice(params.place)} — Staywell` },
      { name: "description", content: `Handpicked apartments, villas and hotels in ${nice(params.place)}.` },
      { property: "og:title", content: `Stays in ${nice(params.place)} — Staywell` },
      { property: "og:description", content: `Handpicked stays in ${nice(params.place)}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { place } = Route.useParams();
  const { data = [], isLoading } = useGetPropertiesQuery();
  const items = data.filter((p) => p.status === "approved" && (slugify(p.city) === place || slugify(p.country) === place));
  const isCountry = items.some((p) => slugify(p.country) === place);
  const name = items[0] ? (isCountry ? items[0].country : items[0].city) : nice(place);
  return (
    <ListingPage key={place} eyebrow={isCountry ? "Country" : "City"} title={`Stays in ${name}`}
      subtitle={isCountry ? `Discover ${new Set(items.map((p) => p.city)).size} cities across ${name}.` : `Your guide to the best places to stay in ${name}.`}
      image={items[0]?.image} items={items} loading={isLoading} />
  );
}
