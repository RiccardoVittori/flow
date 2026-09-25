import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site, base } from './site.config.mjs';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (url) =>
        !url.endsWith('/404/') &&
        !url.endsWith('/404.html') &&
        !url.includes('/lab/'),
    }),
    ...(process.env.FLOW_SHOWCASE === '1'
      ? [
          {
            name: 'flow-test-lab',
            hooks: {
              'astro:config:setup': ({ injectRoute }) => {
                injectRoute({
                  pattern: '/lab/',
                  entrypoint: './tests/showcase.astro',
                });
              },
            },
          },
        ]
      : []),
  ],
  ...(process.env.FLOW_SHOWCASE === '1'
    ? { outDir: './artifacts/showcase/' }
    : {}),
  image: { responsiveStyles: true },
});
