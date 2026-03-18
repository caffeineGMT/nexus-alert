import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          kvNamespaces: ['NEXUS_ALERTS_KV'],
          bindings: {
            WEBHOOK_SECRET: 'test-secret',
            RESEND_API_KEY: 'test-key',
            SENTRY_DSN: '',
            STRIPE_SECRET_KEY: 'sk_test_mock',
            STRIPE_WEBHOOK_SECRET: 'test-webhook-secret',
            STRIPE_MONTHLY_PRICE_ID: 'price_test_monthly',
            STRIPE_ANNUAL_PRICE_ID: 'price_test_annual',
            STRIPE_PRO_PRICE_ID: 'price_test_pro',
          },
        },
      },
    },
  },
});
