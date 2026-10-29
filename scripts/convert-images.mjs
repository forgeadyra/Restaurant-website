// Converts every JPG/PNG in images/ to WebP next to the original.
// Max 1600px wide (never upscales), quality 80. Run with: npm run images
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve(import.meta.dirname, "..", "images");
const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace(/\.(jpe?g|png)$/i, ".webp"));
  const info = await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`${file} -> ${path.basename(output)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
