# Cupertino FBLA website

The website for the Cupertino High School chapter of Future Business Leaders of America.

Live site: https://cupertino-fbla.vercel.app

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com), configured in `src/app/globals.css`
- [GSAP](https://gsap.com) with ScrollTrigger and SplitText for animation, and [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- [Phosphor Icons](https://phosphoricons.com)
- Deployed on [Vercel](https://vercel.com)

## Getting started

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server on port 3000 |
| `npm run build` | Builds the production site |
| `npm run start` | Serves the production build |
| `npm run lint` | Runs ESLint |
| `npm run photos` | Rebuilds the optimized photos in `src/assets/photos` from the originals in `media-source/` |
| `npm run shoot` | Takes Playwright screenshots of every page at desktop and mobile widths |
| `node scripts/verify-links.mjs` | Clicks through every navigation, footer, and in-page link |
| `node scripts/make-icons.mjs` | Rebuilds the favicon and app icons |

The screenshot and link scripts need a running dev server and the Playwright browser (`npx playwright install chromium`).

## Editing content

All text, names, and numbers live in `src/content/`, so most updates never touch a component:

| File | Contents |
| --- | --- |
| `site.ts` | Page copy, links, contact details, and which photo appears where |
| `officers.ts` | The officer team, grouped by department |
| `results.ts` | Competition placements by conference |
| `photos.ts` | Alt text and captions for every photo |

To add a photo, put the original in `media-source/`, add a crop for it in `scripts/process-photos.mjs`, run `npm run photos`, then register it in `src/content/photos.ts` and `src/content/media.ts`.

## Project structure

```
src/
  app/          Routes, metadata, icons, sitemap, robots
  components/   UI, split by area (home, team, results, join, shell, brand)
  content/      All site copy and data
  assets/       Optimized photos
  lib/          GSAP setup and helpers
public/         Fonts, the logo SVG, and the chapter video
media-source/   Original photos and logo artwork
scripts/        Photo processing, icons, screenshots, and link checks
```

## Deployment

The site deploys to Vercel. `vercel.json` sets the framework to Next.js.

```bash
vercel --prod
```

`NEXT_PUBLIC_SITE_URL` sets the canonical URL for metadata, the sitemap, and robots. If it isn't set, the site uses the Vercel production domain.

## Accessibility and motion

All animation respects the reduce motion setting. With it turned on, every section renders fully visible without movement, and the intro and autoplaying video are skipped.

## License

The source code is released under the [MIT License](LICENSE).

The photos, video, and chapter logo belong to Cupertino High School FBLA and the people pictured. They are not covered by the MIT License and may not be reused without permission. The FBLA name and emblem belong to Future Business Leaders of America.
