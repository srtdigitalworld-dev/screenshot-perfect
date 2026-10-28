import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { InvitationView } from "@/components/InvitationView";
import { getPublishedInvitation } from "@/lib/invite.functions";
import { getTemplate, parseContent } from "@/lib/templates";
import { usePhotoUrls } from "@/lib/photos";

export const Route = createFileRoute("/i/$slug")({
  loader: async ({ params }) => {
    const inv = await getPublishedInvitation({ data: { slug: params.slug } });
    if (!inv) throw notFound();
    return inv;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Invitation unavailable" }, { name: "robots", content: "noindex" }] };
    const c = parseContent(loaderData.content);
    const title = `${c.bride} & ${c.groom} — Wedding Invitation`;
    const desc = `You're invited to celebrate the wedding of ${c.bride} & ${c.groom}. View events and RSVP.`;
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "website" }] };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-4xl font-semibold">This invitation isn't available</h1>
      <p className="text-muted-foreground">The link may be wrong or the couple hasn't published it yet.</p>
      <Link to="/" className="text-primary underline">Go home</Link>
    </div>
  ),
  component: Guest,
});

function Guest() {
  const inv = Route.useLoaderData();
  const content = parseContent(inv.content);
  const paths = [...(content.coverPath ? [content.coverPath] : []), ...content.gallery];
  const urls = usePhotoUrls(paths);
  return (
    <InvitationView
      content={content}
      template={getTemplate(inv.template)}
      mode="live"
      invitationId={inv.id}
      coverUrl={content.coverPath ? urls[content.coverPath] : undefined}
      galleryUrls={content.gallery.map((p) => urls[p]).filter(Boolean)}
    />
  );
}
