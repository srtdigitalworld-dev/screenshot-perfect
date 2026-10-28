import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/templates";

export const BRAND = "Shubh Nimantran";

const NAV = [
  { to: "/templates", label: "Templates" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/custom-design", label: "Custom design" },
  { to: "/faq", label: "FAQ" },
] as const;

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

export function WhatsAppButton() {
  return (
    <a href={whatsappLink("Hi! I'd like to know more about wedding invitation websites.")} target="_blank" rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-soft transition-transform hover:scale-105">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="font-display text-2xl font-semibold text-primary">{BRAND}</Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-sm text-primary font-semibold" }}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {session ? (
              <Button size="sm" onClick={() => navigate({ to: "/dashboard" })}>My invitations</Button>
            ) : (
              <Button size="sm" onClick={() => navigate({ to: "/auth" })}>Sign in</Button>
            )}
            <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-3 border-t px-5 py-4 md:hidden">
            {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>)}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-20 bg-maroon-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">{BRAND}</p>
            <p className="mt-2 text-sm opacity-80">Beautiful wedding invitation websites, shared in one WhatsApp link.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-90">
            {NAV.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
            <Link to="/contact">Contact</Link>
          </div>
          <p className="text-sm opacity-80">Secure payments · Made in India with love<br />© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
}
