import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const logo = await readFile(path.join(root, "public/brand/logo.svg"), "utf8");

const keep = ["swoosh", "t-stem", "tie"];
const parts = keep.map((name) => {
  const match = logo.match(new RegExp(`data-part="${name}"[^>]*d="([^"]+)"`));
  return { name, d: match[1] };
});

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const { d } of parts) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]);
    maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]);
    maxY = Math.max(maxY, nums[i + 1]);
  }
}

function markSvg(size, pct) {
  const bw = maxX - minX;
  const bh = maxY - minY;
  const target = size * pct;
  const scale = target / Math.max(bw, bh);
  const tx = (size - bw * scale) / 2 - minX * scale;
  const ty = (size - bh * scale) / 2 - minY * scale;
  const paths = parts
    .map(({ name, d }) => `<path d="${d}" fill="${name === "tie" ? "#EDB250" : "#F4EFE7"}" fill-rule="evenodd"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#7D0A17"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})">${paths}</g>
</svg>`;
}

const svg512 = markSvg(512, 0.68);
const icon = await sharp(Buffer.from(svg512)).resize(512, 512).png().toBuffer();
await writeFile(path.join(root, "src/app/icon.png"), icon);
const apple = await sharp(Buffer.from(markSvg(180, 0.68))).resize(180, 180).png().toBuffer();
await writeFile(path.join(root, "src/app/apple-icon.png"), apple);

const sizes = [16, 32];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(markSvg(s, 0.68))).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s === 256 ? 0 : s, e);
  header.writeUInt8(s === 256 ? 0 : s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile(path.join(root, "src/app/favicon.ico"), Buffer.concat([header, ...pngs]));
console.log("icons written", { icon: icon.length, apple: apple.length, ico: offset });
