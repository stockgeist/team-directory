import { defineConfig } from 'vitest/config'

// The tests are plain HTTP clients: global-setup starts the real dev server
// against a throwaway database and the tests talk to it with fetch().
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globalSetup: './tests/global-setup.ts',
    testTimeout: 20_000,
    hookTimeout: 90_000,
  },
})
