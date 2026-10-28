import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQS = [
  ["Can I edit after sharing the link?", "Yes. Change dates, venues or photos anytime — the same link updates instantly."],
  ["How long does my invitation stay live?", "Until 6 months after your wedding date. You can extend it with an add-on."],
  ["Can I add Mehendi, Haldi, Sangeet and Reception?", "Yes — add as many events as you like, each with its own date, time, venue, dress code and directions."],
  ["Can guests RSVP separately for each event?", "Yes. Guests choose attending or not for each event, and you see counts per event in your dashboard."],
  ["Do guests need an app?", "No. The link opens directly in WhatsApp or any phone browser."],
  ["Can I switch designs later?", "Yes, switch to any design in the same tier without losing your details or RSVPs."],
  ["Is it a subscription?", "No. It's a one-time payment."],
  ["Who can see the RSVPs?", "Only you. Guest replies are private to the couple's dashboard."],
] as const;

export function FaqList({ limit }: { limit?: number }) {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
      {FAQS.slice(0, limit).map(([q, a]) => (
        <AccordionItem key={q} value={q}>
          <AccordionTrigger className="text-left">{q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
