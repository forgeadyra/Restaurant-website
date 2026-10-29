// Netlify build: copies the public site into dist/ and adds a content hash to
// every CSS, JS, image and font reference (style.css -> style.css?v=1a2b3c4d5e).
// That lets netlify.toml cache those files for a year: when a file changes, its
// URL changes, so visitors never get a stale copy. Source files are not modified.
// Run locally with: npm run build
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

const PUBLIC = [
  "index.html", "privacy.html", "thank-you.html",
  "style.css", "script.js",
  "images", "fonts",
  "favicon.svg", "favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png",
  "og-image.jpg", "site.webmanifest", "robots.txt", "sitemap.xml",
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist);
for (const item of PUBLIC) {
  await cp(path.join(root, item), path.join(dist, item), { recursive: true });
}

const hash = async (file) => createHash("sha256").update(await readFile(path.join(dist, file))).digest("hex").slice(0, 10);

// Paths as they appear in the source: images/x.webp, fonts/x.woff2, style.css, script.js
const REF = /(?<![\w/.-])((?:images|fonts)\/[\w.-]+\.(?:jpe?g|webp|png|woff2)|style\.css|script\.js)(?=["')\s])/g;

const textFiles = (await readdir(dist)).filter((f) => /\.(html|css|js)$/.test(f));
const hashes = new Map();
let rewritten = 0;
for (const file of textFiles) {
  const full = path.join(dist, file);
  const source = await readFile(full, "utf8");
  let out = "";
  let last = 0;
  for (const match of source.matchAll(REF)) {
    const ref = match[1];
    if (!hashes.has(ref)) hashes.set(ref, await hash(ref));
    out += source.slice(last, match.index) + `${ref}?v=${hashes.get(ref)}`;
    last = match.index + ref.length;
    rewritten++;
  }
  await writeFile(full, out + source.slice(last));
}

console.log(`Built dist/ with ${PUBLIC.length} entries; fingerprinted ${rewritten} references to ${hashes.size} files.`);
