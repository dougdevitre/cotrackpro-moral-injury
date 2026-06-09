import { describe, it, expect } from "vitest";
import { gradeTest, completionEligible, makeCompletionId } from "./courseProgress";
import {
  buildCertificateData,
  buildCertificateHtml,
  buildSubmissionPacketMarkdown,
  type CertificateContext,
} from "./certificate";
import { TEST_QUESTIONS, ROLE_QUESTIONS, assembleTest } from "../data/postTest";
import { AGENDA, COURSE, LEARNING_OBJECTIVES, objectivesForRole, TOTAL_MINUTES, estimatedHours } from "../data/course";
import { TRACKS, trackByRole } from "../data/tracks";
import { ROLES } from "../data/roles";

const ctx: CertificateContext = {
  courseTitle: COURSE.title,
  courseId: COURSE.id,
  instructionalMethod: COURSE.instructionalMethod,
  productionDate: COURSE.productionDate,
  minutes: TOTAL_MINUTES,
  hours: estimatedHours(),
  provider: "[Your organization name]",
  providerNumber: "[Provider number]",
  author: "[Author]",
  disclaimer: "Not pre-accredited. Verify with your board.",
};

describe("gradeTest", () => {
  it("scores a perfect set as passed", () => {
    const answers = Object.fromEntries(TEST_QUESTIONS.map((q) => [q.id, q.correctIndex]));
    const r = gradeTest(TEST_QUESTIONS, answers, COURSE.passThreshold);
    expect(r.correct).toBe(TEST_QUESTIONS.length);
    expect(r.pct).toBe(1);
    expect(r.passed).toBe(true);
  });

  it("fails an all-wrong set", () => {
    const answers = Object.fromEntries(
      TEST_QUESTIONS.map((q) => [q.id, (q.correctIndex + 1) % q.options.length])
    );
    const r = gradeTest(TEST_QUESTIONS, answers, COURSE.passThreshold);
    expect(r.correct).toBe(0);
    expect(r.passed).toBe(false);
  });

  it("applies the threshold at the boundary", () => {
    const q = [
      { id: "a", prompt: "", options: ["x", "y"], correctIndex: 0, explanation: "" },
      { id: "b", prompt: "", options: ["x", "y"], correctIndex: 0, explanation: "" },
    ];
    expect(gradeTest(q, { a: 0, b: 1 }, 0.5).passed).toBe(true); // 50% >= 0.5
    expect(gradeTest(q, { a: 0, b: 1 }, 0.8).passed).toBe(false); // 50% < 0.8
  });
});

describe("post-test integrity", () => {
  it("every question has a valid correctIndex", () => {
    for (const q of TEST_QUESTIONS) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });
});

describe("completionEligible", () => {
  const base = {
    modulesAffirmed: true,
    testPassed: true,
    evaluationDone: true,
    timeAttested: true,
    name: "Dana Lee",
    jurisdiction: "Missouri Bar",
  };
  it("is true when all conditions hold", () => {
    expect(completionEligible(base)).toBe(true);
  });
  it("is false if any gate is missing", () => {
    expect(completionEligible({ ...base, testPassed: false })).toBe(false);
    expect(completionEligible({ ...base, modulesAffirmed: false })).toBe(false);
    expect(completionEligible({ ...base, evaluationDone: false })).toBe(false);
    expect(completionEligible({ ...base, timeAttested: false })).toBe(false);
    expect(completionEligible({ ...base, name: "  " })).toBe(false);
    expect(completionEligible({ ...base, jurisdiction: "" })).toBe(false);
  });
});

describe("makeCompletionId", () => {
  it("includes course id and initials and is deterministic for a seed", () => {
    const id = makeCompletionId("CTP-MIR-101", "Dana Lee", 1717000000000);
    expect(id.startsWith("CTP-MIR-101-")).toBe(true);
    expect(id.endsWith("-DL")).toBe(true);
    expect(makeCompletionId("CTP-MIR-101", "Dana Lee", 1717000000000)).toBe(id);
  });
});

describe("certificate + packet builders", () => {
  it("certificate HTML carries the required fields and disclaimer", () => {
    const data = buildCertificateData(
      { name: "Dana Lee", roleCategory: "Attorney", jurisdiction: "Missouri Bar", dateISO: "2026-06-07" },
      "CTP-MIR-101-ABC-DL",
      ctx
    );
    const html = buildCertificateHtml(data);
    expect(html).toContain("Certificate of Completion");
    expect(html).toContain("Dana Lee");
    expect(html).toContain(COURSE.id);
    expect(html).toContain("CTP-MIR-101-ABC-DL");
    expect(html).toContain("determined by your board");
    expect(html).toContain(ctx.disclaimer);
  });

  it("escapes HTML in participant-supplied fields", () => {
    const data = buildCertificateData(
      { name: "<script>x</script>", roleCategory: "Attorney", jurisdiction: "X", dateISO: "2026-06-07" },
      "ID",
      ctx
    );
    const html = buildCertificateHtml(data);
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("submission packet includes objectives, agenda total, role tracks, and disclaimer", () => {
    const md = buildSubmissionPacketMarkdown(
      { ...ctx, description: COURSE.description, participationNote: "verify" },
      objectivesForRole("attorney"),
      AGENDA,
      TRACKS,
      "[quals]",
      "[contact]",
      trackByRole("attorney")
    );
    expect(md).toContain("Learning objectives");
    expect(md).toContain("Timed agenda");
    expect(md).toContain(`**${TOTAL_MINUTES}**`);
    expect(md).toContain(ctx.disclaimer);
    expect(md).toContain("Judicial education"); // a role track label
    expect(md).toContain("Primary track for this submission");
  });
});

describe("role tracks", () => {
  it("provides a track for every selectable role", () => {
    for (const r of ROLES) {
      expect(trackByRole(r.id).roleId, `role ${r.id}`).toBe(r.id);
    }
  });

  it("every track question id resolves to a real role question", () => {
    const ids = new Set(ROLE_QUESTIONS.map((q) => q.id));
    for (const t of TRACKS) {
      for (const qid of t.questionIds) {
        expect(ids.has(qid), `track ${t.roleId} -> ${qid}`).toBe(true);
      }
    }
  });

  it("assembleTest appends the track's role questions to the core set", () => {
    const attorney = assembleTest(trackByRole("attorney").questionIds);
    expect(attorney.length).toBe(TEST_QUESTIONS.length + 1);
    expect(attorney.some((q) => q.id === "rq_ethics_sep")).toBe(true);

    const other = assembleTest(trackByRole("other").questionIds);
    expect(other.length).toBe(TEST_QUESTIONS.length); // no extras
  });

  it("objectivesForRole appends a role objective when the track has one", () => {
    expect(objectivesForRole("attorney").length).toBe(LEARNING_OBJECTIVES.length + 1);
    expect(objectivesForRole("other").length).toBe(LEARNING_OBJECTIVES.length);
  });
});
