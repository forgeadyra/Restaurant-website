# Adyra Fine Dining — Project Rules

## What this is
- "Adyra Fine Dining" is a **concept** restaurant website built by AdyraForge (founder: Aditya Singh) as a portfolio piece. It is **not a real restaurant**.
- Static site: HTML / CSS / vanilla JS. No frameworks. Deployed on Netlify.
- The source files are the site; edit them directly and open `index.html` to preview. The only build step is `scripts/build.mjs` (run by Netlify, or `npm run build`): it copies the public files into `dist/` and adds `?v=<hash>` to CSS/JS/image/font URLs. Never edit `dist/` (it's regenerated and git-ignored).
- New public files (a page, an icon, etc.) must be added to the `PUBLIC` list in `scripts/build.mjs`, or they won't be deployed.
- Vegetarian fine dining in Mathura, India. Prices in INR (₹). No alcohol, no bar.

## Content rules
- Never use lorem ipsum or placeholder text.
- Never invent awards, ratings, or reviews (e.g. no Michelin stars, star ratings, testimonials).
- Visible text uses typographic apostrophes and dashes (’ — –), never straight `'` in copy.
- All business facts (hours, address, phone, email, founding year, menu items, prices, seating, etc.) must come from the FACTS section below. Never contradict them. If a fact is needed and isn't listed, ask instead of making one up.

- The menu (dishes, prices, descriptions, photos) lives only in the `MENU` array in `script.js`. Edit it there, not in the HTML. Prices are plain numbers in INR, exclusive of GST.

## Portfolio credit
- Every page has the dismissible banner (`.concept-banner`, right after the skip link): "Concept website designed & developed by AdyraForge". Dismissal is stored in `localStorage` key `adyra-banner-dismissed`; the `<head>` script hides it before first paint on later visits.
- Every footer ends with `.credit`: "Concept design by Aditya Singh, Founder of AdyraForge — want a site like this for your restaurant?"
- Copyright reads "© 2026 Adyra Fine Dining (concept). All rights reserved."
- Keep these quiet: small, muted (`#958774` text, `#c0a887` for the linked words), never larger or brighter than the restaurant's own content.
- AdyraForge URL: not provided yet. Contact/WhatsApp link: not provided yet. Until they are, "AdyraForge" and "want a site like this…" are plain `<span>`s (styled like links). Don't invent URLs; when provided, turn `<span class="concept-banner__brand">` and `<span class="credit__cta">` into `<a>` with the same class on all three pages.

## Pages and links
- Three pages: `index.html`, `privacy.html`, `thank-you.html`. The header and footer are copied into all three. Any change to one must be made in the others.
- Section ids: `#about`, `#menu`, `#gallery`, `#reservations`, `#contact` (the footer). Links from `privacy.html` use `index.html#…`.
- Never use `href="#"`. No social media links (there are no accounts). Phone uses `tel:`, email uses `mailto:`, address links to Google Maps.
- The reservation form is a Netlify Form (`name="reservation"`, redirects to `/thank-you.html`). If you add a field, give it a `name` and update the "What we collect" list in `privacy.html`. Changing field names needs a redeploy before Netlify records them.
- Form time slots must sit inside the FACTS hours: lunch 12:30–2:30 PM, dinner 7:00–9:30 PM, every 30 minutes. Guests 1–6; 7 or more must call.
- Validation messages live in `RESERVATION_RULES` in `script.js`. Keep the HTML `pattern` on the phone field in sync with `PHONE_PATTERN`.

## SEO
- Base URL: https://adyra-restaurant.netlify.app. Used by canonical, og:url, og:image, JSON-LD, robots.txt and sitemap.xml. If the domain changes, update all of them.
- Headings: exactly one `<h1>` per page (homepage: the hero tagline; the logo is not a heading). One `<h2>` per section, `<h3>` inside. Small labels above titles ("Our Story", "The Space") are `<p>`, not headings.
- The Restaurant JSON-LD in `index.html` must match FACTS (hours, address, phone). Update it whenever FACTS change.
- New indexable pages go in `sitemap.xml`. `thank-you.html` stays `noindex` and out of the sitemap.
- `favicon.svg` is the source for all icons. After editing it or replacing the hero image, run `npm run brand-assets` to regenerate favicon.ico, apple-touch-icon.png, icon-192/512.png and og-image.jpg.

## Responsive and accessibility
- Must work with no horizontal scroll at 360, 390, 768, 1024 and 1440px. No fixed pixel widths on layout containers or images. Use `max-width`, `clamp()` and `aspect-ratio` + `object-fit: cover`.
- Breakpoints in `style.css`: 1100px (About and Reservations stack), 1000px (footer stacks), 900px (hamburger), 767px (gallery stacks, 44px tap targets), 600px (form rows stack, smaller header).
- Tap targets on mobile at least 44×44px (links inside sentences are exempt).
- Text contrast WCAG AA (4.5:1, or 3:1 for text 24px+). Known-safe colours on the dark background: `#c0a887`, `#958774` (hints/placeholders, the dimmest allowed), `#f1d7a7` (hover/active). Prices on the brown cards use `#f2b866`. Don't use `#78582f` or `#7f725f` for small text.
- Never remove focus outlines. `:focus-visible` gives a 2px `#f1d7a7` ring everywhere.
- Every page starts with the skip link (`<a class="skip-link" href="#main">`) and has `<main id="main" tabindex="-1">`.
- `<head>` sets `html.js`; scroll-reveal hiding only applies under `.js` so content is visible if JS fails. Animations are off under `prefers-reduced-motion`.

## Design rules
- Keep the current visual style unless told otherwise: dark background (`#090603`, header `#120d0a`), gold accents (`#c8ab71`, `#c0a887`, `#cb9221`), ivory headings, Cormorant Garamond for display headings, large italic serif headlines and thin gold dividers.

## Performance
- Target: Lighthouse mobile 90+ on all four categories (last measured: 99/100/100/100 on the homepage).
- Fonts are self-hosted in `fonts/` (Cormorant Garamond, Latin subset: one variable upright file for 400–700, one italic 400). Don't add Google Fonts links or other font weights; if a new weight/style is needed, add its woff2 and `@font-face`.
- `index.html` preloads the hero WebP and the italic font (the hero headline). Other pages preload the upright font. Keep preloads in sync if the hero image or fonts change.
- No third-party requests on page load. `script.js` stays `defer`.
- `netlify.toml` caches `/images/*`, `/fonts/*`, `*.css`, `*.js` for a year (`immutable`). That's only safe because the build fingerprints their URLs, so always deploy through the build.

## Images
- All images live in `images/`, named in lowercase-kebab-case (no spaces or parentheses). Paths use forward slashes.
- After adding or replacing a JPG/PNG, run `npm install` (once) then `npm run images` to generate the WebP versions (max 1600px wide, quality 80). Commit both files.
- WebPs listed in `CROP` in `scripts/convert-images.mjs` are centre-cropped to the aspect ratio CSS displays them at (the JPGs stay uncropped as sources). If an image's `aspect-ratio` changes in `style.css`, update `CROP` too.
- Markup: `<picture>` with a WebP `<source>` and a JPG `<img>` fallback. Every `<img>` below the hero gets `loading="lazy"` and `width`/`height` set to the **WebP's** pixel size (printed by `npm run images`). The hero is a CSS background using `image-set()`.
- Alt text describes what's actually in the photo; purely decorative images get `alt=""`.
- Only use free-license images (Unsplash, Pexels). No photos showing bars, bottles or alcohol.

## FACTS

- Name: Adyra Fine Dining (short form: Adyra). Use these exact spellings everywhere.
- Tagline: Where Every Meal Becomes a Memory
- Established: 2026, Mathura
- Cuisine: Modern Indian vegetarian fine dining, rooted in Braj food traditions
- Hours: Tuesday–Sunday. Lunch 12:30 PM–3:30 PM, Dinner 7:00 PM–11:00 PM. Closed Mondays.
- Address: Adyra Fine Dining, Civil Lines, Mathura, Uttar Pradesh 281001, India
- Phone: +91 565 000 0000 (fictional, concept site)
- Email: hello@adyrafinedining.com (only this one)
- Seats: 48
- No bar, no alcohol.
