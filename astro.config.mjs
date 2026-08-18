// // @ts-check
// import { defineConfig } from 'astro/config';

// // https://astro.build/config
// export default defineConfig({});


import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://debuggersatpal.github.io',
    devToolbar: {
        enabled: false,
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/internal-cms') && !page.includes('[id]')
        })
    ]
});