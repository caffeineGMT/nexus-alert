import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run tests under the root-level tests/ directory.
    // backend/tests/ uses cloudflare:test and must be run via wrangler (see backend/).
    include: ['tests/**/*.test.js'],
  },
});
