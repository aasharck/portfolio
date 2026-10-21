// Tokenising, stemming and query expansion shared by the index builder,
// retrieval and the mock "model". Kept deliberately small and transparent:
// every score in the trace can be explained from this file.

const STOPWORDS = new Set(
  (
    "a an and are as at be been but by can could did do does doing for from had has have having he her " +
    "here him his how i if in into is it its just me more most my no not of on or our out over own so " +
    "some such than that the their them then there these they this those through to too under up very " +
    "was we were what when where which while who whom why will with would you your yours about also any " +
    "all each other only same should both few nor again further once aashar ck aashar's he's tell show " +
    "describe explain give please us role job candidate ideal looking seeking team join company " +
    "we're you'll you're plus etc e g ie eg strong excellent good great solid proven ability able " +
    "including include includes like using use used work works worked working within across knowledge " +
    "understanding familiarity familiar experience experienced years year hands hands-on must required " +
    "requirement requirements preferred bonus nice responsibilities responsible skills skill " +
    "know knows much many has have had did any ever powered driven based"
  ).split(/\s+/),
);

// Groups of terms that mean the same thing for retrieval. A query term pulls in
// the rest of its group at reduced weight (see EXPANSION_WEIGHT in retrieval.ts).
export const ALIAS_GROUPS: string[][] = [
  ["llm", "ai", "ml", "claude", "anthropic", "openai", "gpt", "chatgpt", "genai", "generative", "gemini"],
  ["agent", "agentic", "multiagent", "orchestration"],
  ["rag", "retrieval", "citation", "cite", "pgvector", "embedding", "vector", "grounding"],
  ["react", "nextjs", "frontend", "front-end", "ui"],
  ["nodejs", "node", "backend", "back-end", "express", "api"],
  ["postgres", "postgresql", "sql", "database", "supabase", "oracle", "mysql"],
  ["aws", "lambda", "serverless", "glue", "athena", "dynamodb", "appsync", "gcp", "cloud"],
  ["cicd", "jenkins", "devops", "docker", "deploy", "deployment"],
  ["test", "testing", "vitest", "playwright", "eval", "evaluation"],
  ["security", "audit", "vulnerability", "rls", "code4rena", "sherlock", "secure"],
  ["cost", "budget", "spend", "token", "pricing", "cheap"],
  ["typescript", "javascript"],
  ["python", "fastapi"],
  ["etl", "informatica", "pipeline", "warehouse"],
  ["dashboard", "recharts", "visualisation", "visualization", "chart", "analytics"],
  ["solidity", "contract", "web3", "blockchain", "ether", "defi"],
  ["saas", "multitenant", "tenant", "tenancy", "founder", "startup"],
  ["architecture", "architect"],
  ["graphql", "appsync", "rest"],
  ["prompt", "caching", "structured", "schema"],
  ["study", "education", "degree", "university", "graduated", "bachelor", "college"],
  ["contact", "email", "reach", "hire"],
  ["years", "senior"],
];

const ALIAS_INDEX: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const group of ALIAS_GROUPS) {
    const stemmed = group.map(stem);
    for (const t of stemmed) {
      m.set(t, [...(m.get(t) ?? []), ...stemmed.filter((x) => x !== t)]);
    }
  }
  return m;
})();

export function aliasesOf(term: string): string[] {
  return ALIAS_INDEX.get(term) ?? [];
}

export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("es") && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) {
    w = w.slice(0, -1);
  }
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/next\.?js/g, "nextjs")
    .replace(/node\.?js/g, "nodejs")
    .replace(/ci\s*\/\s*cd/g, "cicd")
    .replace(/multi[-\s]?agent/g, "multiagent")
    .replace(/multi[-\s]?tenant/g, "multitenant")
    .replace(/front[-\s]end/g, "frontend")
    .replace(/back[-\s]end/g, "backend")
    .replace(/[’']s\b/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/(\w)\.(\s|$)/g, "$1 ")
    .replace(/-/g, " ");
}

/** Content tokens: lower-cased, stop-words removed, lightly stemmed. */
export function tokenize(text: string): string[] {
  return normalise(text)
    .split(/\s+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"(])|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
