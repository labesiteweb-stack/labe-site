# Site du LABE

Site du Laboratoire Activité physique et Bien-Être (Université de Montréal, CRCHUM). Site statique construit avec Astro, hébergé sur Vercel. Le contenu est édité avec Sveltia CMS, accessible à l'adresse `/admin/` du site.

## Travailler sur le site

Node 22 est requis (voir `.nvmrc`).

```
npm ci          # installe les versions verrouillées
npm run dev     # aperçu local sur http://localhost:4321
npm run build   # construit le site dans dist/
```

## Où est quoi

- `src/content/` : tout le contenu, un fichier par fiche. Les dossiers `fr/` contiennent ce qui se traduit; une version anglaise ira dans `en/`.
  - `equipe/`, `projets/`, `nouvelles/`, `pages/` : contenu traduisible
  - `publications/`, `medias/`, `galerie/`, `partenaires/` : contenu sans langue
  - `reglages/site.json` : coordonnées et réseaux sociaux
- `src/content.config.ts` : la liste des champs de chaque type de fiche
- `src/i18n/ui.ts` : les textes de l'interface (menus, boutons)
- `public/images/` : logos, portraits, photos de la galerie (déjà optimisées)
- `public/admin/` : le CMS (Sveltia, version figée) et sa configuration `config.yml`
- `docs/mise-en-place-comptes.md` : l'ordre de création des comptes et du branchement

## Règles du contenu

- Le dépôt est public : une fiche masquée n'apparaît pas sur le site mais reste lisible sur GitHub. Ne rien écrire de confidentiel dans le contenu.

- `brouillon: true` masque une fiche du site.
- Un projet est « en cours » tant que son année de fin n'est pas passée.
- Dans les publications, les noms listés dans le champ `nom_publication` des fiches de l'équipe sont surlignés automatiquement.

## Ajouter l'anglais

1. Ajouter `'en'` dans `astro.config.mjs` (`i18n.locales`) et dans `src/i18n/ui.ts` (`LANGUES`).
2. Traduire les textes de l'interface dans `src/i18n/ui.ts`.
3. Ajouter `en` à `i18n.locales` dans `public/admin/config.yml` : le CMS proposera alors la traduction de chaque fiche.
4. Créer les fiches traduites (dans le CMS ou dans les dossiers `en/`).

## Le CMS

- Sveltia CMS est copié dans `public/admin/sveltia-cms-0.237.0/` : le site ne dépend d'aucune mise à jour automatique.
- L'interface en français et ses icônes sont chargées depuis unpkg et jsDelivr. Si ces services sont indisponibles, l'admin reste utilisable, en anglais et sans icônes.
- Toute modification de champ se fait à deux endroits : `public/admin/config.yml` et `src/content.config.ts`.
- Pour tester l'admin sans toucher au dépôt en ligne : `npm run dev`, ouvrir `/admin/` dans Chrome ou Edge, puis « Travailler avec un dépôt local » et choisir le dossier du projet.

## À surveiller

- Le site est construit avec Node 22 (fixé dans `package.json`). Node 22 cesse d'être maintenu en avril 2027 : passer à Node 24 avant, en testant la construction.

## Mettre à jour Sveltia

1. Télécharger la nouvelle version (`npm pack @sveltia/cms@<version>`), copier `dist/sveltia-cms.js` et `dist/chunks/` dans un nouveau dossier `public/admin/sveltia-cms-<version>/`.
2. Changer le chemin du script dans `public/admin/index.html`.
3. Tester l'admin en local (ouvrir, modifier une fiche, enregistrer, construire le site), puis publier et supprimer l'ancien dossier.
