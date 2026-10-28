import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Shubh Nimantran" },
      { name: "description", content: "Pick a design, fill your details with a live preview, publish and share your wedding invitation link." },
      { property: "og:title", content: "How it works — Shubh Nimantran" },
      { property: "og:description", content: "Your wedding invitation website in three simple steps." },
    ],
  }),
  component: How,
});

const STEPS = [
  ["Choose a design", "Browse designs for Hindu, Nikah, Anand Karaj, South Indian and modern weddings. Open any live demo to see exactly how guests will experience it."],
  ["Sign up & fill details", "Add your names, story, every event with venue and Maps link, and your photos. A phone preview updates as you type."],
  ["Publish your link", "Pick your link name (like /i/ananya-kabir) and publish. Share it on WhatsApp, Instagram or as a QR code."],
  ["Track RSVPs", "See who's coming to each event, read wishes, and download the guest list as a spreadsheet."],
  ["Edit anytime", "Venue changed? Update it and the same link shows the new details instantly."],
];

function How() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-5xl font-semibold">How it works</h1>
        <ol className="mt-10 space-y-6">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex gap-5 rounded-2xl border bg-card p-6">
              <span className="font-display text-5xl text-gold">{i + 1}</span>
              <div><h2 className="text-2xl font-semibold">{t}</h2><p className="mt-1 text-muted-foreground">{d}</p></div>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center"><Button size="lg" asChild><Link to="/auth">Start free</Link></Button></div>
      </div>
    </SiteLayout>
  );
}
