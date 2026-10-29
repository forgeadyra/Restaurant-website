# Adyra Fine Dining — Project Rules

## What this is
- "Adyra Fine Dining" is a **concept** restaurant website built by AdyraForge (founder: Aditya Singh) as a portfolio piece. It is **not a real restaurant**.
- Static site: HTML / CSS / vanilla JS. No build step, no frameworks. Deployed on Netlify.
- Vegetarian fine dining in Mathura, India. Prices in INR (₹). No alcohol, no bar.

## Content rules
- Never use lorem ipsum or placeholder text.
- Never invent awards, ratings, or reviews (e.g. no Michelin stars, star ratings, testimonials).
- All business facts (hours, address, phone, email, founding year, menu items, prices, seating, etc.) must come from the FACTS section below. Never contradict them. If a fact is needed and isn't listed, ask instead of making one up.

- The menu (dishes, prices, descriptions, photos) lives only in the `MENU` array in `script.js`. Edit it there, not in the HTML. Prices are plain numbers in INR, exclusive of GST.

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

## Design rules
- Keep the current visual style unless told otherwise: dark background, gold/ivory/coffee palette (`--adyra-*` variables in `style.css`), Cormorant Garamond for display headings, large italic serif headlines, gold accents and thin gold dividers.

## Images
- All images live in `images/`, named in lowercase-kebab-case (no spaces or parentheses). Paths use forward slashes.
- After adding or replacing a JPG/PNG, run `npm install` (once) then `npm run images` to generate the WebP versions (max 1600px wide, quality 80). Commit both files.
- Markup: `<picture>` with a WebP `<source>` and a JPG `<img>` fallback. Every `<img>` below the hero gets `loading="lazy"` and `width`/`height` set to the file's real pixel size. The hero is a CSS background using `image-set()`.
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
