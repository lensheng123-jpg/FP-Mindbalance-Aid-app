/// <reference types="vitest" />

// @ts-ignore: Resolve legacy plugin types under current moduleResolution
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernTarget: 'es2020', // Explicitly set modern bundle target
      modernPolyfills: true
    })
  ],

  build: {
    chunkSizeWarningLimit: 2000, // Increase from default 500 kB
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
