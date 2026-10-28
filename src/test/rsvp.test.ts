import { describe, expect, it } from "vitest";
import { rsvpCsv, rsvpStats, slugify, type RsvpRow } from "@/lib/templates";

const events = [
  { id: "s", name: "Sangeet", date: "", time: "", venue: "", mapUrl: "", dressCode: "" },
  { id: "h", name: "Haldi", date: "", time: "", venue: "", mapUrl: "", dressCode: "" },
];
const row = (n: string, c: number, r: RsvpRow["responses"]): RsvpRow => ({ guest_name: n, phone: null, guest_count: c, responses: r, message: null, created_at: "2026-10-28" });

describe("per-event RSVP", () => {
  it("counts yes, no and guests separately per event", () => {
    const s = rsvpStats([row("Sharma", 4, { s: "yes", h: "no" }), row("Gupta", 2, { s: "yes" })], events);
    expect(s.total).toBe(2);
    expect(s.perEvent[0]).toMatchObject({ name: "Sangeet", yes: 2, no: 0, guests: 6 });
    expect(s.perEvent[1]).toMatchObject({ name: "Haldi", yes: 0, no: 1, guests: 0 });
  });
  it("exports one CSV column per event", () => {
    const csv = rsvpCsv([row("Sharma", 4, { s: "yes", h: "no" })], events).split("\n");
    expect(csv[0]).toBe('"Name","Phone","Guests","Sangeet","Haldi","Message","Submitted"');
    expect(csv[1]).toContain('"yes","no"');
  });
});

describe("invitation link", () => {
  it("builds a clean couple link", () => {
    expect(slugify("Ananya & Kabir")).toBe("ananya-kabir");
  });
});
