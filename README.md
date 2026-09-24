# bereket.dev (working title)

My personal site: who I am, what I've built, and how to reach me.

Built with [Astro](https://astro.build) as a static site. No UI framework, about 3 KB of JavaScript, and fonts served from the site itself.

## Run it

```bash
nvm use          # Node 24
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/, deploy it to any static host
```

## Edit it

| I want to… | Edit |
|---|---|
| Change my bio, links, skills, experience, video, résumé | `src/config/site.ts` |
| Add or reorder a project | `projects/`. See [docs/ADDING-PROJECTS.md](docs/ADDING-PROJECTS.md) |
| Swap the portrait | Replace `src/assets/portrait.png` with a transparent PNG (or run `scripts/cutout.py` on a photo), then `npm run brand` |
| Change colours or type | `src/styles/tokens.css`, and check `/styleguide` for contrast |

Anything I haven't filled in yet shows on the page as a red `[PLACEHOLDER]`.

## Deploy

Any static host works. On Cloudflare Pages: build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=24`. Set the real domain in `site.url` in `src/config/site.ts` first, so the sitemap and link previews point to the right place.
