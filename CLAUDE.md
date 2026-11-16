# sheng-yan.com

Sheng Yan's personal site: Next.js 16 App Router, TypeScript, no UI framework at runtime. Design ported from
murphmaxxing.com (black, cream, MailZoo green); all motion is hand-written canvas/rAF in `src/components/sheng/*-engine.ts`.

- `npm run build` is a **static export** to `out/` (GitHub Pages, custom domain via `public/CNAME`). Keep `trailingSlash`,
  `public/.nojekyll` and the SEO map in `src/content/seo.ts` in sync with the routes.
- `NEXT_OUTPUT=standalone npm run build` adds the note API (`src/app/api/note/route.node.ts`), which static hosting can't run.
- Copy lives in `src/content/`. `projects.ts` / `engagement.ts` were generated from the previous Vite site (git tag `vite-site`)
  by `scripts/extract-portfolio.mjs`; edit them directly now, or check out the tag elsewhere and point the script at it.
- Hero and portrait assets are generated: see README "Change the photos". Project scenes (`iso-engine.ts`, import-free so the
  artifact bundle and `npm run posters` can load it) render their own cover stills: see README "Project scenes".
