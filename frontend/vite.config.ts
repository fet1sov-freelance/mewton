import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
          global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
          NodeGlobalsPolyfillPlugin({
              buffer: true
          })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
});
