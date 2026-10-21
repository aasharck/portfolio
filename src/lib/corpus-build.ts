// Turns content/*.md into chunks plus a BM25 index. Runs at build time
// (scripts/build-corpus.ts) and in tests; the app only ever reads the JSON.

import { tokenize } from "./text";

export interface Chunk {
  id: string; // "sitesgen#cost-per-site"
  doc: string; // "sitesgen"
  docTitle: string;
  heading: string;
  anchor: string;
  text: string;
  source: string; // the "> Source:" line, shown in the trace and on /notes
  url: string; // page on this site where the chunk is rendered
}

export interface DocMeta {
  slug: string;
  title: string;
  summary: string;
  order: number;
  url?: string;
}

export interface CorpusIndex {
  builtAt: string;
  docs: DocMeta[];
  chunks: Chunk[];
  // BM25 statistics
  df: Record<string, number>;
  tf: Record<string, number>[]; // per chunk
  len: number[];
  avgLen: number;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

export function parseDoc(raw: string): { meta: DocMeta; chunks: Chunk[] } {
  const { meta, body } = parseFrontmatter(raw);
  const slug = meta.slug;
  if (!slug || !meta.title) throw new Error("content file needs slug and title");
  const doc: DocMeta = {
    slug,
    title: meta.title,
    summary: meta.summary ?? "",
    order: Number(meta.order ?? 99),
    url: meta.url || undefined,
  };
  const chunks: Chunk[] = [];
  const sections = body.split(/^## /m).slice(1);
  for (const section of sections) {
    const nl = section.indexOf("\n");
    const heading = section.slice(0, nl).trim();
    const lines = section.slice(nl + 1).split("\n");
    const sourceLines = lines.filter((l) => l.startsWith("> Source:"));
    const text = lines
      .filter((l) => !l.startsWith(">"))
      .join("\n")
      .trim();
    if (!sourceLines.length) throw new Error(`section "${heading}" in ${slug} has no Source line`);
    const anchor = slugify(heading);
    chunks.push({
      id: `${slug}#${anchor}`,
      doc: slug,
      docTitle: doc.title,
      heading,
      anchor,
      text,
      source: sourceLines.map((l) => l.replace("> Source:", "").trim()).join(" "),
      url: `/notes/${slug}#${anchor}`,
    });
  }
  return { meta: doc, chunks };
}

export function buildIndex(files: string[]): CorpusIndex {
  const docs: DocMeta[] = [];
  const chunks: Chunk[] = [];
  for (const raw of files) {
    const parsed = parseDoc(raw);
    docs.push(parsed.meta);
    chunks.push(...parsed.chunks);
  }
  docs.sort((a, b) => a.order - b.order);
  const df: Record<string, number> = {};
  const tf: Record<string, number>[] = [];
  const len: number[] = [];
  for (const c of chunks) {
    // Heading counts three times and the document title once more: they say what the section is about.
    const tokens = [
      ...tokenize(c.text),
      ...tokenize(c.heading),
      ...tokenize(c.heading),
      ...tokenize(c.heading),
      ...tokenize(c.docTitle),
    ];
    const counts: Record<string, number> = {};
    for (const t of tokens) counts[t] = (counts[t] ?? 0) + 1;
    for (const t of Object.keys(counts)) df[t] = (df[t] ?? 0) + 1;
    tf.push(counts);
    len.push(tokens.length);
  }
  const avgLen = len.reduce((a, b) => a + b, 0) / Math.max(1, len.length);
  return { builtAt: new Date().toISOString(), docs, chunks, df, tf, len, avgLen };
}
