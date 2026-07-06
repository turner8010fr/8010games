import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // When deploying to GitHub Pages under a repo, set the base to the repo name.
  base: '/8010games/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
