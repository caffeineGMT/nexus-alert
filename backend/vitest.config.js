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
          },
        },
      },
    },
  },
});
