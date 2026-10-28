import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, Palette, PenLine, Send } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/TemplateCard";
import { FaqList } from "@/components/FaqList";
import { TEMPLATES, PLANS } from "@/lib/templates";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shubh Nimantran — Wedding Invitation Websites for Indian Weddings" },
      { name: "description", content: "Invite everyone you love with one link. Events, RSVP, countdown, gallery and directions — from ₹299, one-time." },
      { property: "og:title", content: "Shubh Nimantran — Wedding Invitation Websites" },
      { property: "og:description", content: "One WhatsApp link with your events, RSVP, countdown and photos. From ₹299." },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: Palette, title: "Pick a design", text: "Choose from royal, minimal, garden and regional styles." },
  { icon: PenLine, title: "Fill your details", text: "Names, events, venues and photos — with a live phone preview." },
  { icon: Send, title: "Publish & share", text: "Get your link and share it on WhatsApp. Edit anytime." },
];

const COMPARE = [
  ["Edit after sending", false, false, true],
  ["RSVP tracking", false, false, true],
  ["Maps & directions", false, false, true],
  ["Countdown & gallery", false, false, true],
  ["No printing or courier", false, true, true],
] as const;

function Home() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Digital shaadi nimantran</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] md:text-7xl">One link to invite everyone you love.</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">Mehendi to reception, every event, RSVP and direction — in a beautiful invitation website your guests open straight from WhatsApp.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/templates">Browse designs</Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/demo/$templateId" params={{ templateId: "royal" }}>See a live demo</Link></Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">From ₹299 · one-time · live for 6 months after your wedding</p>
        </div>
        <img src={hero} alt="A wedding invitation website on a phone among marigolds" width={1600} height={1104} className="rounded-3xl shadow-soft" />
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-4xl font-semibold">Ready in three steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-card p-6">
                <s.icon className="h-8 w-8 text-gold" />
                <p className="mt-4 text-xs text-muted-foreground">Step {i + 1}</p>
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-semibold">Designs couples love</h2>
          <Link to="/templates" className="text-sm font-semibold text-primary">View all →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.slice(0, 3).map((t) => <TemplateCard key={t.id} t={t} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-center text-4xl font-semibold">Simple, one-time pricing</h2>
        <p className="mt-2 text-center text-muted-foreground">Every plan has every feature. Price only depends on the design.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 text-center ${p.popular ? "border-gold bg-accent" : "bg-card"}`}>
              <p className="font-semibold">{p.name}</p>
              <p className="mt-2 font-display text-4xl text-primary">₹{p.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm"><Link to="/pricing" className="font-semibold text-primary">Full pricing & add-ons →</Link></p>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-center text-4xl font-semibold">Why a website?</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-4"></th><th className="p-4">Paper card</th><th className="p-4">PDF / image</th><th className="p-4 text-primary">Website</th></tr></thead>
            <tbody>
              {COMPARE.map(([label, ...vals]) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="p-4">{label}</td>
                  {vals.map((v, i) => <td key={i} className="p-4">{v ? <Check className="h-5 w-5 text-whatsapp" /> : <X className="h-5 w-5 text-muted-foreground" />}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="text-center text-4xl font-semibold">Questions</h2>
        <div className="mt-6"><FaqList limit={5} /></div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded-3xl bg-maroon-gradient p-10 text-center text-primary-foreground">
          <h2 className="text-4xl font-semibold">Start your invitation free</h2>
          <p className="mt-2 opacity-85">Build and preview everything before you pay.</p>
          <Button size="lg" variant="secondary" className="mt-6" asChild><Link to="/auth">Create my invitation</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
