import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FaqList } from "@/components/FaqList";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shubh Nimantran" },
      { name: "description", content: "Answers about editing, RSVPs, events, live period and payments for wedding invitation websites." },
      { property: "og:title", content: "FAQ — Shubh Nimantran" },
      { property: "og:description", content: "Common questions about our wedding invitation websites." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-5xl font-semibold">Frequently asked questions</h1>
        <div className="mt-8"><FaqList /></div>
      </div>
    </SiteLayout>
  ),
});
