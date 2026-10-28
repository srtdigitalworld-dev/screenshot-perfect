import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { TemplateCard } from "@/components/TemplateCard";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Wedding Invitation Designs — Shubh Nimantran" },
      { name: "description", content: "Hindu, Nikah, Anand Karaj, South Indian, royal, garden and minimal wedding invitation website designs." },
      { property: "og:title", content: "Wedding Invitation Designs — Shubh Nimantran" },
      { property: "og:description", content: "Browse original invitation website designs for every Indian celebration." },
    ],
  }),
  component: Templates,
});

const RELIGIONS = ["All", "Hindu", "Muslim", "Sikh", "South Indian", "Modern"];
const STYLES = ["All", "Royal", "Minimal", "Garden", "Traditional"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button onClick={onClick} className={`rounded-full border px-4 py-1.5 text-sm ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{children}</button>;
}

function Templates() {
  const [rel, setRel] = useState("All");
  const [style, setStyle] = useState("All");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const list = useMemo(
    () => TEMPLATES.filter((t) => (rel === "All" || t.religion === rel) && (style === "All" || t.style === style))
      .sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price)),
    [rel, style, sort],
  );
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="text-5xl font-semibold">Designs</h1>
        <p className="mt-2 text-muted-foreground">Every design includes every feature. Tap one to see a live demo.</p>
        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap gap-2">{RELIGIONS.map((r) => <Chip key={r} active={rel === r} onClick={() => setRel(r)}>{r}</Chip>)}</div>
          <div className="flex flex-wrap items-center gap-2">
            {STYLES.map((s) => <Chip key={s} active={style === s} onClick={() => setStyle(s)}>{s}</Chip>)}
            <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")} className="ml-auto rounded-full border bg-card px-4 py-1.5 text-sm">
              <option value="asc">Price: low to high</option>
              <option value="desc">Price: high to low</option>
            </select>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <TemplateCard key={t.id} t={t} />)}
        </div>
        {list.length === 0 && <p className="mt-10 text-center text-muted-foreground">No designs match these filters yet.</p>}
      </div>
    </SiteLayout>
  );
}
