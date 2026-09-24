# Adding a project

Every project is one folder in `projects/`. The folder holds an `index.mdx` file (the details and the write-up) and its images. The site finds new folders automatically: there is no list to update anywhere else.

```
projects/
  _template/                    ← copy this; never published
  autonomous-ai-sre-platform/
    index.mdx                   ← details + write-up
    thumbnail.png               ← shown in the list and at the top of the project page
    screens/                    ← optional extra screenshots
```

## Add one in 5 steps

1. **Copy the template.** Pick a short, lowercase, hyphenated name. It becomes the URL (`/work/booking-tool`).

   ```bash
   cp -r projects/_template projects/booking-tool
   ```

2. **Add a thumbnail** to the new folder as `thumbnail.png` (or `.jpg` / `.webp`, and update the `thumbnail:` line to match). 16:10 works best, at least 1600×1000. A real screenshot is always better. If you don’t have one yet, generate a typographic cover (the title set in type):

   ```bash
   npm run thumbs -- booking-tool
   ```

3. **Fill in the frontmatter** at the top of `projects/booking-tool/index.mdx`. Every field is explained in comments in the template. Set `slug:` to the folder name.

4. **Write the Approach** below the second `---`. Use `##` headings for sections. Each heading shows up in the "On this page" list beside the text. Three to five short sections is plenty.

5. **Check it:**

   ```bash
   npm run build     # fails with a clear message if anything is missing
   npm run dev       # then open http://localhost:4321/work/booking-tool
   ```

## Fields

| Field | Required | What it's for |
|---|---|---|
| `title` | yes | The project name. |
| `slug` | yes | Must match the folder name. Lowercase letters, numbers, hyphens. |
| `summary` | yes | One line, max 160 characters. Shown in the list and as the page's description in search results. |
| `thumbnail` | yes | Path to the image, relative to `index.mdx`, e.g. `./thumbnail.png`. |
| `thumbnailAlt` | yes | What the image shows, for screen readers. |
| `year` | yes | `2026`, or a range in quotes: `"2024–26"`. |
| `role` | yes | What *you* did. "Sole developer", "Backend, team of 3". |
| `stack` | yes | Tools you used, most important first: `[React, Node.js, PostgreSQL]`. The list shows the first four. |
| `links` | no | Any of `live`, `repo`, `docs`, `caseStudy`, as full `https://` URLs. Leave out what you don't have. |
| `problem` | yes | 1–3 sentences: what was broken or missing, and for whom. |
| `outcome` | yes | 1–3 sentences: what changed. Only results you can back up. |
| `order` | yes | Position on the home page. Lower comes first. Must be unique. |
| `featured` | no | `true` shows it as the large spread at the top of Selected Work. Use it on one project only. |
| `status` | yes | `live`, `in-progress`, `complete`, `archived`, or `placeholder`. A `placeholder` project is hidden from the site (unless `showPlaceholders` is on in `src/config/site.ts`), so you can use it for drafts. |
| `screenshots` | no | Extra images for the project page. See below. |

## Reordering

Change the `order` numbers. Lower numbers appear first. Leave gaps (10, 20, 30…) so you can slot a new project between two others without renumbering everything. The number shown on the site ("No. 02") is the position, not the `order` value, so gaps never show.

## Featuring a different project

Set `featured: true` on the one you want and `featured: false` on the old one. If several are marked, the first by `order` wins.

## Screenshots

Put the images in the project folder (a `screens/` subfolder keeps it tidy), then list them:

```yaml
screenshots:
  - src: ./screens/dashboard.png
    alt: The admin dashboard, showing today's bookings
    caption: The admin dashboard.
```

They appear in a "Screens" section after the write-up. Images are resized and compressed automatically at build time, so add them at full resolution.

## The placeholder projects

`placeholder-project-one` and `placeholder-project-two` have `status: placeholder`, so they're hidden from the site. Set `showPlaceholders: true` in `src/config/site.ts` to see them while you work on the layout, or delete them when you no longer need them:

```bash
rm -r projects/placeholder-project-one projects/placeholder-project-two
```

## When the build fails

The build stops and tells you which file and field is wrong. The common ones:

| Message | Fix |
|---|---|
| `summary: summary is required` | Add the missing field named in the message. |
| `image "./thumbnail.png" not found in projects/…/` | The file isn't there, or its name doesn't match the `thumbnail:` line. Add it, or run `npm run thumbs -- <folder>`. |
| `slug "x" must match its folder name "y"` | Make `slug:` and the folder name the same. |
| `order 3 is already used by projects/…` | Pick an unused number. |
| `summary must be one line (160 characters max)` | Shorten it. The detail belongs in `problem` / `outcome`. |
| `must be a full URL starting with https://` | A link is missing its `https://`. |

## Writing tips

- Lead with the problem and who had it, not the technology.
- Say what *you* did, especially on team projects.
- Numbers only if they're real and you can explain how you got them.
- Plain first person. "I moved the payments behind an interface" beats "Architected a robust, scalable payment abstraction layer."
