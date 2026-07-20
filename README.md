# Clark's Electronic Solutions — Website

Pure static HTML/CSS/vanilla JS site. No framework, no build step, no npm. Every page is a standalone `.html` file that links to a shared `styles.css` and `main.js` via relative paths, so it works at any domain root.

## Deploying to Cloudflare Pages via GitHub

1. Push this folder to a GitHub repository (e.g. `git init`, `git add .`, `git commit`, then push to a new repo).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave blank)
   - **Build output directory:** `/` (repo root)
4. Deploy. Cloudflare Pages will serve the static files directly — no build step runs.
5. Once live, update the `[TBD]` placeholders below (see next section), commit, and push again to redeploy.
6. If you connect a custom domain (`clarkselectronicsolutions.com`), confirm it in Cloudflare Pages → Custom Domains. All internal links are relative, so the site works whether it's served from the apex domain, a `pages.dev` subdomain, or a preview URL.

## `[TBD]` Placeholders to Fill Before Launch

Search the codebase for `TBD` to find every instance. They are:

| Placeholder | Where it appears | What to do |
|---|---|---|
| `YOUR_FORM_ID` | Booking form `action` in `index.html` and `contact.html` | Create a form at [Formspree](https://formspree.io) and replace `https://formspree.io/f/YOUR_FORM_ID` with your real endpoint. |

Resolved and no longer placeholders: street address (503 W 29th Ave, Pine Bluff, AR 71603 — set in every page's JSON-LD plus About/Contact body copy), business hours (set in every page's JSON-LD `openingHours` plus Contact page), and the Google Maps embed on `contact.html` (live iframe, not a placeholder). Social media footer links and the "leave a Google review" link were removed from the site entirely per request — there is currently no outbound link to the business's Facebook/Instagram/TikTok/Google review page anywhere on the site. If you want those back, they'll need to be re-added along with real (not placeholder) URLs.

## Logo Note

`clarks-logo.png` (in the project root) is the original source logo. Its baked-in text is misspelled ("CLAR'S", "ELECTTRONIC SOLUTIIONS"), so **the text portion of that image is never displayed anywhere on the site.**

Instead:
- `assets/img/clarks-emblem.jpg` is a cropped version containing only the ram/shield emblem (the text was cropped out entirely, not just hidden).
- Everywhere the emblem image is used (header, footer, hero), a CSS `mask-image` radial gradient softens its rectangular edges into a vignette so it blends into the dark background.
- The wordmark ("CLARK'S" / "ELECTRONIC SOLUTIONS") is live text set in the site's display font, never part of the image.

If you regenerate or replace the logo in the future, re-crop it the same way and keep the wordmark as live text.

## Structure

```
/index.html
/phone-repair.html
/services/{computer,tablet,game-console,business}-repair-or-services.html
/areas/{pine-bluff,white-hall,stuttgart,el-dorado}-ar.html
/contact.html /privacy.html /terms.html
/styles.css /main.js
/assets/img/clarks-emblem.jpg
/sitemap.xml /robots.txt
```
