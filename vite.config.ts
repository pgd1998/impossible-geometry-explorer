import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@geometries': resolve(__dirname, './src/geometries'),
      '@utils': resolve(__dirname, './src/utils'),
      '@components': resolve(__dirname, './src/components')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});