// Build-time step: content/*.md -> src/generated/corpus.json (chunks + BM25 stats).
// Runs before dev, build and test, so retrieval needs no API and no runtime file reads.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildIndex } from "../src/lib/corpus-build";

const root = process.cwd();
const dir = join(root, "content");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => readFileSync(join(dir, f), "utf8"));

const index = buildIndex(files);
mkdirSync(join(root, "src/generated"), { recursive: true });
writeFileSync(join(root, "src/generated/corpus.json"), JSON.stringify(index));
console.log(`corpus: ${index.docs.length} docs, ${index.chunks.length} chunks, ${Object.keys(index.df).length} terms`);
