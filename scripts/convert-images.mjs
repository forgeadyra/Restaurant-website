// Converts every JPG/PNG in images/ to WebP next to the original.
// Max 1600px wide (never upscales), quality 80. Run with: npm run images
//
// Images listed in CROP are centre-cropped to the aspect ratio the page shows
// them at (the same crop CSS object-fit: cover makes), so we don't ship pixels
// that are never visible. If you change an image's aspect-ratio in style.css,
// update it here too, rerun, and update the width/height in the HTML.
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CROP = {
  "about-rooftop-terrace": 6 / 7, // .bigger
  "about-dining-room": 1, // .smaller
  "gallery-tree-atrium": 1, // .left_img
  "gallery-banquette": 3 / 2, // .right_img1
  "gallery-dining-lounge": 1, // .right_img2
  "thandai-kulfi": 1, // menu card
  "mango-shake": 1, // menu card
};

const dir = path.resolve(import.meta.dirname, "..", "images");
const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const name = file.replace(/\.(jpe?g|png)$/i, "");
  const input = path.join(dir, file);
  const output = path.join(dir, `${name}.webp`);

  let image = sharp(input);
  const ratio = CROP[name];
  if (ratio) {
    const { width, height } = await image.metadata();
    const cropWidth = Math.min(width, Math.round(height * ratio));
    const cropHeight = Math.min(height, Math.round(cropWidth / ratio));
    image = image.extract({
      left: Math.round((width - cropWidth) / 2),
      top: Math.round((height - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
    });
  }

  const info = await image
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`${file} -> ${name}.webp (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
