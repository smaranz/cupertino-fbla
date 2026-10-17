import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (file) => path.join(root, "media-source", file);
const out = path.join(root, "src/assets/photos");

const jobs = {
  "chapter-anaheim": { file: "4S3A0145.JPG" },
  "slc-awards-stage": { file: "4S3A0675.JPG", crop: { top: 0.05, bottom: 0.7 } },
  "candid-profile": { file: "4S3A9754.JPG" },
  "candid-focus": { file: "4S3A9818.JPG" },
  "nlc-san-antonio": { file: "DSC06859.JPG" },
  "nlc-lineup": { file: "DSC06878.JPG" },
  "nlc-applause": { file: "DSC06888.JPG" },
  "nlc-trophies": { file: "DSC06918.JPG" },
  "nlc-trophies-kneel": { file: "DSC06923.JPG" },
  "nlc-stage-trophy": { file: "IMG_1094.JPG" },
  "nlc-handshake": { file: "IMG_2248.JPG" },
  "nlc-award-line": { file: "IMG_8961.JPG" },
  "project-sliced": { file: "old-site/project-sliced.png", extract: { left: 6, top: 6, width: 1471, height: 1482 } },
  "project-pink-lemonade": { file: "old-site/project-pink-lemonade.png" },
  "project-forged": { file: "old-site/project-forged.png" },
  "project-unlocked": { file: "old-site/project-unlocked.png" },
  "bslc-homestead": { file: "old-site/bslc-homestead.png" },
  "chapter-maroon-blazers": { file: "old-site/chapter-maroon-blazers.png" },
  "nlc-website-design-stage": { file: "old-site/nlc-website-design-stage.png" },
  "nlc-website-design-trophies": { file: "old-site/nlc-website-design-trophies.png" },
};

await mkdir(out, { recursive: true });

for (const [slug, job] of Object.entries(jobs)) {
  const oriented = await sharp(src(job.file)).rotate().toBuffer({ resolveWithObject: true });
  let pipeline = sharp(oriented.data);
  const { width, height } = oriented.info;

  if (job.extract) {
    pipeline = pipeline.extract(job.extract);
  } else if (job.crop) {
    const top = Math.round(height * job.crop.top);
    const bottom = Math.round(height * job.crop.bottom);
    pipeline = pipeline.extract({ left: 0, top, width, height: bottom - top });
  }

  const info = await pipeline
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(path.join(out, `${slug}.jpg`));

  console.log(`${slug}.jpg ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
