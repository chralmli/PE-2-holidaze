import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Adjust this to match your dev server port
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
})