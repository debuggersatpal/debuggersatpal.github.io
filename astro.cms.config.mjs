import { defineConfig } from 'astro/config';

export default defineConfig({
    srcDir: './src/cms',
    site: 'https://satpal-portfolio.web.app',
    outDir: './dist-cms',
    build: {
        format: 'directory'
    }
});
