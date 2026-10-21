import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ask, checkMarkers, REFUSAL } from "@/lib/ask";
import { buildIndex } from "@/lib/corpus-build";
import { assessFit, extractRequirementsRules, ruleSummary } from "@/lib/fit";
import type { Llm, ModeInfo, Usage } from "@/lib/llm";

const dir = join(process.cwd(), "content");
const index = buildIndex(
  readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFileSync(join(dir, f), "utf8")),
);
const MOCK: ModeInfo = { mode: "mock", reason: "test" };
const LIVE: ModeInfo = { mode: "live", reason: "test" };

/** A scripted stand-in for Claude: returns queued outputs and records calls. */
function fakeLlm(outputs: unknown[]): Llm & { calls: { model: string; user: string }[] } {
  const calls: { model: string; user: string }[] = [];
  const usage = (model: string): Usage => ({ model, inputTokens: 1000, outputTokens: 200, cacheReadTokens: 0 });
  return {
    calls,
    async structured({ model, user, schema }) {
      calls.push({ model, user });
      return { output: schema.parse(outputs.shift()), usage: usage(model), ms: 5, stopReason: "end_turn" };
    },
    async text({ model, user }) {
      calls.push({ model, user });
      return { output: String(outputs.shift()), usage: usage(model), ms: 5, stopReason: "end_turn" };
    },
  };
}

describe("ask: refusals", () => {
  it.each(["Does he know Kubernetes?", "What is his favourite food?", "What's his salary expectation?"])(
    "refuses %s without calling a model",
    async (q) => {
      const llm = fakeLlm([]);
      const a = await ask(q, { mode: LIVE, llm, index });
      expect(a.refused).toBe(true);
      expect(a.answer).toBe(REFUSAL);
      expect(llm.calls).toHaveLength(0);
      expect(a.trace.costUsd).toBe(0);
    },
  );
});

describe("ask: mock mode", () => {
  it("answers with citations that point at retrieved chunks", async () => {
    const a = await ask("What does a SitesGen site cost in model spend?", { mode: MOCK, index });
    expect(a.refused).toBe(false);
    expect(a.answer).toMatch(/\$0\.33/);
    expect(a.citations.length).toBeGreaterThan(0);
    for (const c of a.citations) expect(a.trace.retrieved.map((r) => r.id)).toContain(c.id);
    expect(a.trace.mode).toBe("mock");
  });
});

describe("ask: live path (scripted model)", () => {
  it("keeps valid [n] markers, drops invalid ones, and reports cost", async () => {
    const llm = fakeLlm(["About $0.33 per site in model spend [1]. Also see [9]."]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => true,
    });
    expect(a.refused).toBe(false);
    expect(a.answer).not.toContain("[9]");
    expect(a.citations.map((c) => c.n)).toEqual([1]);
    expect(llm.calls[0].model).toBe("claude-haiku-5-5");
    expect(llm.calls[0].user).toContain("[1]");
    expect(a.trace.costUsd).toBeCloseTo((1000 * 0.1 + 200 * 0.5) / 1e6, 10);
  });

  it("grounding guard: an uncited answer is replaced by the refusal", async () => {
    const llm = fakeLlm(["He is great at everything."]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => true,
    });
    expect(a.refused).toBe(true);
    expect(a.answer).toBe(REFUSAL);
  });

  it("does not call the model when the budget is spent", async () => {
    const llm = fakeLlm(["unused [1]"]);
    const a = await ask("What does a SitesGen site cost in model spend?", {
      mode: LIVE,
      llm,
      index,
      reserve: async () => false,
    });
    expect(a.refused).toBe(true);
    expect(llm.calls).toHaveLength(0);
  });

  it("checkMarkers handles adjacent and out-of-range markers", () => {
    expect(checkMarkers("a [1][2] b [0] c [3]", 2)).toEqual({ text: "a [1][2] b  c", used: [1, 2], dropped: 2 });
  });
});

const JD = `Senior Full-Stack AI Engineer

About us
We are a fast-growing startup in Dubai.

Requirements:
- 5+ years of experience with React and TypeScript
- Experience with AWS Lambda and API Gateway
- Kubernetes and Terraform in production
- Strong PostgreSQL skills

Nice to have:
- Background in smart contract security audits

Benefits:
- Health insurance and visa`;

describe("fit: requirement extraction (rules)", () => {
  it("takes requirements and nice-to-haves, skips company blurb and benefits", () => {
    const r = extractRequirementsRules(JD);
    expect(r.roleTitle).toBe("Senior Full-Stack AI Engineer");
    expect(r.requirements.map((x) => x.text)).toEqual([
      "5+ years of experience with React and TypeScript",
      "Experience with AWS Lambda and API Gateway",
      "Kubernetes and Terraform in production",
      "Strong PostgreSQL skills",
      "Background in smart contract security audits",
    ]);
    expect(r.requirements.at(-1)?.priority).toBe("nice");
  });
});

describe("fit: mock report", () => {
  it("cites evidence where it exists and says plainly where it doesn't", async () => {
    const rep = await assessFit(JD, { mode: MOCK, index });
    const byText = Object.fromEntries(rep.items.map((i) => [i.text, i]));
    expect(byText["Kubernetes and Terraform in production"].verdict).toBe("none");
    expect(byText["Kubernetes and Terraform in production"].evidence).toEqual([]);
    expect(byText["Experience with AWS Lambda and API Gateway"].verdict).toBe("strong");
    expect(byText["Background in smart contract security audits"].evidence[0].quote).toMatch(/4 High and 2 Medium/);
    for (const it of rep.items)
      for (const e of it.evidence) expect(index.chunks.find((c) => c.id === e.id)?.text).toContain(e.quote);
    expect(rep.summary.gaps).toContain("Kubernetes and Terraform in production");
    expect(rep.trace.costUsd).toBe(0);
  });

  it("summary headline counts match the items", () => {
    const s = ruleSummary([
      { text: "a", priority: "must", verdict: "strong", evidence: [], note: "" },
      { text: "b", priority: "must", verdict: "none", evidence: [], note: "" },
    ]);
    expect(s.headline).toMatch(/1 of 2 requirements have direct evidence, 0 partial, 1 none/);
    expect(s.gaps).toEqual(["b"]);
  });
});

describe("fit: live path (scripted model) verifies every citation", () => {
  it("drops invented quotes and wrong sources, then downgrades the verdict", async () => {
    const llm = fakeLlm([
      {
        role_title: "AI Engineer",
        requirements: [
          { text: "Experience with AWS Lambda", priority: "must", search_query: "AWS Lambda serverless" },
          { text: "Smart contract audits", priority: "must", search_query: "audit Code4rena Sherlock" },
        ],
      },
      {
        assessments: [
          {
            req_index: 0,
            verdict: "strong",
            evidence: [
              {
                source_id: "skills#cloud-and-devops",
                quote:
                  "AWS Lambda, API Gateway, AppSync, DynamoDB, GCP, Vercel, Jenkins CI/CD, GitHub Actions, Docker, Git.",
              },
            ],
            note: "Listed on the CV.",
          },
          {
            req_index: 1,
            verdict: "strong",
            evidence: [
              { source_id: "security#competitive-smart-contract-audits", quote: "He found 12 Critical bugs." },
              {
                source_id: "skills#cloud-and-devops",
                quote:
                  "AWS Lambda, API Gateway, AppSync, DynamoDB, GCP, Vercel, Jenkins CI/CD, GitHub Actions, Docker, Git.",
              },
            ],
            note: "Audits.",
          },
        ],
        summary: { headline: "Good fit.", strengths: ["AWS"], gaps: [] },
      },
    ]);
    const rep = await assessFit("x".repeat(100), { mode: LIVE, llm, index, reserve: async () => true });
    expect(llm.calls.map((c) => c.model)).toEqual(["claude-haiku-5-5", "claude-sonnet-5-5"]);
    expect(rep.items[0].verdict).toBe("strong");
    expect(rep.items[0].evidence).toHaveLength(1);
    // invented quote + a real quote from a chunk not retrieved for this requirement
    expect(rep.items[1].verdict).toBe("none");
    expect(rep.items[1].evidence).toEqual([]);
    expect(rep.droppedCitations).toBe(2);
    expect(rep.trace.usage).toHaveLength(2);
  });

  it("refuses to start when the budget can't cover the worst case", async () => {
    const llm = fakeLlm([]);
    await expect(assessFit(JD, { mode: LIVE, llm, index, reserve: async () => false })).rejects.toThrow(/budget/);
    expect(llm.calls).toHaveLength(0);
  });
});
