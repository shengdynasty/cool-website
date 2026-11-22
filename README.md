# sheng-yan.com

Sheng Yan's personal site

Next.js 16 (App Router), React 19, TypeScript. All motion is hand-written canvas, `requestAnimationFrame` and `IntersectionObserver`, ported from the source site. There are no animation libraries.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + static export
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `npm run build` writes a static export to `out/` (trailing-slash URLs, `public/CNAME` = sheng-yan.com, `public/.nojekyll`), which is pushed to the `gh-pages` branch here and mirrored to the shawnyan.com repo. Nothing else to do.

Search setup carried over from the old site: per-page titles and descriptions in `src/content/seo.ts`, canonical and Open Graph tags on every page, the schema.org Person block in the root layout, `public/robots.txt`, and `sitemap.xml` from `src/app/sitemap.ts`. When you add a route, add it to the SEO map so the sitemap and its metadata exist.

To run the site with the note backend instead (any Node host):

```bash
NEXT_OUTPUT=standalone npm run build && node .next/standalone/server.js
```

## Pages

| Route | What it is |
|---|---|
| `/` | Home: ASCII hero with the contact card, status, experience accordion, ways, projects, footer |
| `/projects`, `/engagement` | The source's vault page: featured row, filter pills, cover grid |
| `/project/[id]`, `/engagement/[id]` | The source's guide page: split header, write-up, diagrams, code, Keep reading |

## Change the words

Home page copy lives in `src/content/home.ts`. The hero title can't wrap on phones, so keep it to 12 characters or fewer.

Projects and engagements live in `src/content/projects.ts` and `engagement.ts`. They were generated once from the previous site; edit them directly. (To regenerate from the old source, check out the `vite-site` tag into a folder and run `node scripts/extract-portfolio.mjs <that folder>`.)

## Change the photos

The hero's ASCII outline animation is driven by a grid built from the photo and a person mask. If you swap `public/images/sheng-skyline.jpg`, rebuild the hero assets:

```bash
# 1. person mask (Apple Vision, macOS only)
swift scripts/segment-person.swift public/images/sheng-skyline.jpg docs/research/masks/skyline-mask.png

# 2. grid + composited photo
node scripts/build-hero-grid.mjs

# 3. poster (the frame shown before JS runs)
FONTCONFIG_FILE=$PWD/scripts/fonts.conf node scripts/render-hero-poster.mjs
```

`build-hero-grid.mjs` crops the square photo to 8:5. If the person sits somewhere else in a new photo, adjust `CROP_TOP` in that script. The seam (where the glyph field dissolves into the photo) and the intro centre are computed from the mask automatically.

The status-section portrait uses `public/home/portrait-cutout.webp`: the photo in greyscale with the person mask in the alpha channel.

## Layout

```
src/app/page.tsx                    page shell
src/components/sheng/Hero.tsx …     one server component per section (markup mirrors the source HTML)
src/components/sheng/hero-engine.ts hero intro, ASCII stage, card tilt, typewriter
src/components/sheng/rest-effects.ts seams, ways graph, CTA glyph field, footer mark, decrypt, covers
src/components/sheng/PortraitMark.tsx ASCII portrait canvas
src/components/sheng/home-extras.ts  experience accordion (+ its rise-in, develop and autoplay motion), contact links
src/components/sheng/iso-engine.ts   isometric project scenes (engine + storyboards) and their posters
src/styles/                         ported CSS (recoloured) + black-and-white overrides
docs/research/                      design tokens, behaviors, topology, component specs
```

## Contact

Every "get in touch" and "Send me a note" link lands on the hero card (`#contact`) and focuses its input. The card asks for a message and an email and posts them to `POST /api/note`:

- With `RESEND_API_KEY` set, the note is emailed to `NOTE_TO` (default: the site email) through [Resend](https://resend.com), with the sender as reply-to. `NOTE_FROM` sets the sender (default: Resend's onboarding address, fine for testing).
- Without it, notes are appended to `NOTES_FILE` (default `data/notes.jsonl`, git-ignored), one JSON object per line.
- On sheng-yan.com (static hosting) there is no API, so the card opens the visitor's mail app with the note instead.

Inside the claude.ai artifact there is no server. There, the card stores notes in the artifact's own database when the viewer is allowed to write (members of your organization at Contributor or above, and people you invite by email as editors); anyone else gets the note copied to their clipboard. You, as the owner, see an inbox of received notes above the status section; nobody else can read them.

## Photos: project covers and experience panels

`src/content/covers.json` lists every photograph used for the 13 project covers, for the Cornell, IIT, robotics and math-team panels, and inside project figures (`kind: "figure"`): source URL, author and license (public domain, CC0, or CC BY). It is also the data behind `/credits`, linked from the footer.

```bash
node scripts/build-covers.mjs              # downloads any missing source to docs/research/downloads/covers/, then renders:
                                           #   public/images/projects/<id>.webp      (1200×800 three-tone dither, green highlights)
                                           #   public/images/experience/<id>-bg.jpg  (1400px wide photo)
                                           #   figures: public/images/projects/<id>.webp (`width` px, black-to-cream mono)
node scripts/build-experience-assets.mjs   # the MailZoo/Wharton/NASA panels, the YC illustration, and the logo badges
```

To swap a photo, change its entry in `covers.json` (any CC0/public-domain/CC BY image URL), delete the old source file, and re-run the script. Covers are normalised to the same dark key automatically; `focus: "attention"` crops to the busiest part of the photo instead of the centre, and `gamma`/`contrast` override the automatic tone.

A cover can also come from the site's own still instead of a download: `file` names a committed image (in `scripts/assets/covers/`), `extract` (`left`, `top`, `width`, `height`) crops it first, and `own: true` keeps it off `/credits`. The Project Reelix cover is made this way from a frame of the app's own video. `node scripts/build-covers.mjs reelix` rebuilds only the ids you name.

## Project scenes

Some projects have an animated isometric visual instead of a photo (design after aumsuthar.com's project cards): a
looping storyboard of low-poly parts, labels and captions, drawn on a canvas over the cover wherever JS runs. The
engine and the scenes are in `src/components/sheng/iso-engine.ts`; a project opts in with `cover.scene` naming a
scene id. Add a scene to `SCENES` there (parts from `box`, `frustum` and `circle`, a `frame(t)` for the loop, `beats`
for the captions), then render its still:

```bash
npm run posters   # writes public/images/projects/<scene id>.webp from the scene's `poster` time
```

That still is the cover image everywhere the scene can't play (before JS, reduced motion, link previews). The poster
script renders text as JetBrains Mono outlines (opentype.js), so the stills look the same on any machine.

Flat scenes (`FlatScene` in the same file) are 2D explainers drawn in a 600×400 design space with the same painters;
a figure in `project.diagrams` plays one by naming it in `scene`, and `after: n` puts the figure right under paragraph
`n` instead of in "How it works". A flat scene can draw photos: list their public paths in its `images` and draw them
with `p.image(src, x, y, w, h)`; the figure renders each as a hidden `<img>` (so the artifact build inlines it) and the
poster script embeds it. Project Modula's pipeline figure starts from a photo of a real V8 this way (`modula-v8` in
`covers.json`); its "New machine" screenshot shows the same photo, untoned, uploaded in the app. A figure can instead carry a `video`: a muted 3:2 MP4 loop (H.264, ≤ 3 MB, in
`public/videos/`) that plays over its still while it is in view; the still is its poster and stays under reduced motion.

A cover can carry a loop as well: `cover.video` (a muted 3:2 H.264 MP4, ≤ 2.5 MB) and optionally `cover.webm` (the
same clip in VP9, offered first, when it is smaller). It plays over the still on the project cards and the detail
page's header, only while in view and never under reduced motion; the still is its poster, so make it the clip's first
frame. Project Modula's cover is made this way from Modula's own hand-built V8 (a `../project-modula` checkout, only
read): 12 s at 30 fps, one slow turn of the camera while the engine runs, comes apart and goes back together, with
no interface. One script renders it frame by frame, grades it to black, cream and green, checks that the last frame
leads back into the first, and writes `public/videos/modula-loop.mp4` and `.webm` plus the poster
`public/images/projects/modula.webp`:

```bash
# lives in the Modula repo: ~/project-modula/tools/portfolio-cover/make.sh (writes the media here)   # needs ffmpeg (libx264, libvpx) and Python 3 with numpy and Pillow
```

A project without `github` is shown unlinked: no code row, no "View the code" button and no GitHub line in the callout.

## Publish the artifact

```bash
npm run build && node scripts/build-artifact.mjs
```

This writes one self-contained HTML file per page to `artifact/`. Publish `artifact/index.html` as the main page, with every other `artifact/*.html` file except `preview.html` as supporting files.
