# Aashar CK: portfolio v2

A portfolio that is itself a working AI system: ask questions answered only from the corpus, with sources; open "Under the hood" on any answer for retrieved chunks, scores, tokens, cost and latency.

```bash
npm install
npm run dev        # http://localhost:3000, mock mode ($0) unless keys are set
npm test           # unit tests
npm run e2e        # Playwright (desktop + phone, axe)
```

- Content: `content/*.md` (every fact, with its source). Built into `src/generated/corpus.json` before dev/build/test.
- AI: `src/lib/{retrieval,ask,llm,guard,run}.ts`. Env vars: `.env.example`.
- Why things are the way they are: `DECISIONS.md`. Status and next steps: `NOTES.md`.
