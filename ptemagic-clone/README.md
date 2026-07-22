# PTEMagic Whole-Site Clone

Standalone Next.js 16 static clone of the public PTEMagic website (`https://ptemagic.com.vn`).

## Scope

- 513 public pages and posts exported from WordPress REST API.
- Original CSS assets downloaded and served from `public/css/`.
- Header / footer extracted from live homepage HTML.
- Dynamic `[...slug]` route generates every page at build time.

## How to run locally

```bash
cd ptemagic-clone
pnpm install --ignore-workspace
pnpm build
npx serve -l 3001 dist
# or
python -m http.server 3001 --directory dist
```

Then open `http://localhost:3001/`.

## Project structure

- `src/app/[[...slug]]/page.tsx` – catch-all static page renderer
- `src/lib/wp-data.ts` – load pages/posts from `src/data/wp/`
- `src/lib/partials.ts` – load shared header/footer HTML
- `src/data/wp/` – exported WordPress content (manifest + per-item JSON)
- `public/css/` – original PTEMagic / Flatsome CSS files
- `public/partials/` – header.html / footer.html from live site

## Notes

- Lazy-loaded images are fixed at runtime by a small inline script.
- Original absolute links (`https://ptemagic.com.vn/...`) are rewritten to relative paths.
- Some interactive components (sliders, carousels, WPForms) are static; forms will not submit.
- Authenticated / student dashboard pages are **not** included; they require login credentials.
