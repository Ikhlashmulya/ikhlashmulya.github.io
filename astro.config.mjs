// @ts-check

// @ts-ignore
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// @ts-ignore
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ikhlashmulya.github.io',
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});