import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Star, BedDouble, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/store";
import { PROPERTY_TYPES } from "@/data/seed";

export default function PropertyCard({ p }) {
  const dispatch = useDispatch();
  const fav = useSelector((s) => s.ui.favorites.includes(p.id));
  const type = PROPERTY_TYPES.find((t) => t.slug === p.type);
  return (
    <article className="group panel overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to="/property/$id" params={{ id: p.id }}>
          <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground backdrop-blur">{type?.label}</span>
        <button aria-label={fav ? "Remove from favourites" : "Save to favourites"} onClick={() => dispatch(toggleFavorite(p.id))} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur transition hover:scale-110">
          <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>
      <Link to="/property/$id" params={{ id: p.id }} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
          {p.rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-bold"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{p.rating}</span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.city}, {p.country}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{p.bedrooms} bd</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.maxGuests}</span>
          </div>
          <p className="text-sm"><span className="text-lg font-bold text-primary">${p.price}</span><span className="text-muted-foreground"> /night</span></p>
        </div>
      </Link>
    </article>
  );
}

export function CardSkeleton() {
  return <div className="panel aspect-[4/5] animate-pulse bg-muted" />;
}
