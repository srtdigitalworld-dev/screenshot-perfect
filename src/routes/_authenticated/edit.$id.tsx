import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Copy, Download, MessageCircle, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InvitationView } from "@/components/InvitationView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getTemplate, newEventId, parseContent, slugify, TEMPLATES, type InviteContent, type InviteEvent } from "@/lib/templates";
import { uploadPhoto, usePhotoUrls } from "@/lib/photos";

export const Route = createFileRoute("/_authenticated/edit/$id")({
  head: () => ({ meta: [{ title: "Edit invitation — Shubh Nimantran" }, { name: "robots", content: "noindex" }] }),
  component: Editor,
});

const EVENT_PRESETS = ["Mehendi", "Haldi", "Sangeet", "Wedding", "Nikah", "Anand Karaj", "Reception"];

function Editor() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const [loaded, setLoaded] = useState(false);
  const [content, setContent] = useState<InviteContent | null>(null);
  const [templateId, setTemplateId] = useState("royal");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("invitations").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { toast.error("Invitation not found"); return; }
      setContent(parseContent(data.content));
      setTemplateId(data.template);
      setSlug(data.slug);
      setPublished(data.published);
      setLoaded(true);
    });
  }, [id]);

  const paths = content ? [...(content.coverPath ? [content.coverPath] : []), ...content.gallery] : [];
  const urls = usePhotoUrls(paths);

  if (!loaded || !content) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;

  const set = <K extends keyof InviteContent>(k: K, v: InviteContent[K]) => setContent({ ...content, [k]: v });
  const setEvent = (eid: string, patch: Partial<InviteEvent>) => set("events", content.events.map((e) => (e.id === eid ? { ...e, ...patch } : e)));
  const link = typeof window !== "undefined" ? `${window.location.origin}/i/${slug}` : `/i/${slug}`;

  async function save(nextPublished = published) {
    const clean = slugify(slug);
    if (!clean) return toast.error("Choose a link name");
    setSaving(true);
    const { error } = await supabase.from("invitations").update({ content: content as never, template: templateId, slug: clean, published: nextPublished }).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.code === "23505" ? "That link name is taken — try another" : error.message);
    setSlug(clean);
    setPublished(nextPublished);
    toast.success(nextPublished ? "Saved — your invitation is live" : "Saved");
  }

  async function onFiles(files: FileList | null, cover = false) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const added: string[] = [];
      for (const f of Array.from(files).slice(0, cover ? 1 : 12)) added.push(await uploadPhoto(user.id, f));
      if (cover) set("coverPath", added[0]);
      else set("gallery", [...content!.gallery, ...added].slice(0, 30));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`You're invited to the wedding of ${content.bride} & ${content.groom}! 💐\n${link}`)}`;

  function downloadQr() {
    const c = document.getElementById("invite-qr") as HTMLCanvasElement | null;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `${slug}-qr.png`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur">
        <Link to="/dashboard" className="flex items-center gap-1 text-sm"><ArrowLeft className="h-4 w-4" /> My invitations</Link>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm"><Switch checked={published} onCheckedChange={(v) => save(v)} /> {published ? "Live" : "Draft"}</label>
          <Button size="sm" onClick={() => save()} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Section title="Design">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => setTemplateId(t.id)} className={`${t.themeClass} rounded-xl border-2 bg-inv-bg p-3 text-left text-inv-fg ${templateId === t.id ? "border-gold" : "border-transparent"}`}>
                  <p className="font-display text-xl">{t.name}</p>
                  <p className="text-xs text-inv-muted">₹{t.price}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Couple">
            <div className="grid gap-3 sm:grid-cols-2">
              <F label="Bride"><Input value={content.bride} onChange={(e) => set("bride", e.target.value)} maxLength={60} /></F>
              <F label="Groom"><Input value={content.groom} onChange={(e) => set("groom", e.target.value)} maxLength={60} /></F>
              <F label="Wedding date"><Input type="date" value={content.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} /></F>
              <F label="Family line"><Input placeholder="With the blessings of…" value={content.hosts} onChange={(e) => set("hosts", e.target.value)} maxLength={140} /></F>
            </div>
            <F label="Our story"><Textarea rows={3} value={content.story} onChange={(e) => set("story", e.target.value)} maxLength={800} /></F>
            <F label="Thank-you note"><Input value={content.thankYou} onChange={(e) => set("thankYou", e.target.value)} maxLength={200} /></F>
            <F label="Song link (YouTube / Spotify, optional)"><Input value={content.musicUrl} onChange={(e) => set("musicUrl", e.target.value)} maxLength={300} /></F>
          </Section>

          <Section title="Events">
            {content.events.map((ev) => (
              <div key={ev.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex gap-2">
                  <Input list="event-presets" value={ev.name} onChange={(e) => setEvent(ev.id, { name: e.target.value })} placeholder="Event name" maxLength={40} />
                  <Button variant="ghost" size="icon" onClick={() => set("events", content.events.filter((x) => x.id !== ev.id))} aria-label="Remove event"><Trash2 /></Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="date" value={ev.date} onChange={(e) => setEvent(ev.id, { date: e.target.value })} />
                  <Input placeholder="Time, e.g. 7:00 PM" value={ev.time} onChange={(e) => setEvent(ev.id, { time: e.target.value })} maxLength={30} />
                  <Input placeholder="Venue" value={ev.venue} onChange={(e) => setEvent(ev.id, { venue: e.target.value })} maxLength={160} />
                  <Input placeholder="Google Maps link" value={ev.mapUrl} onChange={(e) => setEvent(ev.id, { mapUrl: e.target.value })} maxLength={400} />
                  <Input placeholder="Dress code (optional)" value={ev.dressCode} onChange={(e) => setEvent(ev.id, { dressCode: e.target.value })} maxLength={60} />
                </div>
              </div>
            ))}
            <datalist id="event-presets">{EVENT_PRESETS.map((p) => <option key={p} value={p} />)}</datalist>
            <Button variant="outline" onClick={() => set("events", [...content.events, { id: newEventId(), name: "", date: "", time: "", venue: "", mapUrl: "", dressCode: "" }])}><Plus /> Add event</Button>
          </Section>

          <Section title="Photos">
            <div className="flex flex-wrap gap-2">
              <input ref={coverRef} type="file" accept="image/*" hidden onChange={(e) => onFiles(e.target.files, true)} />
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
              <Button variant="outline" disabled={uploading} onClick={() => coverRef.current?.click()}><Upload /> Cover photo</Button>
              <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}><Upload /> Gallery photos</Button>
              {uploading && <span className="self-center text-sm text-muted-foreground">Uploading…</span>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {content.gallery.map((p) => (
                <div key={p} className="group relative">
                  {urls[p] && <img src={urls[p]} alt="" className="aspect-square w-full rounded-lg object-cover" />}
                  <button onClick={() => set("gallery", content.gallery.filter((x) => x !== p))} className="absolute right-1 top-1 rounded-full bg-background/90 p-1" aria-label="Remove photo"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Link & share">
            <F label="Link name">
              <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">/i/</span><Input value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={60} /></div>
            </F>
            {published ? (
              <div className="flex flex-wrap items-center gap-4">
                <QRCodeCanvas id="invite-qr" value={link} size={120} includeMargin />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}><Copy /> Copy link</Button>
                  <Button variant="outline" size="sm" asChild><a href={whatsappShare} target="_blank" rel="noreferrer"><MessageCircle /> Share on WhatsApp</a></Button>
                  <Button variant="outline" size="sm" onClick={downloadQr}><Download /> Download QR</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Turn on “Live” at the top to publish and get your share link.</p>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 text-center text-xs uppercase tracking-widest text-muted-foreground">Live phone preview</p>
          <div className="mx-auto h-[760px] w-[375px] max-w-full overflow-y-auto rounded-[2.5rem] border-8 border-foreground shadow-soft">
            <InvitationView compact content={content} template={getTemplate(templateId)} mode="preview" coverUrl={content.coverPath ? urls[content.coverPath] : undefined} galleryUrls={content.gallery.map((p) => urls[p]).filter(Boolean)} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-2xl border bg-card p-5"><h2 className="text-2xl font-semibold">{title}</h2>{children}</section>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
