// Simple test for HMAC signing and verification
// Run with: node test-unsubscribe.js

// Polyfill for Web Crypto API (Node.js uses different API)
const { webcrypto } = require('crypto');
global.crypto = webcrypto;

async function generateHmacToken(email, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(email));
  return Buffer.from(signature).toString('base64');
}

async function verifyHmacToken(email, token, secret) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = Buffer.from(token, 'base64');
    return await crypto.subtle.verify('HMAC', key, signature, encoder.encode(email));
  } catch (err) {
    console.error('Token verification error:', err);
    return false;
  }
}

async function test() {
  const email = 'test@example.com';
  const secret = 'test-secret-key';

  console.log('Testing HMAC token generation and verification...\n');

  // Generate token
  const token = await generateHmacToken(email, secret);
  console.log(`Email: ${email}`);
  console.log(`Token: ${token}\n`);

  // Verify valid token
  const validResult = await verifyHmacToken(email, token, secret);
  console.log(`Valid token verification: ${validResult ? '✓ PASS' : '✗ FAIL'}`);

  // Verify invalid token (wrong email)
  const invalidEmailResult = await verifyHmacToken('wrong@example.com', token, secret);
  console.log(`Invalid email verification: ${!invalidEmailResult ? '✓ PASS' : '✗ FAIL'}`);

  // Verify invalid token (wrong secret)
  const invalidSecretResult = await verifyHmacToken(email, token, 'wrong-secret');
  console.log(`Invalid secret verification: ${!invalidSecretResult ? '✓ PASS' : '✗ FAIL'}`);

  // Verify tampered token
  const tamperedToken = token.slice(0, -5) + 'XXXXX';
  const tamperedResult = await verifyHmacToken(email, tamperedToken, secret);
  console.log(`Tampered token verification: ${!tamperedResult ? '✓ PASS' : '✗ FAIL'}`);

  // Generate unsubscribe URL
  const unsubscribeUrl = `https://api.nexus-alert.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  console.log(`\nSample unsubscribe URL:\n${unsubscribeUrl}`);
}

test().catch(console.error);
