import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Compass } from "lucide-react";
import { PROPERTY_TYPES } from "@/data/seed";

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="bg-gold flex h-9 w-9 items-center justify-center rounded-xl text-accent-foreground"><Compass className="h-5 w-5" /></span>
              <span className="font-display text-2xl font-semibold">Staywell</span>
            </div>
            <p className="mt-4 max-w-sm text-sm opacity-80">Handpicked stays across Africa — from city lofts to beachfront villas. Book with confidence, travel with ease.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-sm gap-2">
              <input placeholder="Your email for travel deals" className="flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-sm outline-none placeholder:text-primary-foreground/60" />
              <button className="btn-gold">Subscribe</button>
            </form>
          </div>
          <div>
            <h4 className="text-lg">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              {PROPERTY_TYPES.slice(0, 5).map((t) => <li key={t.slug}><Link to="/type/$type" params={{ type: t.slug }} className="hover:opacity-100 hover:underline">{t.label}s</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-lg">Company</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li><Link to="/owner" className="hover:underline">List your property</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Manage bookings</Link></li>
              <li><Link to="/favorites" className="hover:underline">Saved stays</Link></li>
              <li><Link to="/search" className="hover:underline">All destinations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm opacity-80">
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> Westlands, Nairobi, Kenya</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> +254 700 000 000</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> hello@staywell.travel</li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[Facebook, Instagram, Twitter].map((I, i) => (
                <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"><I className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs opacity-70 md:flex-row md:justify-between">
          <p>© 2026 Staywell Travel Ltd. All rights reserved.</p>
          <div className="flex gap-5"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a><a href="#">Help centre</a></div>
        </div>
      </div>
    </footer>
  );
}
