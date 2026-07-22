# PTEMagic Whole-Site Clone Report

## Target

- **URL:** `https://ptemagic.com.vn/`
- **Tech stack (original):** WordPress + Flatsome theme + WooCommerce + WPForms
- **Clone location:** `PTE_Thuy_30/ptemagic-clone/`
- **Clone stack:** Next.js 16 App Router, TypeScript, static export

## What was cloned

- **513 public routes** discovered and exported via WordPress REST API:
  - 48 pages (home, courses, about, contact, policies, recruitment, etc.)
  - 465 blog posts (news, reviews, tips, visa info, AI PTE, etc.)
- All routes pre-rendered as static HTML with `generateStaticParams`.
- Original CSS files downloaded and served locally (`public/css/`).
- Header and footer extracted from the live homepage and wrapped around every page.
- Lazy-load images fixed via inline script.
- PTEMagic absolute URLs rewritten to relative paths.

## Tooling used

- `agent-browser` – snapshot and screenshot of live pages
- `crawl4ai` – deep BFS crawl of `ptemagic.com.vn`
- `python` + `urllib` – WordPress REST API export
- `playwright` – screenshot verification
- `Next.js 16` static export – final clone delivery

## Verification screenshots

See `screenshots/` directory:

- `home.png` – homepage
- `course.png` – `/khoa-hoc-tieng-anh-pte/`
- `about.png` – `/gioi-thieu/`
- `contact.png` – `/lien-he/`
- `conversion.png` – `/bang-quy-doi-diem-pte/`
- `mock-exam.png` – `/thi-thu-pte-online/`
- `ai-post.png` – `/luyen-pte-bang-ai/`

## Known limitations

- WordPress shortcodes / dynamic carousels / sliders render as static HTML.
- Forms (WPForms) are non-functional; they are visual-only.
- Some original JS interactions (mobile menu toggle, search overlay) may not work because scripts are not re-injected.
- Authenticated pages (student dashboard, admin, my-account logged-in state) are **not** cloned because they require credentials.

## How to run

```bash
cd ptemagic-clone
pnpm install --ignore-workspace
pnpm build
python -m http.server 3001 --directory dist
```

Open `http://localhost:3001/`.

## Next step for authenticated pages

To clone login-required pages (student dashboard, admin panel, etc.), provide:

- Login URL
- Username / email
- Password

and the same pipeline can be re-run with `agent-browser` authenticated sessions.
