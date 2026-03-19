#!/usr/bin/env node

/**
 * NEXUS Alert — Extension Popup Performance Benchmark
 * Measures popup initialization time and verifies <500ms target
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const EXTENSION_PATH = path.resolve(__dirname, '..');
const PERFORMANCE_TARGET_MS = 500;
const NUM_RUNS = 5;

async function measurePopupPerformance() {
  console.log('🚀 NEXUS Alert Popup Performance Benchmark\n');
  console.log(`Extension path: ${EXTENSION_PATH}`);
  console.log(`Target: <${PERFORMANCE_TARGET_MS}ms initial load\n`);

  // Launch browser with extension loaded
  const browser = await puppeteer.launch({
    headless: false, // Extension requires headed mode
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const results = [];

  for (let i = 0; i < NUM_RUNS; i++) {
    console.log(`\n📊 Run ${i + 1}/${NUM_RUNS}`);

    // Open new page
    const page = await browser.newPage();

    // Get extension ID
    const targets = await browser.targets();
    const extensionTarget = targets.find(target =>
      target.type() === 'service_worker' && target.url().includes('chrome-extension://')
    );

    if (!extensionTarget) {
      console.error('❌ Extension not loaded');
      await browser.close();
      process.exit(1);
    }

    const extensionUrl = new URL(extensionTarget.url());
    const extensionId = extensionUrl.hostname;
    const popupUrl = `chrome-extension://${extensionId}/popup.html`;

    console.log(`Extension ID: ${extensionId}`);

    // Navigate to popup
    await page.goto(popupUrl, { waitUntil: 'networkidle0' });

    // Wait a bit for initialization
    await page.waitForTimeout(1000);

    // Inject performance measurement script
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for performance marks
        setTimeout(() => {
          const perfEntries = performance.getEntriesByType('measure');
          const marks = performance.getEntriesByType('mark');

          const storageInit = perfEntries.find(e => e.name === 'storage-init');
          const uiInit = perfEntries.find(e => e.name === 'ui-init');

          const domReady = marks.find(m => m.name === 'popup-start');
          const complete = marks.find(m => m.name === 'ui-init-end');

          let totalTime = 0;
          if (complete && domReady) {
            totalTime = complete.startTime - domReady.startTime;
          }

          resolve({
            totalTime: Math.round(totalTime),
            storageInit: storageInit ? Math.round(storageInit.duration) : 0,
            uiInit: uiInit ? Math.round(uiInit.duration) : 0,
            entries: perfEntries.map(e => ({
              name: e.name,
              duration: Math.round(e.duration)
            }))
          });
        }, 500);
      });
    });

    console.log(`  Total Time: ${metrics.totalTime}ms`);
    console.log(`  Storage Init: ${metrics.storageInit}ms`);
    console.log(`  UI Init: ${metrics.uiInit}ms`);

    if (metrics.totalTime > 0) {
      results.push(metrics);
    }

    await page.close();

    // Cool down between runs
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await browser.close();

  // Calculate statistics
  if (results.length === 0) {
    console.error('\n❌ No valid measurements collected');
    process.exit(1);
  }

  const totalTimes = results.map(r => r.totalTime);
  const avgTime = Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length);
  const minTime = Math.min(...totalTimes);
  const maxTime = Math.max(...totalTimes);
  const p95Time = Math.round(totalTimes.sort((a, b) => a - b)[Math.floor(totalTimes.length * 0.95)]);

  console.log('\n📈 Performance Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Average:  ${avgTime}ms`);
  console.log(`Min:      ${minTime}ms`);
  console.log(`Max:      ${maxTime}ms`);
  console.log(`P95:      ${p95Time}ms`);
  console.log(`Target:   <${PERFORMANCE_TARGET_MS}ms`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const passed = avgTime < PERFORMANCE_TARGET_MS;

  if (passed) {
    console.log(`✅ PASS: Average load time ${avgTime}ms is under ${PERFORMANCE_TARGET_MS}ms target`);
  } else {
    console.log(`❌ FAIL: Average load time ${avgTime}ms exceeds ${PERFORMANCE_TARGET_MS}ms target`);
  }

  // Save results
  const resultsFile = path.join(__dirname, 'popup-performance-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    runs: results,
    summary: {
      average: avgTime,
      min: minTime,
      max: maxTime,
      p95: p95Time,
      target: PERFORMANCE_TARGET_MS,
      passed
    }
  }, null, 2));

  console.log(`\n📄 Results saved to: ${resultsFile}\n`);

  process.exit(passed ? 0 : 1);
}

// Run
measurePopupPerformance().catch(err => {
  console.error('❌ Benchmark failed:', err);
  process.exit(1);
});
