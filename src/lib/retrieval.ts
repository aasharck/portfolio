// BM25 over a ~40-chunk corpus with alias expansion. No embedding API, no model
// download: at this corpus size, lexical retrieval with a curated alias table is
// accurate, explainable (scores in the trace) and free. See DECISIONS.md.

import type { Chunk, CorpusIndex } from "./corpus-build";
import { aliasesOf, splitSentences, tokenize } from "./text";

const K1 = 1.2;
const B = 0.5;
export const EXPANSION_WEIGHT = 0.4;

export interface Hit {
  chunk: Chunk;
  score: number; // raw BM25
  coverage: number; // 0..1, idf-weighted share of query terms the chunk covers
  matched: string[]; // query terms found (directly or via an alias)
}

function idf(index: CorpusIndex, term: string): number {
  const n = index.chunks.length;
  const df = index.df[term] ?? 0;
  return Math.log(1 + (n - df + 0.5) / (df + 0.5));
}

function bm25Term(index: CorpusIndex, i: number, term: string): number {
  const f = index.tf[i][term] ?? 0;
  if (!f) return 0;
  const norm = f + K1 * (1 - B + (B * index.len[i]) / index.avgLen);
  return idf(index, term) * ((f * (K1 + 1)) / norm);
}

export function queryTerms(query: string): string[] {
  return [...new Set(tokenize(query))];
}

export function search(index: CorpusIndex, query: string, k = 5, excludeDocs: string[] = []): Hit[] {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  // Unknown terms get the maximum idf: a word the corpus never mentions
  // ("kubernetes") should weigh heavily against coverage, not vanish.
  const weights = terms.map((t) => idf(index, t));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const hits: Hit[] = index.chunks.map((chunk, i) => {
    let score = 0;
    let covered = 0;
    const matched: string[] = [];
    terms.forEach((t, j) => {
      const direct = bm25Term(index, i, t);
      let viaAlias = 0;
      for (const a of aliasesOf(t)) viaAlias = Math.max(viaAlias, bm25Term(index, i, a));
      score += direct + EXPANSION_WEIGHT * viaAlias;
      if (direct > 0) {
        covered += weights[j];
        matched.push(t);
      } else if (viaAlias > 0) {
        covered += weights[j] * 0.75;
        matched.push(`${t}~`);
      }
    });
    return { chunk, score, coverage: totalWeight ? covered / totalWeight : 0, matched };
  });

  return (
    hits
      .filter((h) => h.score > 0 && !excludeDocs.includes(h.chunk.doc))
      // Rank by BM25 scaled by coverage: a chunk that answers every part of the
      // query beats one that repeats a single term.
      .sort((a, b) => b.score * (0.5 + b.coverage) - a.score * (0.5 + a.coverage))
      .slice(0, k)
  );
}

/** The sentence in a chunk that best matches the query: used as the quoted evidence. */
export function bestSentence(chunk: Chunk, query: string): string {
  const terms = new Set(queryTerms(query));
  const expanded = new Set<string>();
  for (const t of terms) for (const a of aliasesOf(t)) expanded.add(a);
  let best = "";
  let bestScore = -1;
  for (const s of splitSentences(chunk.text)) {
    const toks = new Set(tokenize(s));
    let sc = 0;
    for (const t of toks) {
      if (terms.has(t)) sc += 1;
      else if (expanded.has(t)) sc += EXPANSION_WEIGHT;
    }
    // Prefer shorter sentences on ties: they quote better.
    sc -= s.length / 5000;
    if (sc > bestScore) {
      bestScore = sc;
      best = s;
    }
  }
  return best;
}

/** True when `quote` appears in the chunk text (whitespace and case-insensitive). */
export function quoteIsInChunk(quote: string, chunk: Chunk): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[\s"“”'‘’]+/g, " ")
      .trim();
  const q = norm(quote)
    .replace(/^\.+|\.+$/g, "")
    .replace(/…/g, "");
  if (q.length < 12) return false;
  return norm(chunk.text).includes(q);
}
