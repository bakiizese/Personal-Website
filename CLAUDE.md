# Personal website: Bereket Zeselassie

Static portfolio site. Audience: recruiters, freelance clients (Upwork), and people deciding whether to trust Bereket with work. It must read as made by a human designer-engineer, not generated.

## Stack and commands

Astro 7 (static output), MDX, no UI framework, no CSS framework. Node 24 (`.nvmrc`); Astro refuses to run on Node 20.

```bash
nvm use
npm run dev             # http://localhost:4321
npm run build           # project checks → astro check → astro build
npm run shots           # Playwright screenshots of dist/ at 1440 and 390 (add --dark, or routes)
npm run thumbs -- slug  # typographic placeholder thumbnail for a project
npm run brand           # regenerate public/og.png and favicons (after name/role/portrait changes)
.venv/bin/python scripts/cutout.py photo.jpg   # cut out a new portrait into src/assets/portrait.png
```

## Where things live

- `src/config/site.ts`: **all** personal content: name, role, bio, links, skills, experience, testimonials, video, résumé, contact copy. Components never hard-code personal content. `null` or an empty array means "not provided". With `showPlaceholders: false` (the default, at Bereket's request) that content is **hidden**: empty sections, links without a URL, and projects with `status: placeholder` don't render. Setting it to `true` shows `[PLACEHOLDER]` markers instead. Home sections are numbered from `src/lib/sections.ts`, over the visible ones only. Lines marked `REVIEW:` are drafted copy awaiting Bereket's approval.
- `projects/<slug>/index.mdx`: one folder per project, images beside it. Schema in `src/content.config.ts` (Zod, build-time). Extra checks in `src/lib/projects.ts` (slug = folder, unique `order`) and `scripts/check-projects.mjs` (image files exist). Guide: `docs/ADDING-PROJECTS.md`. `_template/` is never published.
- `src/styles/tokens.css`: every colour, size, space and duration. `base.css`: reset, element defaults, utilities (`.wrap`, `.grid`, `.label`, `.display`, `.muted`). `prose.css`: MDX long-form.
- `src/components/`: one file per section. `work/` holds the project listing.
- `/styleguide`: the living design reference, with live contrast measurement. Not linked, noindex, not in the sitemap.

## Design rules

**Direction:** editorial, warm, confident, minimal, one bold accent. A print magazine translated to the web with a quiet technical edge. "Futuristic" means precision (crisp grid, mono details, deliberate motion), never neon, glass or glow.

**Colour:** use tokens only, never raw hex in components.
- `--paper` bg, `--surface` raised, `--ink` text, `--muted` secondary, `--line` decorative rules only, `--line-strong` borders that must be seen.
- Accent vermilion is split for contrast: `--accent` (#E2482B, only 3.6:1 on paper) for markers, rules, focus rings, dots and text 24px+; `--accent-text` (#C23A1F, 4.8:1) for links, small text and the CTA fill; `--on-accent` for text on that fill.
- The accent is **never** a large fill, background or gradient. One filled CTA per view.
- Both themes come from `light-dark()`. Check any new colour pair on `/styleguide` in both themes; WCAG AA is required everywhere.

**Type:**
- Newsreader (`--serif`, `.display`) for names and headlines: weight 500, italic 400 for the occasional emphasised word. It's variable, and optical sizing follows the font size automatically. (Instrument Serif was tried first and rejected as too condensed; it made the page feel stretched vertically.)
- Geist (`--sans`) for body and UI.
- Geist Mono (`--mono`, `.label`) for small uppercase meta: `(02) Selected work`, dates, stack.
- Fluid scale `--step--2` … `--step-6`. No Inter, no system font as the main face.

**Hero portrait:** it stands beside the name, not over it. The layered overlap from the original brief was dropped because Bereket wants his name fully readable. The portrait's `left` is derived from the measured surname width in `Hero.astro`.

**Vertical rhythm:** keep it compact. The hero is sized by its content, not the viewport. Sections are separated by `--space-2xl`, and headlines don't get extra air above and below. Bereket found the first, airier version "stretched".

**Layout:**
- 12-column grid (4 on mobile), asymmetric, left-aligned by default. Centre only with a reason.
- Structure is visible: 1px rules, numbered section headers (`SectionHeader`), mono labels.
- Vary section layouts; never a row of identical cards.
- 16px side gutter on phones, no horizontal scroll.

**Motion:**
- Only: the hero load sequence, hover states, and one scroll-linked moment (the portrait drift).
- Everything sits behind `prefers-reduced-motion: no-preference`, and `base.css` also zeroes durations under `reduce`.
- No animation library.

**Components to reuse:** `SectionHeader`, `Button` (`primary` = the one filled CTA; `text` = every secondary action), `StackList` (slashes, not chips), `Placeholder`, `Availability`.

## Avoid (the tells of AI-generated sites)

- Purple, indigo or blue-violet gradients; glowing blobs; glassmorphism; gradient text.
- Emoji or icon-in-a-circle feature cards; emoji bullets.
- Three identical rounded cards in a row; everything centred.
- Fade-up-on-scroll on every element.
- Invented stats, fake testimonials, lorem ipsum. Anything not provided is hidden (or a visible `[PLACEHOLDER]` with `showPlaceholders: true`), never made up.
- Generic copy ("passionate developer crafting digital experiences"). Write plain, specific, first person.
- Heavy shadows; border radius above 2px; pill buttons; decorative social-icon circles.

## Content rules

- Never invent facts, numbers, employers or quotes. Project copy comes from the repos' own READMEs and code. Cite figures only when the repo states them.
- New copy for Bereket goes in `site.ts` with a `REVIEW:` comment.
- Testimonials: real, attributed, with permission, or the section stays hidden.

## Gotchas

- **Astro 7 backgrounds `astro preview` when it detects an AI agent**, and the server then lingers on the port. Scripts pass `--ignore-lock` and kill the process group; do the same in any new script.
- **Image scripts can't load `file://` fonts or images** into a page set from `about:blank`. Use `scripts/lib/fonts.mjs` (data URIs) and embed images as data URIs. Font family names there are prefixed (`'BZ Serif'`) because an unquoted `Serif` is the generic keyword.
- **The CSS minifier folds `animation-timeline` into the `animation` shorthand**, which invalidates it. Keep scroll-timeline properties in a separate, more specific rule (see `Hero.astro`).
- The fonts use Astro's `local` provider pointing into `node_modules/@fontsource*`. The `npm` provider silently drops the variable fonts (`woff2-variations`).
- `site.url` is a `.invalid` placeholder until there's a domain; canonical, Open Graph and sitemap URLs all come from it.

## Workflow

- After any visual change: `npm run build && npm run shots` (and `-- --dark`), look at 1440 and 390, and check against the Avoid list before calling it done.
- Git: one-line commit messages; casual, human PR descriptions.
