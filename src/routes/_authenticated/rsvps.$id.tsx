import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { parseContent, rsvpCsv, rsvpStats, type RsvpRow } from "@/lib/templates";

export const Route = createFileRoute("/_authenticated/rsvps/$id")({
  head: () => ({ meta: [{ title: "RSVPs — Shubh Nimantran" }, { name: "robots", content: "noindex" }] }),
  component: Rsvps,
});

function Rsvps() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["rsvps", id],
    queryFn: async () => {
      const [inv, rs] = await Promise.all([
        supabase.from("invitations").select("slug, content").eq("id", id).single(),
        supabase.from("rsvps").select("guest_name, phone, guest_count, responses, message, created_at").eq("invitation_id", id).order("created_at", { ascending: false }),
      ]);
      if (inv.error) throw inv.error;
      return { content: parseContent(inv.data.content), rsvps: (rs.data ?? []) as unknown as RsvpRow[] };
    },
  });

  if (isLoading || !data) return <SiteLayout><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteLayout>;
  const { content, rsvps } = data;
  const stats = rsvpStats(rsvps, content.events);

  function download() {
    const blob = new Blob(["\ufeff" + rsvpCsv(rsvps, content.events)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rsvps.csv";
    a.click();
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link to="/dashboard" className="flex items-center gap-1 text-sm"><ArrowLeft className="h-4 w-4" /> My invitations</Link>
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-4xl font-semibold">RSVPs · {content.bride} & {content.groom}</h1>
          <Button variant="outline" onClick={download} disabled={!rsvps.length}><Download /> CSV</Button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total replies" value={stats.total} />
          {stats.perEvent.map((e) => <Stat key={e.id} label={e.name} value={`${e.guests} guests`} sub={`${e.yes} yes · ${e.no} no`} />)}
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-3">Name</th><th className="p-3">Guests</th>{content.events.map((e) => <th key={e.id} className="p-3">{e.name}</th>)}<th className="p-3">Message</th><th className="p-3"></th></tr></thead>
            <tbody>
              {rsvps.length === 0 && <tr><td colSpan={99} className="p-6 text-center text-muted-foreground">No replies yet. Share your link to start receiving RSVPs.</td></tr>}
              {rsvps.map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-3 font-semibold">{r.guest_name}<div className="text-xs font-normal text-muted-foreground">{r.phone}</div></td>
                  <td className="p-3">{r.guest_count}</td>
                  {content.events.map((e) => <td key={e.id} className="p-3">{r.responses?.[e.id] === "yes" ? "✓" : r.responses?.[e.id] === "no" ? "✗" : "—"}</td>)}
                  <td className="max-w-xs p-3 text-muted-foreground">{r.message}</td>
                  <td className="p-3">{r.phone && <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="h-4 w-4 text-whatsapp" /></a>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SiteLayout>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return <div className="rounded-2xl border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="font-display text-3xl text-primary">{value}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>;
}
