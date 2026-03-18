#!/usr/bin/env node

/**
 * Generate promotional images for Chrome Web Store listing
 *
 * Creates:
 * - marquee-1400x560.png (large promotional banner)
 * - small-tile-440x280.png (small promotional tile)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const storeAssetsDir = join(projectRoot, 'store-assets');

async function generateImages() {
  console.log('🎨 Generating Chrome Web Store promotional images...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Generate marquee (1400x560)
    console.log('📸 Generating marquee-1400x560.png...');
    await page.setViewport({ width: 1400, height: 560, deviceScaleFactor: 2 });
    await page.goto(`file://${join(storeAssetsDir, 'marquee-1400x560.html')}`, {
      waitUntil: 'networkidle0'
    });
    await page.screenshot({
      path: join(storeAssetsDir, 'marquee-1400x560.png'),
      type: 'png'
    });
    console.log('✅ marquee-1400x560.png created\n');

    // Generate small tile (440x280)
    console.log('📸 Generating small-tile-440x280.png...');
    await page.setViewport({ width: 440, height: 280, deviceScaleFactor: 2 });
    await page.goto(`file://${join(storeAssetsDir, 'small-tile-440x280.html')}`, {
      waitUntil: 'networkidle0'
    });
    await page.screenshot({
      path: join(storeAssetsDir, 'small-tile-440x280.png'),
      type: 'png'
    });
    console.log('✅ small-tile-440x280.png created\n');

    console.log('🎉 All promotional images generated successfully!');
    console.log(`\nImages saved to: ${storeAssetsDir}/`);
    console.log('  - marquee-1400x560.png');
    console.log('  - small-tile-440x280.png');
  } catch (error) {
    console.error('❌ Error generating images:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateImages();
