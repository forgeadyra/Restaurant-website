# Adyra Fine Dining — Project Rules

## What this is
- "Adyra Fine Dining" is a **concept** restaurant website built by AdyraForge (founder: Aditya Singh) as a portfolio piece. It is **not a real restaurant**.
- Static site: HTML / CSS / vanilla JS. No build step, no frameworks. Deployed on Netlify.
- Vegetarian fine dining in Mathura, India. Prices in INR (₹). No alcohol, no bar.

## Content rules
- Never use lorem ipsum or placeholder text.
- Never invent awards, ratings, or reviews (e.g. no Michelin stars, star ratings, testimonials).
- All business facts (hours, address, phone, email, founding year, menu items, prices, seating, etc.) must come from the FACTS section below. Never contradict them. If a fact is needed and isn't listed, ask instead of making one up.

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
