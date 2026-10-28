export type Religion = "Hindu" | "Muslim" | "Sikh" | "South Indian" | "Modern";
export type Style = "Royal" | "Minimal" | "Garden" | "Traditional";

export interface Template {
  id: string;
  name: string;
  religion: Religion;
  style: Style;
  tier: "Starter" | "Classic" | "Premium" | "Luxury";
  price: number;
  themeClass: string;
  tagline: string;
}

export const TEMPLATES: Template[] = [
  { id: "royal", name: "Rajwada", religion: "Hindu", style: "Royal", tier: "Premium", price: 799, themeClass: "theme-royal", tagline: "Maroon & gold, palace grandeur" },
  { id: "minimal", name: "Shwet", religion: "Modern", style: "Minimal", tier: "Starter", price: 299, themeClass: "theme-minimal", tagline: "Clean ivory, quiet elegance" },
  { id: "garden", name: "Phulwari", religion: "Hindu", style: "Garden", tier: "Classic", price: 499, themeClass: "theme-garden", tagline: "Soft greens and blush florals" },
  { id: "nikah", name: "Noor", religion: "Muslim", style: "Royal", tier: "Premium", price: 799, themeClass: "theme-nikah", tagline: "Emerald night, golden arches" },
  { id: "anand", name: "Ik Onkar", religion: "Sikh", style: "Traditional", tier: "Classic", price: 499, themeClass: "theme-anand", tagline: "Saffron warmth for Anand Karaj" },
  { id: "south", name: "Kanjivaram", religion: "South Indian", style: "Traditional", tier: "Luxury", price: 1499, themeClass: "theme-south", tagline: "Silk purple and temple gold" },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

export interface InviteEvent {
  id: string;
  name: string;
  date: string; // yyyy-mm-dd
  time: string;
  venue: string;
  mapUrl: string;
  dressCode: string;
}

export interface InviteContent {
  bride: string;
  groom: string;
  weddingDate: string; // ISO date
  story: string;
  hosts: string;
  coverPath?: string; // storage path
  gallery: string[]; // storage paths
  musicUrl: string;
  thankYou: string;
  events: InviteEvent[];
}

export const newEventId = () => Math.random().toString(36).slice(2, 10);

export const emptyContent = (): InviteContent => ({
  bride: "",
  groom: "",
  weddingDate: "",
  story: "",
  hosts: "",
  gallery: [],
  musicUrl: "",
  thankYou: "Your presence is the greatest blessing. Thank you!",
  events: [
    { id: newEventId(), name: "Wedding", date: "", time: "7:00 PM", venue: "", mapUrl: "", dressCode: "" },
  ],
});

export const DEMO_CONTENT: InviteContent = {
  bride: "Ananya",
  groom: "Kabir",
  weddingDate: "2027-02-14",
  hosts: "With the blessings of the Mehra & Kapoor families",
  story:
    "We met over a borrowed umbrella in a Pune monsoon. Six years, two cities and countless chai breaks later, we're ready for forever — and we'd love you there.",
  gallery: [],
  musicUrl: "",
  thankYou: "Aapka aashirwad hi humara sabse bada tohfa hai. Thank you for celebrating with us!",
  events: [
    { id: "e1", name: "Mehendi", date: "2027-02-12", time: "4:00 PM", venue: "Mehra Residence, Koregaon Park, Pune", mapUrl: "https://maps.google.com/?q=Koregaon+Park+Pune", dressCode: "Green & yellow" },
    { id: "e2", name: "Haldi", date: "2027-02-13", time: "10:00 AM", venue: "Mehra Residence, Koregaon Park, Pune", mapUrl: "https://maps.google.com/?q=Koregaon+Park+Pune", dressCode: "Yellow" },
    { id: "e3", name: "Sangeet", date: "2027-02-13", time: "7:30 PM", venue: "The Westin, Pune", mapUrl: "https://maps.google.com/?q=The+Westin+Pune", dressCode: "Indo-western glam" },
    { id: "e4", name: "Wedding", date: "2027-02-14", time: "6:00 PM", venue: "Oxford Golf Resort, Pune", mapUrl: "https://maps.google.com/?q=Oxford+Golf+Resort+Pune", dressCode: "Traditional" },
    { id: "e5", name: "Reception", date: "2027-02-15", time: "8:00 PM", venue: "JW Marriott, Pune", mapUrl: "https://maps.google.com/?q=JW+Marriott+Pune", dressCode: "Formal" },
  ],
};

export const PLANS = [
  { name: "Starter", price: 299, note: "Simple, minimal designs" },
  { name: "Classic", price: 499, note: "Most popular — best value", popular: true },
  { name: "Premium", price: 799, note: "Royal, detailed designs" },
  { name: "Luxury", price: 1499, note: "Our top premium designs" },
];

export const ADDONS = [
  { name: "Custom song / music", price: 99 },
  { name: "Extra live period (6 months)", price: 199 },
  { name: "Custom domain setup", price: 499 },
  { name: "Video teaser section", price: 499 },
  { name: "Priority 24-hour delivery (custom)", price: 999 },
];

export const WHATSAPP_NUMBER = "919999999999"; // placeholder — replace with real number
export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

export function parseContent(raw: unknown): InviteContent {
  const base = emptyContent();
  if (!raw || typeof raw !== "object") return base;
  const c = raw as Partial<InviteContent>;
  return { ...base, ...c, gallery: Array.isArray(c.gallery) ? c.gallery : [], events: Array.isArray(c.events) ? c.events : base.events };
}

export interface RsvpRow {
  guest_name: string;
  phone: string | null;
  guest_count: number;
  responses: Record<string, "yes" | "no">;
  message: string | null;
  created_at: string;
}

export function rsvpStats(rsvps: RsvpRow[], events: InviteEvent[]) {
  const perEvent = events.map((e) => {
    let yes = 0, no = 0, guests = 0;
    for (const r of rsvps) {
      const a = r.responses?.[e.id];
      if (a === "yes") { yes++; guests += r.guest_count; }
      else if (a === "no") no++;
    }
    return { id: e.id, name: e.name, yes, no, guests };
  });
  return { total: rsvps.length, perEvent };
}

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
export function rsvpCsv(rsvps: RsvpRow[], events: InviteEvent[]) {
  const header = ["Name", "Phone", "Guests", ...events.map((e) => e.name), "Message", "Submitted"];
  const rows = rsvps.map((r) => [
    r.guest_name, r.phone ?? "", r.guest_count,
    ...events.map((e) => r.responses?.[e.id] ?? ""),
    r.message ?? "", r.created_at,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
