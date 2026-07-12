import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Backend origin the dev server proxies /api to. Override with VITE_PROXY_TARGET.
// Defaults to the shared ngrok backend tunnel.
const PROXY_TARGET =
  process.env.VITE_PROXY_TARGET ??
  'https://propitious-curt-breathlessly.ngrok-free.dev'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    // Proxy API calls to the backend so the browser stays same-origin (no CORS).
    // The proxy runs server-side, so the ngrok browser-warning never triggers;
    // the skip header is sent anyway for safety.
    proxy: {
      '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        headers: { 'ngrok-skip-browser-warning': 'true' },
      },
    },
  },
})
