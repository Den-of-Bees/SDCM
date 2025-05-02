import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({build: {
  rollupOptions: {
    external: [
      '@homebridge/node-pty-prebuilt-multiarch',
      'node-pty'
    ]  },
},});
