import { Link } from "@tanstack/react-router";
import type { Template } from "@/lib/templates";

export function TemplateCard({ t }: { t: Template }) {
  return (
    <Link to="/demo/$templateId" params={{ templateId: t.id }} className="group block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-soft">
      <div className={`${t.themeClass} flex aspect-[4/5] flex-col items-center justify-center bg-inv-bg p-6 text-center text-inv-fg`}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-inv-muted">Together with their families</p>
        <p className="mt-4 font-display text-5xl">Ananya</p>
        <p className="font-display text-3xl text-inv-accent">&</p>
        <p className="font-display text-5xl">Kabir</p>
        <div className="mt-6 h-px w-20 bg-inv-accent" />
        <p className="mt-4 text-xs uppercase tracking-widest text-inv-muted">14 February 2027</p>
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-display text-2xl font-semibold">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.tagline}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t.religion} · {t.style}</p>
        </div>
        <p className="font-display text-2xl text-primary">₹{t.price}</p>
      </div>
    </Link>
  );
}
