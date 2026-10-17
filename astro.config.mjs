// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// À la mise en ligne : remplacer par le vrai domaine (voir checklist de mise en ligne).
const SITE = 'https://labe-site.vercel.app';

// Les projets sans description n'ont pas de page (leur adresse renvoie à la liste) : on les garde hors du plan du site.
const dossierProjets = './src/content/projets/fr';
const projetsSansPage = readdirSync(dossierProjets)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !readFileSync(`${dossierProjets}/${f}`, 'utf8').split(/^---$/m).slice(2).join('---').trim())
  .map((f) => `/fr/projets/${f.replace(/\.md$/, '')}/`);

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/notes/') && !projetsSansPage.some((c) => page.endsWith(c)) })],
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
