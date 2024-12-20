// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    optimizeDeps: {
      include: ['plyr'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            plyr: ['plyr'],
          },
        },
      },
    },
  },
});
