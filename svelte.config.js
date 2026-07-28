import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// GitHub project pages serve from a subdirectory (pazzann.github.io/bfg.dev), a custom
// domain serves from the root. The deploy workflow sets BASE_PATH; dev leaves it empty.
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Static output. `fallback` makes it a client-routed SPA: GitHub Pages serves
		// 404.html for any path with no matching file, and the router takes over.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		paths: { base }
	}
};

export default config;
