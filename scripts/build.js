#!/usr/bin/env node

/**
 * NEXUS Alert — Extension Build Pipeline
 *
 * Uses esbuild to bundle, minify, and tree-shake the Chrome extension.
 * Produces optimized output in dist/ directory ready for Chrome Web Store.
 *
 * Usage:
 *   node scripts/build.js           # Production build
 *   node scripts/build.js --analyze # Build with bundle size analysis
 */

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ANALYZE = process.argv.includes('--analyze');

// Clean dist directory
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

console.log('🔨 Building NEXUS Alert extension...\n');

// Track sizes for comparison
const originalSizes = {};
const builtSizes = {};

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// Record original sizes
for (const f of ['background.js', 'popup.js', 'onboarding.js', 'offscreen.js']) {
  originalSizes[f] = getFileSize(path.join(ROOT, f));
}
originalSizes['popup.html (CSS)'] = getFileSize(path.join(ROOT, 'popup.html'));

// 1. Bundle background.js (service worker) — inlines slotFilters.js
const bgResult = await esbuild.build({
  entryPoints: [path.join(ROOT, 'background.js')],
  bundle: true,
  outfile: path.join(DIST, 'background.js'),
  format: 'esm',
  platform: 'browser',
  target: ['chrome120'],
  minify: true,
  treeShaking: true,
  sourcemap: false,
  metafile: ANALYZE,
  // Chrome extension globals
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  // Don't try to bundle chrome.* APIs
  external: [],
});

builtSizes['background.js'] = getFileSize(path.join(DIST, 'background.js'));

// 2. Bundle popup.js
const popupResult = await esbuild.build({
  entryPoints: [path.join(ROOT, 'popup.js')],
  bundle: true,
  outfile: path.join(DIST, 'popup.js'),
  format: 'esm',
  platform: 'browser',
  target: ['chrome120'],
  minify: true,
  treeShaking: true,
  sourcemap: false,
  metafile: ANALYZE,
});

builtSizes['popup.js'] = getFileSize(path.join(DIST, 'popup.js'));

// 3. Bundle onboarding.js
const onboardingResult = await esbuild.build({
  entryPoints: [path.join(ROOT, 'onboarding.js')],
  bundle: true,
  outfile: path.join(DIST, 'onboarding.js'),
  format: 'esm',
  platform: 'browser',
  target: ['chrome120'],
  minify: true,
  treeShaking: true,
  sourcemap: false,
  metafile: ANALYZE,
});

builtSizes['onboarding.js'] = getFileSize(path.join(DIST, 'onboarding.js'));

// 4. Minify offscreen.js (simple, no imports)
await esbuild.build({
  entryPoints: [path.join(ROOT, 'offscreen.js')],
  bundle: false,
  outfile: path.join(DIST, 'offscreen.js'),
  format: 'esm',
  platform: 'browser',
  target: ['chrome120'],
  minify: true,
  sourcemap: false,
});

builtSizes['offscreen.js'] = getFileSize(path.join(DIST, 'offscreen.js'));

// 5. Extract CSS from popup.html, minify separately, and produce optimized HTML
const popupHtml = fs.readFileSync(path.join(ROOT, 'popup.html'), 'utf-8');

// Extract CSS from <style> tags
const styleRegex = /<style>([\s\S]*?)<\/style>/g;
let allCss = '';
let match;
while ((match = styleRegex.exec(popupHtml)) !== null) {
  allCss += match[1] + '\n';
}

// Minify extracted CSS with esbuild
const cssResult = await esbuild.transform(allCss, {
  loader: 'css',
  minify: true,
  target: ['chrome120'],
});

// Write minified CSS to separate file
fs.writeFileSync(path.join(DIST, 'popup.css'), cssResult.code);
builtSizes['popup.css'] = getFileSize(path.join(DIST, 'popup.css'));

// Replace inline styles with CSS link in HTML, minify the HTML
let optimizedHtml = popupHtml
  .replace(/<style>[\s\S]*?<\/style>/g, '') // Remove all inline styles
  .replace(
    '</head>',
    '  <link rel="stylesheet" href="popup.css">\n</head>'
  );

// Minify HTML: collapse whitespace, remove comments
optimizedHtml = optimizedHtml
  .replace(/<!--[\s\S]*?-->/g, '')          // Remove HTML comments
  .replace(/\n\s*\n/g, '\n')               // Collapse blank lines
  .replace(/^\s+/gm, (m) => {              // Reduce indentation
    const spaces = m.length;
    return spaces > 4 ? '  ' : m.length > 0 ? ' ' : '';
  });

fs.writeFileSync(path.join(DIST, 'popup.html'), optimizedHtml);
builtSizes['popup.html'] = getFileSize(path.join(DIST, 'popup.html'));

// 6. Process onboarding.html the same way
const onboardingHtml = fs.readFileSync(path.join(ROOT, 'onboarding.html'), 'utf-8');
let onboardingCss = '';
const onboardingStyleRegex = /<style>([\s\S]*?)<\/style>/g;
while ((match = onboardingStyleRegex.exec(onboardingHtml)) !== null) {
  onboardingCss += match[1] + '\n';
}

if (onboardingCss) {
  const onbCssResult = await esbuild.transform(onboardingCss, {
    loader: 'css',
    minify: true,
    target: ['chrome120'],
  });
  fs.writeFileSync(path.join(DIST, 'onboarding.css'), onbCssResult.code);
  builtSizes['onboarding.css'] = getFileSize(path.join(DIST, 'onboarding.css'));

  let optOnboardingHtml = onboardingHtml
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    .replace('</head>', '  <link rel="stylesheet" href="onboarding.css">\n</head>')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n\s*\n/g, '\n');

  fs.writeFileSync(path.join(DIST, 'onboarding.html'), optOnboardingHtml);
} else {
  fs.copyFileSync(path.join(ROOT, 'onboarding.html'), path.join(DIST, 'onboarding.html'));
}
builtSizes['onboarding.html'] = getFileSize(path.join(DIST, 'onboarding.html'));

// 7. Copy offscreen.html (tiny, no CSS to extract)
fs.copyFileSync(path.join(ROOT, 'offscreen.html'), path.join(DIST, 'offscreen.html'));

// 8. Copy manifest.json
fs.copyFileSync(path.join(ROOT, 'manifest.json'), path.join(DIST, 'manifest.json'));

// 9. Copy icons
const iconsDir = path.join(ROOT, 'icons');
const distIcons = path.join(DIST, 'icons');
fs.mkdirSync(distIcons, { recursive: true });
for (const icon of fs.readdirSync(iconsDir)) {
  fs.copyFileSync(path.join(iconsDir, icon), path.join(distIcons, icon));
}

// Print size comparison
console.log('📊 Build Results:\n');
console.log('  File                    Original     Built     Savings');
console.log('  ─────────────────────── ──────────── ───────── ────────');

let totalOriginal = 0;
let totalBuilt = 0;

for (const [file, builtSize] of Object.entries(builtSizes)) {
  const origKey = file === 'popup.css' ? 'popup.html (CSS)' : file;
  const origSize = originalSizes[origKey] || 0;

  if (file === 'popup.css' || file === 'popup.html' || file === 'onboarding.css' || file === 'onboarding.html') {
    // These are parts of the original HTML files, skip individual savings
    totalBuilt += builtSize;
    console.log(`  ${file.padEnd(25)} ${'—'.padEnd(12)} ${formatSize(builtSize).padEnd(9)}`);
    continue;
  }

  const savings = origSize > 0 ? ((1 - builtSize / origSize) * 100).toFixed(0) : 0;
  totalOriginal += origSize;
  totalBuilt += builtSize;

  console.log(
    `  ${file.padEnd(25)} ${formatSize(origSize).padEnd(12)} ${formatSize(builtSize).padEnd(9)} ${savings > 0 ? `-${savings}%` : '—'}`
  );
}

// Add original HTML sizes to total
totalOriginal += originalSizes['popup.html (CSS)'] || 0;

console.log('  ─────────────────────── ──────────── ───────── ────────');
console.log(
  `  ${'TOTAL'.padEnd(25)} ${formatSize(totalOriginal).padEnd(12)} ${formatSize(totalBuilt).padEnd(9)} -${((1 - totalBuilt / totalOriginal) * 100).toFixed(0)}%`
);

// Print analysis if requested
if (ANALYZE && bgResult.metafile) {
  console.log('\n📦 Bundle Analysis (background.js):');
  const analysis = await esbuild.analyzeMetafile(bgResult.metafile);
  console.log(analysis);

  if (popupResult.metafile) {
    console.log('\n📦 Bundle Analysis (popup.js):');
    const popupAnalysis = await esbuild.analyzeMetafile(popupResult.metafile);
    console.log(popupAnalysis);
  }
}

// Create zip package from dist/
const { execSync } = await import('child_process');
const zipPath = path.join(ROOT, 'nexus-alert-chrome.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

execSync('zip -r ../nexus-alert-chrome.zip .', {
  cwd: DIST,
  stdio: 'pipe',
});

const zipSize = getFileSize(zipPath);
console.log(`\n📦 Extension package: nexus-alert-chrome.zip (${formatSize(zipSize)})`);
console.log('✅ Build complete!\n');
