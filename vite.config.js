import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// FarmShield frontend build configuration.
// The backend is developed separately; API base URL is provided at runtime via
// VITE_API_BASE_URL (see .env.example). When it is not set, the app runs in
// clearly-labelled demo mode through the demo-data adapter.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Allow the sandbox/live-preview host header (and localhost) so the app is
    // reachable through the preview proxy as well as locally.
    allowedHosts: true,
    // Proxy same-origin /api requests to the backend when VITE_API_PROXY_TARGET
    // is configured for local development. Falls back to direct VITE_API_BASE_URL use.
    proxy: process.env.VITE_API_PROXY_TARGET
      ? {
          '/api': {
            target: process.env.VITE_API_PROXY_TARGET,
            changeOrigin: true,
          },
        }
      : undefined,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
});
