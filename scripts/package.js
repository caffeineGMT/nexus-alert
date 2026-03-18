#!/usr/bin/env node

/**
 * Package NEXUS Alert extension for Chrome Web Store submission
 *
 * Excludes:
 * - node_modules/
 * - backend/
 * - web/
 * - .git/
 * - tests/
 * - Documentation and development files
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = 'nexus-alert-submission.zip';
const ROOT_DIR = path.resolve(__dirname, '..');

// Files to include
const INCLUDE_FILES = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'offscreen.html',
  'offscreen.js',
  'onboarding.html',
  'onboarding.js',
];

// Directories to include
const INCLUDE_DIRS = [
  'icons',
  'src',
];

console.log('📦 Packaging NEXUS Alert for Chrome Web Store submission...\n');

// Check if we're in the right directory
if (!fs.existsSync(path.join(ROOT_DIR, 'manifest.json'))) {
  console.error('❌ Error: manifest.json not found. Run this script from the project root.');
  process.exit(1);
}

// Remove old package if exists
if (fs.existsSync(path.join(ROOT_DIR, OUTPUT_FILE))) {
  fs.unlinkSync(path.join(ROOT_DIR, OUTPUT_FILE));
  console.log('🗑️  Removed old package\n');
}

// Use zip command (macOS/Linux)
try {
  // Build the zip command with explicit includes
  const filesToZip = [
    ...INCLUDE_FILES,
    ...INCLUDE_DIRS,
  ].join(' ');

  execSync(`zip -r ${OUTPUT_FILE} ${filesToZip}`, {
    cwd: ROOT_DIR,
    stdio: 'pipe',
  });

  // Get file size
  const stats = fs.statSync(path.join(ROOT_DIR, OUTPUT_FILE));
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  console.log('✅ Package created successfully!\n');
  console.log(`📦 File: ${OUTPUT_FILE}`);
  console.log(`📊 Size: ${fileSizeKB} KB\n`);

  // List contents
  try {
    const contents = execSync(`unzip -l ${OUTPUT_FILE}`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
    });
    console.log('📋 Package contents:');
    console.log(contents);
  } catch (e) {
    // Skip listing if unzip command fails
  }

  console.log('\n📋 Next steps:');
  console.log('1. Test the package by loading it as an unpacked extension');
  console.log('2. Create screenshots (see store-assets/SCREENSHOT-INSTRUCTIONS.md)');
  console.log('3. Generate promotional images (see store-assets/GENERATE-IMAGES.md)');
  console.log('4. Upload to Chrome Web Store Developer Dashboard');
  console.log('5. Follow the submission checklist in store-assets/SUBMISSION-CHECKLIST.md');
  console.log('\n🔗 Chrome Web Store Dashboard:');
  console.log('   https://chrome.google.com/webstore/devconsole\n');

} catch (error) {
  console.error('❌ Error creating package:', error.message);
  console.error('\nFallback: Use manual packaging instructions in store-assets/PACKAGING-INSTRUCTIONS.md');
  process.exit(1);
}
