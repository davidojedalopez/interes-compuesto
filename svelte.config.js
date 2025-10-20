import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
        preprocess: vitePreprocess(),
        kit: {
                adapter: adapter(),
                alias: {
                        '@animations': 'src/lib/animations',
                        '@components': 'src/lib/components',
                        '@data': 'src/lib/data',
                        '@styles': 'src/lib/styles'
                }
        }
};

export default config;
