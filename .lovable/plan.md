# Wedding Invitation Website Business — Phase 1 (Marketing site + live demos)

Original brand (placeholder name "Shubh Nimantran", easy to change later). No SaveOurDate design, wording or photos copied.

## What gets built
1. **Home** (/) — hero, 3-step how it works, featured templates, pricing preview, Paper vs PDF vs Website comparison, FAQ, WhatsApp button.
2. **Templates** (/templates) — 6 original templates with filters by religion/style and sort by price.
3. **Live demo invitation** (/demo/$slug) — full guest view with sample couple: cover + countdown, story, multi-event schedule (Mehendi, Haldi, Sangeet, Wedding, Reception) with Get Directions, gallery, per-event RSVP form (demo only, shows thank-you), wishes wall.
4. **Pricing** (/pricing) — Starter ₹299, Classic ₹499, Premium ₹799, Luxury ₹1,499, Custom ₹4,999+, plus add-ons. 3–6 month live period highlighted.
5. **How it works** (/how-it-works), **Custom design** form (/custom-design, opens WhatsApp with filled message), **FAQ / Contact** (/faq, /contact).
6. Floating WhatsApp button on every page (placeholder number until you share yours).

## Design
Warm Indian-wedding look: ivory background, deep maroon + marigold gold accents, elegant serif headings (Cormorant) with clean body font. Each template gets its own colour palette. Generated original images for covers.

## Next phase (later, needs Lovable Cloud + payments)
Couple login, editor with live preview, publish link /couple-name, real RSVP dashboard + CSV, Razorpay/payment, QR share.

## Technical details
- TanStack routes per page; template data in a shared typed module.
- Demo RSVP/wishes stored in local state only (no backend yet).
- Per-route head() metadata.
