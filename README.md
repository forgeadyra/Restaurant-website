# Restaurant-website
A responsive restaurant website built with HTML, CSS, and JavaScript.

## Working on it
Edit the files in the project root and open `index.html` in a browser to preview.

## Images
Images live in `images/`. To regenerate the WebP versions (max 1600px wide, quality 80) after adding or replacing a JPG/PNG:

```sh
npm install
npm run images
```

To rebuild the favicons and the social-sharing image (`og-image.jpg`) after changing `favicon.svg` or the hero photo:

```sh
npm run brand-assets
```

## Deploying
Netlify runs `npm run build` (see `netlify.toml`), which copies the public files into `dist/` and adds a content hash to CSS, JS, image and font URLs so they can be cached for a year. To check the build locally:

```sh
npm run build
```
