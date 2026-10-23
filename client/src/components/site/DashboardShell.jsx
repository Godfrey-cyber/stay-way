import { useDispatch, useSelector } from "react-redux";
import { setRole, selectUser } from "@/store";

export function StatusBadge({ status }) {
  const map = {
    confirmed: "bg-success/15 text-success", approved: "bg-success/15 text-success", completed: "bg-secondary text-secondary-foreground",
    pending: "bg-accent/25 text-accent-foreground", cancelled: "bg-destructive/10 text-destructive", rejected: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${map[status] || "bg-muted"}`}>{status}</span>;
}

export function Stat({ label, value, icon: Icon }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-4 w-4" /></span>}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

export default function DashboardShell({ title, role, tabs, active, onTab, children }) {
  const dispatch = useDispatch();
  const current = useSelector((s) => s.ui.role);
  const user = useSelector(selectUser);

  if (role && current !== role) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">This area is for the <b className="capitalize">{role}</b> account. In this demo you can switch views instantly.</p>
        <button onClick={() => dispatch(setRole(role))} className="btn-primary mt-6 capitalize">Continue as {role}</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8">
        <p className="eyebrow">Welcome back, {user?.name.split(" ")[0]}</p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{title}</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => onTab(t.id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition lg:w-full ${active === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
