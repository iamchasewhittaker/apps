/**
 * Generate placeholder PNG icons for the extension.
 *
 * Since we can't generate real PNGs without a dependency, this script
 * creates simple SVG files that Chrome can use as fallbacks.
 *
 * For production icons, replace the files in icons/ with real PNGs.
 */

const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="#1a73e8"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.45)}" font-weight="bold">0</text>
</svg>`;

  fs.writeFileSync(path.join(iconsDir, `icon${size}.svg`), svg);
  console.log(`Created icon${size}.svg`);
});

console.log('\nNote: Chrome MV3 prefers PNG icons. Convert these SVGs to PNG');
console.log('or replace with real icon files before publishing.');
