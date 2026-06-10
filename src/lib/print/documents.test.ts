import { describe, expect, it } from "vitest";
import {
  buildCommitmentCertificateHtml,
  buildPosterHtml,
  buildPracticePlanHtml,
  buildReflectionSummaryHtml,
} from "./documents";
import { BRAND } from "./brand";
import type { CommitmentItem } from "../../types";

const SAMPLE_PLEDGES: CommitmentItem[] = [
  { id: "a", tier: "support", label: "Notice", text: "I will notice the weight." },
  { id: "b", tier: "ethics", label: "Pause", text: "I will pause under pressure." },
];

describe("print documents", () => {
  it("reflection summary includes role, meters, and escapes user text", () => {
    const html = buildReflectionSummaryHtml({
      roleLabel: "Attorney",
      dateISO: "2026-01-01T00:00:00.000Z",
      meters: [{ label: "Exposure", valueLabel: "Emerging · 40/100", pct: 40, color: BRAND.sky }],
      subs: [{ label: "Self-transgression", pct: 30 }],
      lead: "A <script> lead.",
      triage: [{ tier: "repair", title: "Repair", body: "Make it right." }],
      footnote: "Educational only.",
    });
    expect(html).toContain("Attorney");
    expect(html).toContain("Exposure");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script> lead");
    expect(html).toContain("print-color-adjust: exact");
  });

  it("commitment certificate carries name, id, and pledges", () => {
    const html = buildCommitmentCertificateHtml({
      name: 'Jordan "JJ" Lee',
      dateISO: "2026-01-01T00:00:00.000Z",
      commitments: SAMPLE_PLEDGES,
      personal: "I will rest.",
      declarationId: "MIP-ABC123",
    });
    expect(html).toContain("MIP-ABC123");
    expect(html).toContain("I will notice the weight.");
    expect(html).toContain("I will rest.");
    expect(html).toContain("Jordan &quot;JJ&quot; Lee");
  });

  it("practice plan renders habits and commitments", () => {
    const html = buildPracticePlanHtml({
      dateISO: "2026-01-01T00:00:00.000Z",
      commitments: ["Center the child."],
      habits: [{ cue: "When pressured", then: "I name it", why: "Buys a beat." }],
    });
    expect(html).toContain("Center the child.");
    expect(html).toContain("When pressured");
    expect(html).toContain("Buys a beat.");
  });

  it("poster is a dark document with the quote", () => {
    const html = buildPosterHtml({ quote: "Stay whole.", attribution: "Sam" });
    expect(html).toContain("Stay whole.");
    expect(html).toContain("Sam");
    expect(html).toContain(BRAND.navy);
  });
});
