import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildIndex, parseDoc } from "@/lib/corpus-build";
import { bestSentence, quoteIsInChunk, search } from "@/lib/retrieval";
import { tokenize } from "@/lib/text";

const dir = join(process.cwd(), "content");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => readFileSync(join(dir, f), "utf8"));
const index = buildIndex(files);

describe("corpus", () => {
  it("every section has a source line and a unique id", () => {
    const ids = index.chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of index.chunks) expect(c.source.length).toBeGreaterThan(3);
  });

  it("rejects a section without a source", () => {
    expect(() => parseDoc("---\ntitle: X\nslug: x\n---\n## A\nfact\n")).toThrow(/no Source line/);
  });

  it("never contains the phone number", () => {
    expect(files.join("\n")).not.toMatch(/334\s?7596/);
  });
});

describe("tokenize", () => {
  it("normalises tech names and drops filler", () => {
    expect(tokenize("Experience with Next.js and Node.js on CI/CD")).toEqual(["nextj", "nodej", "cicd"]);
  });
});

describe("search", () => {
  const top = (q: string) => search(index, q, 5)[0];

  it.each([
    ["How much does a SitesGen site cost?", "sitesgen#"],
    ["What did he find in smart-contract audits?", "security#competitive-smart-contract-audits"],
    ["Experience with AWS Lambda and API Gateway", "skills#cloud-and-devops"],
    ["Tell me about TraccoAI", "traccoai#"],
    ["Where did he study?", "profile#education"],
    ["Has he worked with Python?", "skills#back-end-and-ai"],
  ])("%s → %s", (q, prefix) => {
    expect(top(q)?.chunk.id.startsWith(prefix)).toBe(true);
  });

  it("finds the agents section among the top hits", () => {
    const ids = search(index, "Which agents does SitesGen use?", 5).map((h) => h.chunk.id);
    expect(ids).toContain("sitesgen#the-eight-agents");
  });

  it("returns nothing for topics the corpus never mentions", () => {
    expect(search(index, "Kubernetes and Terraform")).toEqual([]);
    expect(search(index, "What is his favourite food?")).toEqual([]);
  });

  it("weights unseen terms so partial matches score low coverage", () => {
    const h = top("Rust and Go microservices with gRPC");
    expect(h === undefined || h.coverage < 0.45).toBe(true);
  });
});

describe("evidence quotes", () => {
  const chunk = index.chunks.find((c) => c.id === "sitesgen#cost-per-site")!;

  it("picks the sentence that answers the question", () => {
    expect(bestSentence(chunk, "cost per site in model spend")).toMatch(/\$0\.33/);
  });

  it("accepts verbatim quotes and rejects invented ones", () => {
    expect(quoteIsInChunk("The build step costs nothing.", chunk)).toBe(true);
    expect(quoteIsInChunk("  the BUILD step   costs nothing ", chunk)).toBe(true);
    expect(quoteIsInChunk("Producing one website costs about $0.10 in model spend.", chunk)).toBe(false);
    expect(quoteIsInChunk("site", chunk)).toBe(false); // too short to be evidence
  });
});
