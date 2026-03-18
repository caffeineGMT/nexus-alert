#!/usr/bin/env node
/**
 * Stripe Promo Code Setup Script
 * Creates promo codes for the drip email campaign
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_... node scripts/setup-promo-codes.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const promoCodes = [
  {
    code: 'CASE20',
    description: 'Day 7 Case Study Email - 20% off first month',
    percentOff: 20,
    duration: 'once', // Apply once (first month only)
    maxRedemptions: 1000,
    campaign: 'day_7_case_study',
  },
  {
    code: 'FLASH48',
    description: 'Day 14 Flash Sale - 48 hour offer',
    percentOff: 20,
    duration: 'once',
    maxRedemptions: 500,
    expiresAfterDays: 60, // Expires 60 days from creation
    campaign: 'day_14_flash_sale',
  },
];

async function createPromoCodes() {
  console.log('🎫 Creating Stripe promo codes for drip campaign...\n');

  for (const promo of promoCodes) {
    try {
      // First, create a coupon
      console.log(`Creating coupon for ${promo.code}...`);
      const coupon = await stripe.coupons.create({
        percent_off: promo.percentOff,
        duration: promo.duration,
        name: promo.code,
        metadata: {
          campaign: promo.campaign,
          description: promo.description,
        },
      });
      console.log(`✅ Coupon created: ${coupon.id}`);

      // Then create a promotion code
      console.log(`Creating promotion code ${promo.code}...`);
      const promoCodeConfig = {
        coupon: coupon.id,
        code: promo.code,
        max_redemptions: promo.maxRedemptions,
        metadata: {
          campaign: promo.campaign,
        },
      };

      if (promo.expiresAfterDays) {
        const expiresAt = Math.floor(Date.now() / 1000) + (promo.expiresAfterDays * 24 * 60 * 60);
        promoCodeConfig.expires_at = expiresAt;
      }

      const promotionCode = await stripe.promotionCodes.create(promoCodeConfig);
      console.log(`✅ Promotion code created: ${promotionCode.code}`);
      console.log(`   URL: https://dashboard.stripe.com/promotion_codes/${promotionCode.id}\n`);
    } catch (err) {
      if (err.code === 'resource_already_exists') {
        console.log(`⚠️  Promo code ${promo.code} already exists. Skipping...\n`);
      } else {
        console.error(`❌ Error creating ${promo.code}:`, err.message);
      }
    }
  }

  console.log('✨ Done! Promo codes are ready for the drip campaign.');
  console.log('\n📊 Summary:');
  console.log('- CASE20: 20% off first month (Day 7 email)');
  console.log('- FLASH48: 20% off first month (Day 14 flash sale)');
  console.log('\nNext steps:');
  console.log('1. Test the promo codes in checkout');
  console.log('2. Monitor redemptions in Stripe Dashboard');
  console.log('3. Track conversions via /api/email-analytics endpoint');
}

createPromoCodes().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
