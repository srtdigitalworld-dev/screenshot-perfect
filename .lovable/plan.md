# Wedding Invitation Website — Full Version (with login)

## Step 0 — Bring in your existing app
The GitHub repo shows "Not Found" (it's private or the name is wrong). Before building, either:
- make the repo public, or
- download it (GitHub → Code → Download ZIP) and attach the ZIP here.

I'll keep your existing pages, designs and data, and move them onto this project. If the repo turns out to be empty, I'll build everything fresh from the blueprint. Drive photos and designs can be attached the same way.

## What you'll get
**Public site**
- Home: hero, 3 steps, featured templates, pricing, comparison table, FAQ
- Templates page with religion/style/price filters, plus a live demo page for each template
- Pricing (Starter ₹299, Classic ₹499, Premium ₹799, Luxury ₹1,499, Custom ₹4,999+, add-ons), Custom design request, FAQ, Contact
- WhatsApp button on every page

**Couple account** (email login)
- My Invitation editor: names, date, story, multiple events (Mehendi, Haldi, Sangeet, Wedding, Reception) with their own time/venue/Maps link, photo upload, music link
- Live phone preview while editing
- Switch templates without losing data or RSVPs
- Publish/unpublish at yoursite/couple-name
- RSVP dashboard: totals, per-event Yes/No counts, CSV download
- Share: copy link, WhatsApp message, QR code

**Guest invitation page** (/i/couple-name)
- Cover + countdown, story, event cards with Get Directions, gallery, per-event RSVP form, wishes wall
- Guest replies are visible only to the couple

**Starting templates:** 6 original designs (Royal Hindu, Minimal, Garden, Nikah, Anand Karaj, South Indian), all with the same features and different looks.

## Later (separate step)
Payments with a test mode first, before going live. Couples can preview for free and pay before they publish.

## Technical details
- Lovable Cloud for the database, login and photo storage
- Tables: invitations (owner, slug, template, content, published), events, rsvps (with per-event answers), wishes; row-level security makes each couple the owner, and anyone can read published invitations and add RSVPs or wishes
- Guest page is a public SSR route with per-invitation meta tags; the dashboard sits under the logged-in area
- Template definitions live in a shared typed module, and each template is one layout component reading the same data
