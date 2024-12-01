import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    baseUrl: 'http://localhost:5173',
    env: {
      NOROFF_API_KEY: '79fd374c-8c31-405c-86cf-122ee35d2a3c'
    }
  },
})