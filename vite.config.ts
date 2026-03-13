import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Use esbuild instead of LightningCSS for CSS minification
    // LightningCSS doesn't understand Tailwind v4 at-rules (@theme, @tailwind)
    cssMinify: 'esbuild',
  },
  css: {
    // Use PostCSS instead of LightningCSS - LightningCSS doesn't understand Tailwind v4 at-rules
    transformer: 'postcss',
  },
})
