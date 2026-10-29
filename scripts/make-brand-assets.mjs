// Generates favicon.ico, apple-touch-icon.png, the manifest icons and the
// 1200x630 og-image.jpg. Run with: npm run brand-assets
// Sources: favicon.svg (the "A" monogram) and images/hero-dining-room.jpg.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const out = (file) => path.join(root, file);

const svg = await readFile(out("favicon.svg"), "utf8");
// Apple and manifest icons get square corners; the OS applies its own mask
const squareSvg = Buffer.from(svg.replace(/ rx="\d+"/, ""));
const png = (source, size) => sharp(source, { density: 600 }).resize(size, size).png().toBuffer();

// favicon.ico: PNG-compressed entries at 16, 32 and 48px
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((size) => png(Buffer.from(svg), size)));
await writeFile(out("favicon.ico"), buildIco(icoSizes, icoImages));

await writeFile(out("apple-touch-icon.png"), await png(squareSvg, 180));
await writeFile(out("icon-192.png"), await png(squareSvg, 192));
await writeFile(out("icon-512.png"), await png(squareSvg, 512));

// og-image.jpg: hero photo, darkened, with the name and tagline on top
const ogText = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#090603" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#090603" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="96" fill="#f0eeec" letter-spacing="4">Adyra</text>
  <text x="600" y="350" text-anchor="middle" font-family="Georgia, serif"
        font-size="22" fill="#c8ab71" letter-spacing="10">FINE DINING · MATHURA</text>
  <rect x="560" y="385" width="80" height="1" fill="#c8ab71"/>
  <text x="600" y="440" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
        font-size="40" fill="#f0eeec">Where Every Meal Becomes a Memory</text>
</svg>`);

await sharp(out("images/hero-dining-room.jpg"))
  .resize(1200, 630, { fit: "cover" })
  .composite([{ input: ogText }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(out("og-image.jpg"));

console.log("Wrote favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.jpg");

function buildIco(sizes, images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map((data, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[i] % 256, 0); // width (0 means 256)
    entry.writeUInt8(sizes[i] % 256, 1); // height
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}
