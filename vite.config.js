import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003', // Make sure this matches your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',  // Simulate browser environment for testing
    globals: true,         // Enables global test functions (test, expect, describe)
    setupFiles: './testSetup.js',  // Ensure this file exists
  }
})
