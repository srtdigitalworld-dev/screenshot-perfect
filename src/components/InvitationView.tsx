import { useEffect, useState } from "react";
import { MapPin, Clock, Shirt, Music, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { InviteContent, Template } from "@/lib/templates";
import defaultCover from "@/assets/cover-couple.jpg";

type Mode = "live" | "demo" | "preview";

interface Props {
  content: InviteContent;
  template: Template;
  coverUrl?: string | undefined;
  galleryUrls?: string[] | undefined;
  mode: Mode;
  invitationId?: string | undefined;
  compact?: boolean | undefined;
}

function useCountdown(date: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!date || now === null) return null;
  const diff = Math.max(0, new Date(date + "T00:00:00").getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

const fmtDate = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Date to be announced";

export function InvitationView({ content, template, coverUrl, galleryUrls = [], mode, invitationId, compact }: Props) {
  const cd = useCountdown(content.weddingDate);
  const bride = content.bride || "Bride";
  const groom = content.groom || "Groom";
  const sec = compact ? "px-5 py-10" : "px-6 py-16 md:py-20";

  return (
    <div className={`${template.themeClass} bg-inv-bg text-inv-fg min-h-full`}>
      {/* Cover */}
      <section className="relative overflow-hidden">
        <img src={coverUrl || defaultCover} alt={`${bride} & ${groom}`} className={`w-full object-cover ${compact ? "h-[420px]" : "h-[85vh]"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-inv-bg via-inv-bg/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center">
          {content.hosts && <p className="text-xs uppercase tracking-[0.3em] text-inv-muted">{content.hosts}</p>}
          <h1 className={`mt-3 font-display ${compact ? "text-5xl" : "text-6xl md:text-8xl"} leading-none`}>
            {bride} <span className="text-inv-accent">&</span> {groom}
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase text-inv-muted">{fmtDate(content.weddingDate)}</p>
          {cd && (
            <div className="mt-6 flex justify-center gap-3">
              {(["d", "h", "m", "s"] as const).map((k) => (
                <div key={k} className="min-w-14 rounded-lg border border-inv-accent/40 bg-inv-card/70 px-3 py-2 backdrop-blur">
                  <div className="font-display text-2xl text-inv-accent">{cd[k]}</div>
                  <div className="text-[10px] uppercase tracking-widest text-inv-muted">{{ d: "Days", h: "Hours", m: "Mins", s: "Secs" }[k]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {content.story && (
        <section className={`${sec} mx-auto max-w-2xl text-center`}>
          <Heart className="mx-auto h-6 w-6 text-inv-accent" />
          <h2 className="mt-3 font-display text-4xl">Our Story</h2>
          <p className="mt-4 leading-relaxed text-inv-muted">{content.story}</p>
        </section>
      )}

      <section className={`${sec} mx-auto max-w-4xl`}>
        <h2 className="text-center font-display text-4xl">Celebrations</h2>
        <div className={`mt-8 grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
          {content.events.map((e) => (
            <article key={e.id} className="rounded-2xl border border-inv-accent/30 bg-inv-card p-6">
              <h3 className="font-display text-3xl text-inv-accent">{e.name || "Event"}</h3>
              <p className="mt-1 text-sm">{fmtDate(e.date)}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-inv-muted">
                {e.time && <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0" />{e.time}</li>}
                {e.venue && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{e.venue}</li>}
                {e.dressCode && <li className="flex gap-2"><Shirt className="h-4 w-4 shrink-0" />{e.dressCode}</li>}
              </ul>
              {e.mapUrl && (
                <a href={e.mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 rounded-full bg-inv-accent px-4 py-1.5 text-sm font-semibold text-inv-accent-fg">
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {galleryUrls.length > 0 && (
        <section className={`${sec} mx-auto max-w-5xl`}>
          <h2 className="text-center font-display text-4xl">Moments</h2>
          <div className="mt-8 columns-2 gap-3 md:columns-3">
            {galleryUrls.map((u) => (
              <img key={u} src={u} alt="" loading="lazy" className="mb-3 w-full rounded-xl" />
            ))}
          </div>
        </section>
      )}

      {content.musicUrl && (
        <section className="px-6 pb-6 text-center">
          <a href={content.musicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-inv-accent underline">
            <Music className="h-4 w-4" /> Play our song
          </a>
        </section>
      )}

      <RsvpForm content={content} mode={mode} invitationId={invitationId} sec={sec} />
      <Wishes mode={mode} invitationId={invitationId} sec={sec} />

      <footer className="px-6 py-14 text-center">
        <p className="mx-auto max-w-md font-display text-2xl">{content.thankYou}</p>
        <p className="mt-4 text-sm text-inv-muted">— {bride} & {groom}</p>
      </footer>
    </div>
  );
}

const field = "w-full rounded-lg border border-inv-accent/30 bg-inv-bg/60 px-3 py-2 text-inv-fg placeholder:text-inv-muted/70 focus:outline-none focus:ring-2 focus:ring-inv-accent";

function RsvpForm({ content, mode, invitationId, sec }: { content: InviteContent; mode: Mode; invitationId?: string | undefined; sec: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return void toast.error("Please enter your name");
    if (mode !== "live" || !invitationId) {
      setDone(true);
      toast.success(mode === "demo" ? "Demo RSVP — this is how guests will reply!" : "Preview only");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("rsvps").insert({
      invitation_id: invitationId,
      guest_name: name.trim().slice(0, 120),
      phone: phone.trim().slice(0, 30) || null,
      guest_count: Math.min(50, Math.max(1, count)),
      responses: answers,
      message: message.trim().slice(0, 1000) || null,
    });
    setBusy(false);
    if (error) return void toast.error("Could not send RSVP. Please try again.");
    setDone(true);
  }

  return (
    <section className={`${sec} mx-auto max-w-xl`}>
      <h2 className="text-center font-display text-4xl">Will you join us?</h2>
      {done ? (
        <p className="mt-6 rounded-2xl bg-inv-card p-6 text-center">Thank you, {name || "dear guest"}! Your reply has been received. 🙏</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-inv-card p-6">
          <input className={field} placeholder="Your name / family name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
          <div className="grid grid-cols-2 gap-3">
            <input className={field} placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
            <input className={field} type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} aria-label="Number of guests" />
          </div>
          <div className="space-y-2">
            {content.events.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between gap-3 rounded-lg border border-inv-accent/20 px-3 py-2">
                <span className="text-sm">{ev.name}</span>
                <div className="flex gap-1">
                  {(["yes", "no"] as const).map((v) => (
                    <button type="button" key={v} onClick={() => setAnswers((a) => ({ ...a, [ev.id]: v }))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${answers[ev.id] === v ? "bg-inv-accent text-inv-accent-fg" : "border border-inv-accent/40"}`}>
                      {v === "yes" ? "Attending" : "Can't come"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <textarea className={field} rows={3} placeholder="Message for the couple (optional)" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
          <button disabled={busy} className="w-full rounded-full bg-inv-accent py-3 font-semibold text-inv-accent-fg disabled:opacity-60">
            {busy ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </section>
  );
}

interface Wish { id: string; author: string; message: string }

function Wishes({ mode, invitationId, sec }: { mode: Mode; invitationId?: string | undefined; sec: string }) {
  const [wishes, setWishes] = useState<Wish[]>(
    mode === "live" ? [] : [
      { id: "1", author: "Riya Masi", message: "Bahut bahut badhai! Can't wait to dance at the Sangeet 💃" },
      { id: "2", author: "Arjun & Family", message: "Wishing you a lifetime of love and laughter." },
    ],
  );
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode !== "live" || !invitationId) return;
    supabase.from("wishes").select("id, author, message").eq("invitation_id", invitationId).order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => data && setWishes(data));
  }, [mode, invitationId]);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    const a = author.trim().slice(0, 80), m = message.trim().slice(0, 500);
    if (!a || !m) return void toast.error("Please add your name and a wish");
    if (mode === "live" && invitationId) {
      const { data, error } = await supabase.from("wishes").insert({ invitation_id: invitationId, author: a, message: m }).select("id, author, message").single();
      if (error || !data) return void toast.error("Could not post your wish");
      setWishes((w) => [data, ...w]);
    } else {
      setWishes((w) => [{ id: String(Date.now()), author: a, message: m }, ...w]);
    }
    setAuthor(""); setMessage("");
  }

  return (
    <section className={`${sec} mx-auto max-w-2xl`}>
      <h2 className="text-center font-display text-4xl">Shubhkamnayein</h2>
      <form onSubmit={post} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input className={`${field} sm:w-40`} placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={80} />
        <input className={field} placeholder="Write a blessing…" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
        <button className="rounded-full bg-inv-accent px-5 py-2 font-semibold text-inv-accent-fg">Post</button>
      </form>
      <div className="mt-6 space-y-3">
        {wishes.map((w) => (
          <div key={w.id} className="rounded-xl bg-inv-card p-4">
            <p className="text-sm">{w.message}</p>
            <p className="mt-1 text-xs text-inv-accent">— {w.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
