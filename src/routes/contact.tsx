import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/templates";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shubh Nimantran" },
      { name: "description", content: "Chat with us on WhatsApp about your wedding invitation website." },
      { property: "og:title", content: "Contact — Shubh Nimantran" },
      { property: "og:description", content: "We reply fast on WhatsApp." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <h1 className="text-5xl font-semibold">Talk to us</h1>
        <p className="mt-3 text-muted-foreground">Questions about designs, custom work or planner partnerships? We usually reply within a few hours.</p>
        <Button size="lg" className="mt-8" asChild>
          <a href={whatsappLink("Hi! I have a question about wedding invitation websites.")} target="_blank" rel="noreferrer"><MessageCircle /> Chat on WhatsApp</a>
        </Button>
      </div>
    </SiteLayout>
  ),
});
