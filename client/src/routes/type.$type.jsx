import { createFileRoute, notFound } from "@tanstack/react-router";
import ListingPage from "@/components/site/ListingPage";
import { useGetPropertiesQuery } from "@/store";
import { PROPERTY_TYPES } from "@/data/seed";

export const Route = createFileRoute("/type/$type")({
  loader: ({ params }) => {
    const meta = PROPERTY_TYPES.find((t) => t.slug === params.type);
    if (!meta) throw notFound();
    return meta;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.label} stays — Staywell` : "Stays — Staywell" },
      { name: "description", content: loaderData ? `${loaderData.blurb}. Browse ${loaderData.label.toLowerCase()} stays on Staywell.` : "Browse stays." },
      { property: "og:title", content: loaderData ? `${loaderData.label} stays — Staywell` : "Stays — Staywell" },
      { property: "og:description", content: loaderData?.blurb || "Browse stays." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TypePage,
});

function TypePage() {
  const meta = Route.useLoaderData();
  const { data = [], isLoading } = useGetPropertiesQuery();
  const items = data.filter((p) => p.status === "approved" && p.type === meta.slug);
  return (
    <ListingPage key={meta.slug} eyebrow="Property type" title={`${meta.label}s`} subtitle={meta.blurb} image={meta.image} items={items} loading={isLoading} lockedType={meta.slug} />
  );
}
