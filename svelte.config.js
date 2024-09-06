import staticAdapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),

  kit: {
    adapter: staticAdapter({
      // default options are shown
      pages: 'dist/www',
      assets: 'dist/www',
      fallback: '404.html',
      precompress: false
    }),
    prerender: {
      entries: ['*']
    }
  }
};

export default config;
