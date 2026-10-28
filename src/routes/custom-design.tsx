import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { whatsappLink } from "@/lib/templates";

export const Route = createFileRoute("/custom-design")({
  head: () => ({
    meta: [
      { title: "Custom Wedding Invitation Design — Shubh Nimantran" },
      { name: "description", content: "A fully original wedding invitation website designed around your story. From ₹4,999." },
      { property: "og:title", content: "Custom Wedding Invitation Design" },
      { property: "og:description", content: "Your story, your theme — designed from scratch. From ₹4,999." },
    ],
  }),
  component: Custom,
});

function Custom() {
  const [f, setF] = useState({ names: "", date: "", theme: "", budget: "", story: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Custom design request\nNames: ${f.names}\nWedding date: ${f.date}\nTheme: ${f.theme}\nBudget: ${f.budget}\nStory: ${f.story}`;
    window.open(whatsappLink(msg), "_blank");
  };
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="text-5xl font-semibold">Custom design</h1>
        <p className="mt-2 text-muted-foreground">Tell us about your wedding. We'll reply on WhatsApp with ideas and a quote (from ₹4,999).</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border bg-card p-6">
          <div><Label>Couple names</Label><Input required value={f.names} onChange={set("names")} maxLength={100} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Wedding date</Label><Input type="date" value={f.date} onChange={set("date")} /></div>
            <div><Label>Budget</Label><Input placeholder="₹" value={f.budget} onChange={set("budget")} maxLength={30} /></div>
          </div>
          <div><Label>Theme / colours / references</Label><Input value={f.theme} onChange={set("theme")} maxLength={200} /></div>
          <div><Label>Your story</Label><Textarea rows={4} value={f.story} onChange={set("story")} maxLength={1000} /></div>
          <Button type="submit" className="w-full">Send on WhatsApp</Button>
        </form>
      </div>
    </SiteLayout>
  );
}
