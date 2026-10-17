# Cupertino FBLA website

## Stack
- Next.js 16.4 (App Router, `src/`), React 19.3, TypeScript 5.9
- Tailwind CSS v4, CSS-first config (`@theme` tokens in `src/app/globals.css`, no tailwind.config)
- GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG, Flip, Draggable + Inertia) with `@gsap/react` `useGSAP`; Lenis 1.3 smooth scroll driven by the GSAP ticker (`src/components/shell/Motion.tsx`)
- Fonts: restricted to the user's approved list. SF Pro Text is the system font for headlines and body (Helvetica Neue, then Arial as fallbacks). Georgia is the serif for accents and quotes. SF Mono or Menlo is the mono. KaTeX_SansSerif, KaTeX_Main, and KaTeX_Typewriter are self-hosted in `public/fonts/katex` as the last fallback, so Android and Linux never fall back to Roboto. Don't add any other font families. SF Pro can't be self-hosted. `scripts/check-fonts.mjs` lists the fonts actually used for rendering.

## Commands
- `npm run dev`: dev server on http://localhost:3000
- `npm run build` / `npm run lint`: must both pass with zero errors and warnings
- `npm run photos`: regenerate `src/assets/photos/*.jpg` from `media-source/` (crops live in `scripts/process-photos.mjs`)
- `npm run shoot`: Playwright screenshots of every page at 1440, 1728, and 390 wide into `/tmp/fbla-shots`
- `node scripts/verify-links.mjs`: clicks through every nav, footer, and in-page link
- `node scripts/make-icons.mjs`: regenerate `src/app/icon.png`, `apple-icon.png`, `favicon.ico`
- `vercel --prod`: deploy to production at https://cupertino-fbla.vercel.app. This is the Vercel project `cupertino-fbla` in `smaranzs-projects`, linked through `.vercel/`. `vercel.json` pins the framework to Next.js; without it the project falls back to "Other" and serves 404s. `media-source/` is excluded from uploads via `.vercelignore`.

## Content
- All copy, names, and numbers live in `src/content/`:
  - `site.ts` holds the page copy and links
  - `officers.ts` is the 2026–27 officer team, transcribed from `media-source/CHS FBLA ORG STRUCTURE 26-27.png`
  - `results.ts` is the past placements
  - `photos.ts` holds alt text and captions
- Edit content there, never inside components.
- Original media lives in `media-source/`; images from the old Lovable site are in `media-source/old-site/`. The logo vector (`src/components/brand/logo-paths.ts`) was traced from `media-source/logo-tino-fbla-hires.png`.
- `NEXT_PUBLIC_SITE_URL` sets the canonical URL used by metadata, the sitemap, and robots. It's optional: `src/lib/site-url.ts` falls back to Vercel's production domain, then the deployment URL, then localhost.

## Design rules
- No emojis. Labels are sentence case; no tiny letter-spaced uppercase labels and no eyebrow labels above headings.
- Don't join facts with a middot in visible UI.
- Mark active states with color, weight, or a dot, never a colored edge stripe.
- Write lengths in rem or Tailwind scale steps. Use only the z-index variables in `globals.css`.
- Every section uses the shared container so left edges line up across pages.
- All motion goes through `gsap.matchMedia()`. Reduced motion gets a static, fully visible page. Counters render their final value in HTML and only count up when triggered.
- Animate only transform, opacity, and clip-path.
