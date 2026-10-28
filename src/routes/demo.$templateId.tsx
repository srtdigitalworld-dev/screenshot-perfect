import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InvitationView } from "@/components/InvitationView";
import { Button } from "@/components/ui/button";
import { DEMO_CONTENT, TEMPLATES } from "@/lib/templates";
import decor from "@/assets/cover-decor.jpg";
import couple from "@/assets/cover-couple.jpg";

export const Route = createFileRoute("/demo/$templateId")({
  loader: ({ params }) => {
    const t = TEMPLATES.find((x) => x.id === params.templateId);
    if (!t) throw notFound();
    return { template: t };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.template.name ?? "Design"} live demo — Shubh Nimantran` },
      { name: "description", content: `See the ${loaderData?.template.name ?? ""} wedding invitation website with sample events, RSVP and wishes.` },
      { property: "og:title", content: `${loaderData?.template.name ?? "Design"} live demo` },
      { property: "og:description", content: "A full sample wedding invitation website you can try." },
    ],
  }),
  component: Demo,
});

function Demo() {
  const { template } = Route.useLoaderData();
  return (
    <div>
      <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <p className="text-sm"><span className="font-semibold">{template.name}</span> · ₹{template.price} · sample demo</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild><Link to="/templates">All designs</Link></Button>
          <Button size="sm" asChild><Link to="/auth">Use this design</Link></Button>
        </div>
      </div>
      <InvitationView content={DEMO_CONTENT} template={template} mode="demo" coverUrl={template.id === "minimal" || template.id === "south" ? decor : couple} galleryUrls={[couple, decor]} />
    </div>
  );
}
