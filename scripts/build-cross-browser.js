#!/usr/bin/env node

/**
 * Build script for NEXUS Alert - Cross-Browser Edition
 * Generates optimized builds for Chrome, Firefox, Safari, and Edge
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const BROWSERS = ['chrome', 'firefox', 'safari', 'edge'];

async function buildForBrowser(browser) {
  console.log(`\n🔨 Building for ${browser.toUpperCase()}...`);

  const distDir = path.join(__dirname, '..', 'dist', browser);

  // Clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // Select correct manifest
  const manifestSource = browser === 'chrome' || browser === 'edge'
    ? 'manifest.json'
    : `manifest.${browser}.json`;

  // Copy manifest
  const manifestContent = fs.readFileSync(
    path.join(__dirname, '..', manifestSource),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(distDir, 'manifest.json'),
    manifestContent
  );

  // Bundle JavaScript files
  const jsFiles = ['background.js', 'popup.js', 'onboarding.js', 'offscreen.js'];

  for (const file of jsFiles) {
    const inputPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(inputPath)) continue;

    try {
      await esbuild.build({
        entryPoints: [inputPath],
        bundle: true,
        minify: true,
        format: 'esm',
        target: ['es2020'],
        outfile: path.join(distDir, file),
        define: {
          'process.env.BROWSER': JSON.stringify(browser),
        },
      });
    } catch (err) {
      console.error(`Failed to build ${file}:`, err);
      throw err;
    }
  }

  // Copy static files
  const staticFiles = [
    'popup.html',
    'onboarding.html',
    'offscreen.html',
  ];

  for (const file of staticFiles) {
    const srcPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(srcPath)) continue;

    fs.copyFileSync(srcPath, path.join(distDir, file));
  }

  // Copy directories
  const staticDirs = ['icons', '_locales', 'src'];

  for (const dir of staticDirs) {
    const srcDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(srcDir)) continue;

    const destDir = path.join(distDir, dir);
    fs.mkdirSync(destDir, { recursive: true });

    copyRecursive(srcDir, destDir);
  }

  // Create ZIP package
  const zipPath = path.join(__dirname, '..', `nexus-alert-${browser}.zip`);
  await createZip(distDir, zipPath);

  console.log(`✅ ${browser} build complete: ${zipPath}`);
}

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function createZip(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function main() {
  console.log('🚀 NEXUS Alert - Cross-Browser Build System\n');

  const targetBrowser = process.argv[2];

  if (targetBrowser && BROWSERS.includes(targetBrowser)) {
    // Build single browser
    await buildForBrowser(targetBrowser);
  } else {
    // Build all browsers
    for (const browser of BROWSERS) {
      await buildForBrowser(browser);
    }
  }

  console.log('\n✅ All builds complete!');
}

main().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
