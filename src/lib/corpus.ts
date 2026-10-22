import corpusJson from "@/generated/corpus.json";
import type { CorpusIndex } from "./corpus-build";

export const corpus = corpusJson as unknown as CorpusIndex;

export function chunkById(id: string) {
  return corpus.chunks.find((c) => c.id === id);
}

export function chunksOf(slug: string) {
  return corpus.chunks.filter((c) => c.doc === slug);
}

export function docOf(slug: string) {
  return corpus.docs.find((d) => d.slug === slug);
}
