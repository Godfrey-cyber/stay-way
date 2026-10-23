import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";

function Counter({ label, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="btn-icon h-8 w-8 border border-border disabled:opacity-30">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold">{value}</span>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="btn-icon h-8 w-8 border border-border disabled:opacity-30">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/** value: { rooms, adults, children: number|"" [] } */
export default function GuestPicker({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const setChildren = (n) => {
    const kids = [...value.children];
    while (kids.length < n) kids.push("");
    kids.length = n;
    onChange({ ...value, children: kids });
  };
  const missingAge = value.children.some((a) => a === "");
  const summary = `${value.adults} adult${value.adults > 1 ? "s" : ""} · ${value.children.length} child${value.children.length === 1 ? "" : "ren"} · ${value.rooms} room${value.rooms > 1 ? "s" : ""}`;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="field flex items-center gap-2 text-left">
        <Users className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate">{summary}</span>
        {missingAge && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-destructive" />}
      </button>
      {open && (
        <div className="panel absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] p-4 shadow-lift">
          <Counter label="Rooms" value={value.rooms} min={1} max={8} onChange={(rooms) => onChange({ ...value, rooms })} />
          <Counter label="Adults" hint="Ages 18+" value={value.adults} min={1} max={16} onChange={(adults) => onChange({ ...value, adults })} />
          <Counter label="Children" hint="Ages 0–17" value={value.children.length} min={0} max={8} onChange={setChildren} />
          {value.children.length > 0 && (
            <div className="mt-2 rounded-xl bg-muted p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Age of each child at check-in</p>
              <div className="grid grid-cols-2 gap-2">
                {value.children.map((age, i) => (
                  <select key={i} aria-label={`Child ${i + 1} age`} value={age} onChange={(e) => {
                    const kids = [...value.children]; kids[i] = e.target.value === "" ? "" : Number(e.target.value);
                    onChange({ ...value, children: kids });
                  }} className={`field py-2 ${age === "" ? "border-destructive" : ""}`}>
                    <option value="">Child {i + 1} age</option>
                    {Array.from({ length: 18 }, (_, a) => <option key={a} value={a}>{a === 0 ? "Under 1" : `${a} yrs`}</option>)}
                  </select>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">Done</button>
        </div>
      )}
    </div>
  );
}
