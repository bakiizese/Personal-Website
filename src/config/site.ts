/**
 * All personal content for the site lives here. Edit this file, not the components.
 *
 * Conventions:
 *   - `null` means "not provided yet". The page renders a visible [PLACEHOLDER] in its place.
 *   - Lines marked `REVIEW:` are copy I drafted for you. Read them and rewrite in your own words.
 *   - Projects are NOT here. They live in /projects (see docs/ADDING-PROJECTS.md).
 */

export type Link = { label: string; href: string | null };

export type ExperienceItem = {
  start: string; // e.g. "2024-03" or "2024"
  end: string | null; // null = present
  role: string;
  org: string;
  orgUrl?: string;
  summary: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string; // e.g. "CTO, Company" or "Upwork client"
  url?: string; // link to the source (Upwork review, LinkedIn recommendation)
};

export type Video =
  | { provider: 'youtube' | 'vimeo'; id: string; title: string; duration: string; poster?: string; transcript?: string }
  | { provider: 'file'; src: string; captions?: string; title: string; duration: string; poster?: string; transcript?: string }
  | { provider: null };

export const site = {
  /** Full origin, no trailing slash. [PLACEHOLDER] until you have a domain. `.invalid` is a reserved TLD. */
  url: 'https://placeholder.invalid',

  name: 'Bereket Zeselassie',
  firstName: 'Bereket',
  lastName: 'Zeselassie',
  monogram: 'BZ',

  role: 'Full-Stack Developer',
  roleFocus: 'React, Node.js & AI agent systems',

  // REVIEW: the one sentence under your name in the hero.
  intro:
    'I build web and mobile products end to end: React front ends, Node and Python APIs, and AI agents that do useful work under human review.',

  // REVIEW: meta description used by search engines and link previews (max ~155 characters).
  description:
    'Bereket Zeselassie, full-stack developer in Addis Ababa. React, Node.js, Python and AI agent systems. Open to full-time and freelance work.',

  location: 'Addis Ababa, Ethiopia',
  timezone: { label: 'EAT', offset: 'UTC+3', iana: 'Africa/Addis_Ababa' },

  availability: {
    open: true,
    label: 'Available for full-time & freelance work',
    detail: 'Remote',
  },

  email: 'bereketzeselassie@gmail.com',

  /** Shown in the hero and contact section, in this order. `href: null` renders a placeholder. */
  links: [
    { label: 'GitHub', href: 'https://github.com/bakiizese' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bereket-zeselassie-embaye' },
    { label: 'Upwork', href: null }, // [PLACEHOLDER] your Upwork profile URL
    { label: 'Telegram', href: 'https://t.me/bereket_zeselassie' },
  ] satisfies Link[],

  /** Path under /public, e.g. '/resume/bereket-zeselassie.pdf'. null = placeholder. */
  resume: null as string | null,

  /**
   * The hero portrait. Replace the file at src/assets/portrait.png with a transparent PNG
   * (cut-out, at least 1600px tall). Keep the same filename and nothing else needs to change.
   * To cut out a new photo: see scripts/cutout.py.
   */
  portrait: {
    alt: 'Bereket Zeselassie, smiling, wearing glasses and a white shirt',
  },

  // REVIEW: the about paragraph(s). First person, plain.
  about: [
    'I’m a full-stack developer based in Addis Ababa. I usually build the whole thing: the API and database, the admin panel people use at a desk, and the mobile app they carry around.',
    'Lately most of my work is AI agents that take real actions, like opening pull requests or triaging logs. The part I care about is keeping a person in control of what the agent is allowed to do.',
  ],

  // REVIEW: grouped from what your repos actually use. Move items between groups to match reality.
  skills: [
    {
      group: 'Daily',
      items: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Express', 'Python', 'FastAPI', 'Flask', 'PostgreSQL'],
    },
    {
      group: 'Comfortable with',
      items: ['React Native & Expo', 'MySQL', 'Redis', 'SQLAlchemy & Alembic', 'Sequelize', 'Socket.IO', 'LangGraph', 'Gemini API', 'Tailwind CSS'],
    },
    {
      group: 'Tooling & infra',
      items: ['Docker', 'GitHub Actions', 'pytest', 'Vitest', 'Linux', 'Render', 'Cloudflare Pages', 'Neon'],
    },
  ],

  /** Newest first. Empty array renders a placeholder. */
  experience: [] as ExperienceItem[], // [PLACEHOLDER]

  /** Only real testimonials, with permission. Empty array renders a placeholder. */
  testimonials: [] as Testimonial[], // [PLACEHOLDER]

  /**
   * Intro video. Pick one:
   *   { provider: 'youtube', id: 'dQw4w9WgXcQ', title: '…', duration: '90 sec', poster: '/video/poster.jpg' }
   *   { provider: 'vimeo',   id: '123456789',   title: '…', duration: '90 sec' }
   *   { provider: 'file',    src: '/video/intro.mp4', captions: '/video/intro.en.vtt', title: '…', duration: '90 sec' }
   *   { provider: null }  → shows a placeholder
   */
  video: { provider: null } as Video, // [PLACEHOLDER]

  contact: {
    // REVIEW: the headline of the contact section.
    heading: 'Tell me what you’re *building*.',
    // REVIEW: what helps in a first message. Shown beside the email address.
    note: 'A few lines on the project, the timeline, and whether it’s a full-time role or freelance work is plenty. I reply to every message.',
  },

  // REVIEW: the short line beside the video.
  videoNote: 'Ninety seconds on who I am, how I work, and the kind of projects I want to take on next.',
} as const;

export type Site = typeof site;
