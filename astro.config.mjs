// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// À la mise en ligne : remplacer par le vrai domaine (voir checklist de mise en ligne).
const SITE = 'https://labe-site.vercel.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  i18n: {
    // Ajouter 'en' ici le jour où la version anglaise est prête.
    locales: ['fr'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
