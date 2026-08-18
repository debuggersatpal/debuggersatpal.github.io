// // @ts-check
// import { defineConfig } from 'astro/config';

// // https://astro.build/config
// export default defineConfig({});


import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    srcDir: './src/portfolio',
    site: 'https://debuggersatpal.github.io',
    devToolbar: {
        enabled: false,
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/me') && !page.includes('[id]')
        })
    ]
});