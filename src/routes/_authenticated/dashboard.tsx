import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emptyContent, getTemplate, parseContent, slugify, TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My invitations — Shubh Nimantran" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [template, setTemplate] = useState("royal");
  const [busy, setBusy] = useState(false);

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["my-invitations", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitations").select("id, slug, template, content, published, updated_at").eq("owner_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!bride.trim() || !groom.trim()) return void toast.error("Enter both names");
    setBusy(true);
    const base = slugify(`${bride}-${groom}`) || "our-wedding";
    const content = { ...emptyContent(), bride: bride.trim(), groom: groom.trim() };
    let slug = base;
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase.from("invitations").insert({ owner_id: user.id, slug, template, content: content as never }).select("id").single();
      if (!error && data) { setBusy(false); navigate({ to: "/edit/$id", params: { id: data.id } }); return; }
      if (error?.code !== "23505") { setBusy(false); return void toast.error(error?.message ?? "Could not create"); }
      slug = `${base}-${Math.floor(Math.random() * 900 + 100)}`;
    }
    setBusy(false);
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">My invitations</h1>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut /> Sign out</Button>
        </div>

        <form onSubmit={create} className="mt-6 grid gap-3 rounded-2xl border bg-card p-5 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Input placeholder="Bride's name" value={bride} onChange={(e) => setBride(e.target.value)} maxLength={60} />
          <Input placeholder="Groom's name" value={groom} onChange={(e) => setGroom(e.target.value)} maxLength={60} />
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name} (₹{t.price})</option>)}
          </select>
          <Button disabled={busy}><Plus /> Create</Button>
        </form>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoading && <p className="text-muted-foreground">Loading…</p>}
          {!isLoading && invites.length === 0 && <p className="text-muted-foreground">No invitations yet — create your first one above.</p>}
          {invites.map((inv) => {
            const c = parseContent(inv.content);
            const t = getTemplate(inv.template);
            return (
              <div key={inv.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-3xl">{c.bride} & {c.groom}</p>
                    <p className="text-sm text-muted-foreground">{t.name} · /i/{inv.slug}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inv.published ? "bg-whatsapp/15 text-whatsapp" : "bg-muted text-muted-foreground"}`}>{inv.published ? "Live" : "Draft"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" asChild><Link to="/edit/$id" params={{ id: inv.id }}>Edit</Link></Button>
                  <Button size="sm" variant="outline" asChild><Link to="/rsvps/$id" params={{ id: inv.id }}>RSVPs</Link></Button>
                  {inv.published && <Button size="sm" variant="ghost" asChild><Link to="/i/$slug" params={{ slug: inv.slug }} target="_blank">Open</Link></Button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}
