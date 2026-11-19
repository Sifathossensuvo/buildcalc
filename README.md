# BuildCalc – Construction & Home Improvement Calculators

React + Vite + Tailwind CSS + React Router + Framer Motion + Lucide + React Helmet Async.
20 working calculators, light/dark mode, favorites, recently used, search (Ctrl/⌘ + K), guides, and a full SEO setup.

## Run locally

Requires Node.js 18 or newer (https://nodejs.org).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # checks all 20 calculators against known answers (no browser needed)
```

## Build for production

```bash
cp .env.example .env      # Windows: copy .env.example .env
# open .env and set VITE_SITE_URL=https://your-real-domain.com
npm run build
npm run preview           # test the production build locally
```

`npm run build` also runs `scripts/postbuild.mjs`, which writes a separate, crawlable HTML file for every page
(unique title, description, canonical, Open Graph, JSON-LD and readable text), plus `sitemap.xml` and `robots.txt`.

## Deploy (free options)

- **Vercel / Netlify / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
  Add the environment variable `VITE_SITE_URL` in the host's settings. `vercel.json` and `public/_redirects` are included.

## SEO checklist after launch

1. Set `VITE_SITE_URL` to your real domain *before* building (canonicals and sitemap depend on it).
2. Replace `hello@your-domain.com` in `src/config/site.js`.
3. Add the site in Google Search Console and Bing Webmaster Tools, then submit `https://your-domain.com/sitemap.xml`.
4. Keep adding guides in `src/data/guides.js` and calculators in `src/data/calc/*.js`. New entries automatically get a page, sitemap entry and internal links.
5. Get a few relevant backlinks (building forums, DIY communities, local directories). Content alone will not rank a new domain.

## Add a calculator

Add an object to a file in `src/data/calc/` (fields, `compute`, `formula`, `about`, `faqs`). Fields use units
(`dim: 'len' | 'dep' | 'sm' | 'area' | 'vol' | 'cov' | 'dens'`) and `compute()` always receives SI values (metres, m², m³).
Add a case to `scripts/test-calculators.mjs`, then run `npm test`.
