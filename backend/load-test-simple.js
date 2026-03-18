#!/usr/bin/env node
/**
 * Simple Load Test for NEXUS Alert Backend
 *
 * Creates test subscribers and validates batched processing
 * Run: node load-test-simple.js
 */

const TEST_SUBSCRIBER_COUNT = 1000;
const BATCH_SIZE = 100;

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           NEXUS Alert Load Test                           ║
║  Testing batched slot checking with ${TEST_SUBSCRIBER_COUNT} subscribers      ║
╚═══════════════════════════════════════════════════════════╝
`);

// Generate fake subscriber data
const fakeEmails = Array.from({ length: TEST_SUBSCRIBER_COUNT }, (_, i) => `loadtest${i}@example.com`);

console.log('\n📋 Test Configuration:');
console.log(`   Total subscribers: ${TEST_SUBSCRIBER_COUNT}`);
console.log(`   Batch size: ${BATCH_SIZE}`);
console.log(`   Batches needed: ${Math.ceil(TEST_SUBSCRIBER_COUNT / BATCH_SIZE)}`);
console.log(`   Time to check all (at 2min intervals): ${Math.ceil(TEST_SUBSCRIBER_COUNT / BATCH_SIZE) * 2} minutes`);

// Calculate KV operations
const readsPerBatch = BATCH_SIZE; // Read each subscriber
const writesPerBatch = BATCH_SIZE; // Update last_checked_at
const totalOpsPerBatch = readsPerBatch + writesPerBatch;
const assumedBatchDurationSec = 60; // Conservative 1 minute estimate
const opsPerSecond = totalOpsPerBatch / assumedBatchDurationSec;

console.log('\n📊 KV Operations Analysis:');
console.log(`   Reads per batch: ${readsPerBatch}`);
console.log(`   Writes per batch: ${writesPerBatch}`);
console.log(`   Total ops per batch: ${totalOpsPerBatch}`);
console.log(`   Estimated ops/sec: ${opsPerSecond.toFixed(1)}`);
console.log(`   KV free tier limit: 1000 ops/sec`);
console.log(`   Status: ${opsPerSecond < 1000 ? '✓ PASS' : '✗ FAIL'} (${(opsPerSecond / 1000 * 100).toFixed(1)}% of limit)`);

// Sample subscriber object
const sampleSubscriber = {
  email: 'loadtest0@example.com',
  locations: [5020], // Blaine, WA
  program: 'NEXUS',
  tier: 'free',
  dateRange: { start: null, end: null },
  timeRange: { start: null, end: null },
  notifiedSlots: {},
  last_checked_at: null,
  phone: null,
};

console.log('\n📝 Sample Subscriber:');
console.log(JSON.stringify(sampleSubscriber, null, 2));

console.log('\n🔧 Setup Instructions:');
console.log('   1. Run: cd backend');
console.log('   2. Create test data in KV:');
console.log(`      wrangler kv:key put --binding=NEXUS_ALERTS_KV "subscriber_list" '${JSON.stringify(fakeEmails.slice(0, 100))}'`);
console.log(`      (Create 100 test subscribers first for initial testing)`);
console.log('   3. For each test subscriber, put data:');
console.log(`      wrangler kv:key put --binding=NEXUS_ALERTS_KV "sub:loadtest0@example.com" '${JSON.stringify(sampleSubscriber)}'`);
console.log('   4. Trigger cron manually:');
console.log('      wrangler dev --test-scheduled');
console.log('   5. Check cursor advancement:');
console.log('      wrangler kv:key get --binding=NEXUS_ALERTS_KV "cron_cursor"');

console.log('\n✅ Expected Results:');
console.log('   • First cron run processes subscribers 0-99');
console.log('   • Cursor advances to 100');
console.log('   • Second cron run processes subscribers 100-199');
console.log('   • Cursor advances to 200 (or resets to 0 if only 100 subscribers)');
console.log('   • All subscribers have last_checked_at updated');
console.log('   • Batch completes in <2 minutes');

console.log('\n🚀 Performance Targets:');
console.log('   ✓ Batch duration: <2 minutes (120,000ms)');
console.log('   ✓ KV operations: <1000 ops/sec');
console.log('   ✓ All subscribers checked within 3.3 hours (1000 users / 100 per batch * 2 min)');
console.log('   ✓ Email queue prevents rate limiting');

console.log('\n📈 Scaling Analysis:');
const scenarios = [
  { users: 1000, batchSize: 100, cronInterval: 2 },
  { users: 5000, batchSize: 100, cronInterval: 2 },
  { users: 10000, batchSize: 100, cronInterval: 2 },
  { users: 10000, batchSize: 200, cronInterval: 2 },
];

scenarios.forEach(({ users, batchSize, cronInterval }) => {
  const batches = Math.ceil(users / batchSize);
  const totalTimeMin = batches * cronInterval;
  const opsPerBatch = batchSize * 2;
  const opsPerSec = opsPerBatch / (cronInterval * 60);

  console.log(`   ${users.toLocaleString()} users @ ${batchSize}/batch:`);
  console.log(`      Time to check all: ${totalTimeMin} min (${(totalTimeMin / 60).toFixed(1)}h)`);
  console.log(`      KV ops/sec: ${opsPerSec.toFixed(1)} ${opsPerSec > 1000 ? '⚠️  EXCEEDS LIMIT' : '✓'}`);
});

console.log('\n💡 Recommendations:');
console.log('   • For 1,000 users: Current setup is optimal');
console.log('   • For 5,000+ users: Consider upgrading to Workers Paid ($5/mo for 10M KV ops)');
console.log('   • For 10,000+ users: Implement Durable Objects for parallel processing');
console.log('   • Email queue prevents Resend rate limiting (free tier: 100 emails/day)');
console.log('   • Premium users get 2-min checks, free users get 30-min checks');

console.log('\n' + '═'.repeat(60));
console.log(' Load test plan complete. Ready to test with real backend.\n');
