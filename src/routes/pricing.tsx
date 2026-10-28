import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ADDONS, PLANS } from "@/lib/templates";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Shubh Nimantran Wedding Websites" },
      { name: "description", content: "One-time pricing from ₹299. Custom designs from ₹4,999. No subscription." },
      { property: "og:title", content: "Pricing — Shubh Nimantran" },
      { property: "og:description", content: "Wedding invitation websites from ₹299, one-time." },
    ],
  }),
  component: Pricing,
});

const FEATURES = ["Your own link to share", "Unlimited events (Mehendi to Reception)", "Per-event RSVP + CSV download", "Live countdown & photo gallery", "Google Maps directions", "Wishes wall", "Edit anytime, same link", "Live until 6 months after the wedding"];

function Pricing() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="text-center text-5xl font-semibold">Pricing</h1>
        <p className="mt-2 text-center text-muted-foreground">One-time payment. No subscription. Preview free before you pay.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${p.popular ? "border-gold bg-accent" : "bg-card"}`}>
              {p.popular && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Most popular</p>}
              <p className="text-lg font-semibold">{p.name}</p>
              <p className="mt-1 font-display text-5xl text-primary">₹{p.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-3xl font-semibold">Every plan includes</h2>
            <ul className="mt-4 space-y-2">{FEATURES.map((f) => <li key={f} className="flex gap-2 text-sm"><Check className="h-5 w-5 text-gold" />{f}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-maroon-gradient p-6 text-primary-foreground">
            <h2 className="text-3xl font-semibold">Custom design</h2>
            <p className="mt-1 font-display text-4xl">₹4,999+</p>
            <p className="mt-2 opacity-85">A fully original invitation designed around your story, theme and colours.</p>
            <Button variant="secondary" className="mt-6" asChild><Link to="/custom-design">Request custom design</Link></Button>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-3xl font-semibold">Add-ons</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ADDONS.map((a) => <div key={a.name} className="flex justify-between rounded-lg bg-secondary/60 px-4 py-3 text-sm"><span>{a.name}</span><span className="font-semibold">₹{a.price}</span></div>)}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
