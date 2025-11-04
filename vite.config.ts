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
      // ✅ explicitly specify targets here instead of build.target
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  build: {
    // ❌ remove `target` — the legacy plugin now handles it
    chunkSizeWarningLimit: 2000, // keep your custom warning limit
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
