import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '..', 'src', 'content', 'images-meetup');

async function ensureBannerVariants() {
  const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });
  const bannerDir = path.join(IMAGES_DIR, 'banners');
  await fs.mkdir(bannerDir, { recursive: true });

  for (const entry of entries) {
    if (!entry.isFile() || !/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      continue;
    }

    const inPath = path.join(IMAGES_DIR, entry.name);
    const baseOut = entry.name.replace(/\.(jpe?g|png|webp)$/i, '');
    const outPath = path.join(bannerDir, `${baseOut}-banner.jpg`);

    try {
      const [sOut, sIn] = await Promise.all([
        fs.stat(outPath).catch(() => null),
        fs.stat(inPath),
      ]);
      if (sOut && sOut.mtimeMs >= sIn.mtimeMs) {
        continue;
      }

      await sharp(inPath).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(outPath);
      console.log('Generated', outPath);
    } catch (err) {
      console.error('Banner error for', inPath, err.message);
    }
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (/meetup-?\d+/i.test(entry.name)) {
        const files = await fs.readdir(full);
        const imgFiles = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !/banner/i.test(f));
        if (imgFiles.length === 0) continue;
        const thumbsDir = path.join(full, 'thumbs');
        await fs.mkdir(thumbsDir, { recursive: true });

        for (const file of imgFiles) {
          const inPath = path.join(full, file);
          const baseOut = file.replace(/\.(jpe?g|png|webp)$/i, '');
          const outThumb = baseOut + '-thumb.jpg';
          const outThumbPath = path.join(thumbsDir, outThumb);
          try {
            let skipThumb = false;
            try {
              const [sThumb, sIn] = await Promise.all([
                fs.stat(outThumbPath).catch(() => null),
                fs.stat(inPath),
              ]);
              if (sThumb && sThumb.mtimeMs >= sIn.mtimeMs) skipThumb = true;
            } catch {}
            if (!skipThumb) {
              await sharp(inPath).resize({ width: 320 }).jpeg({ quality: 68 }).toFile(outThumbPath);
              console.log('Generated', outThumbPath);
            }
          } catch (err) {
            console.error('Thumb error for', inPath, err.message);
          }
        }
      } else {
        await walk(full);
      }
    }
  }
}

async function main() {
  await ensureBannerVariants();
  await walk(IMAGES_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
