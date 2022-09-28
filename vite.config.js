import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    port: 3000
  },
  define: {
    'API_URL': JSON.stringify(process.env.API_URL)
  }
};

export default config;
