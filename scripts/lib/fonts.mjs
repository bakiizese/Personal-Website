// @font-face rules for the site's fonts, embedded as data URIs.
// Chromium won't load file:// fonts or images into a page set from about:blank, so the
// image-generating scripts inline them instead.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './frontmatter.mjs';

const file = (pkg, name) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'node_modules', pkg, 'files', name)).toString('base64')}`;

// Family names are prefixed so they can't collide with generic keywords like `serif`.
export const fontFaces = `
  @font-face { font-family: 'BZ Serif'; font-style: normal; font-weight: 200 800; src: url(${file('@fontsource-variable/newsreader', 'newsreader-latin-standard-normal.woff2')}) format('woff2'); }
  @font-face { font-family: 'BZ Serif'; font-style: italic; font-weight: 200 800; src: url(${file('@fontsource-variable/newsreader', 'newsreader-latin-standard-italic.woff2')}) format('woff2'); }
  @font-face { font-family: 'BZ Sans'; font-weight: 100 900; src: url(${file('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2')}) format('woff2'); }
  @font-face { font-family: 'BZ Mono'; font-weight: 100 900; src: url(${file('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2')}) format('woff2'); }
`;
