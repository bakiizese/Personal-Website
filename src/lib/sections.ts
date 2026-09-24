import { site } from '../config/site';

/** Home page sections in order. A section with no content is left out unless showPlaceholders is on. */
const all = [
  { key: 'intro', visible: site.video.provider !== null },
  { key: 'work', visible: true },
  { key: 'about', visible: true },
  { key: 'experience', visible: site.experience.length > 0 },
  { key: 'testimonials', visible: site.testimonials.length > 0 },
  { key: 'contact', visible: true },
] as const;

export type SectionKey = (typeof all)[number]['key'];

const shown = all.filter((s) => s.visible || site.showPlaceholders).map((s) => s.key);

export const isShown = (key: SectionKey) => shown.includes(key);

/** "01", "02", … counted over the visible sections only, so numbering never skips. */
export const sectionNumber = (key: SectionKey) => String(shown.indexOf(key) + 1).padStart(2, '0');
