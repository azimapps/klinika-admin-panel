import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 8080;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: false,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    proxy: {
      '/admin': {
        target: 'https://api.menu24.uz',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'https://api.menu24.uz',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://api.menu24.uz',
        changeOrigin: true,
        secure: false,
      },
      '/advantages': {
        target: 'https://api.menu24.uz',
        changeOrigin: true,
        secure: false,
      },
      '/founders': {
        target: 'https://api.menu24.uz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: { port: PORT, host: true },
});
