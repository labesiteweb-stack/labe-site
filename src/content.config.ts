import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Toutes les collections vivent dans src/content/ et sont éditées par le CMS (public/admin/config.yml).
 * Les collections traduisibles ont un dossier par langue : src/content/<collection>/fr/...
 * Les champs ajoutés ici doivent aussi être ajoutés dans public/admin/config.yml.
 */

const md = '**/*.md';

/*
 * Le CMS peut écrire une chaîne vide pour un champ facultatif laissé vide.
 * Ces aides traitent « '' » comme une valeur absente, pour que le site se construise quand même.
 */
const vide = (v: unknown) => (v === '' || v === null ? undefined : v);
const texte = () => z.preprocess(vide, z.string().optional());
const url = () => z.preprocess(vide, z.string().url().optional());
const date = () => z.preprocess(vide, z.coerce.date().optional());

const equipe = defineCollection({
  loader: glob({ pattern: md, base: './src/content/equipe' }),
  schema: z.object({
    nom: z.string(),
    role: z.enum(['direction', 'personnel', 'postdoc', 'doctorat', 'maitrise', 'stagiaire']),
    titre: z.string(),
    statut: z.enum(['actuel', 'ancien']),
    annees: texte(),
    programme: texte(),
    sujet: texte(),
    codirection: texte(),
    distinctions: z.array(z.string()).default([]),
    photo: texte(),
    // Cadrage du portrait carré : quelle partie de la photo garder.
    cadrage: z.enum(['haut', 'centre', 'bas']).default('haut'),
    a_valider: z.boolean().default(false),
    // Façons dont le nom apparaît dans les listes d'auteurs (ex. « Piché A »), pour le surligner dans les publications.
    nom_publication: z.array(z.string()).default([]),
    ordre: z.number().default(100),
    brouillon: z.boolean().default(false),
  }),
});

const projets = defineCollection({
  loader: glob({ pattern: md, base: './src/content/projets' }),
  schema: z.object({
    titre: z.string(),
    debut: z.number().int(),
    fin: z.number().int(),
    financement: z.string(),
    role: z.enum(['principale', 'co-principale', 'co-chercheuse']),
    chercheur_principal: texte(),
    co_chercheurs: texte(),
    partenaires: texte(),
    logo: texte(),
    lien: url(),
    // Projets phares : affichés dans le menu Projets et sur l'accueil (cinq au plus, selon l'ordre).
    phare: z.boolean().default(false),
    titre_court: texte(),
    resume: texte(),
    image: texte(),
    image_alt: texte(),
    ordre: z.number().default(100),
    a_valider: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: md, base: './src/content/publications' }),
  schema: z.object({
    type: z.enum(['article', 'soumis', 'livre', 'rapport', 'abrege', 'transfert', 'formation']),
    annee: z.number().int(),
    statut: texte(),
    auteurs: z.string(),
    titre: z.string(),
    source: texte(),
    details: texte(),
    lien: url(),
    // Langue du titre : sert aux lecteurs d'écran. Vide = détectée automatiquement.
    langue: z.preprocess(vide, z.enum(['fr', 'en']).optional()),
    a_valider: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

const nouvelles = defineCollection({
  loader: glob({ pattern: md, base: './src/content/nouvelles' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    date_texte: texte(),
    categorie: z.enum(['nouvelle', 'distinction']),
    extrait: texte(),
    image: texte(),
    image_alt: texte(),
    lien: url(),
    a_valider: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

const medias = defineCollection({
  loader: glob({ pattern: md, base: './src/content/medias' }),
  schema: z.object({
    titre: z.string(),
    media: z.string(),
    date: z.coerce.date(),
    date_texte: texte(),
    lien: url(),
    a_valider: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

const partenaires = defineCollection({
  loader: glob({ pattern: md, base: './src/content/partenaires' }),
  schema: z.object({
    nom: z.string(),
    logo: z.string(),
    lien: url(),
    categorie: z.enum(['affiliation', 'financement', 'partenaire']),
    ordre: z.number().default(100),
    a_valider: z.boolean().default(false),
  }),
});

const galerie = defineCollection({
  loader: glob({ pattern: md, base: './src/content/galerie' }),
  schema: z.object({
    titre: z.string(),
    date: date(),
    date_texte: texte(),
    description: texte(),
    couverture: texte(),
    photos: z.array(z.string()).default([]),
    a_valider: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: md, base: './src/content/pages' }),
  schema: z.object({
    titre: z.string(),
    etiquette: texte(),
    accroche: texte(),
    image: texte(),
    image_alt: texte(),
    a_valider: z.boolean().default(false),
    axes: z.array(z.object({ titre: z.string(), texte: z.string() })).default([]),
    // Accueil : les portes d'entrée par public (patients, étudiants, médias).
    portes: z
      .array(
        z.object({
          etiquette: z.string(),
          titre: z.string(),
          texte: z.string(),
          bouton_texte: z.string(),
          bouton_lien: z.string(),
        }),
      )
      .default([]),
    sections: z
      .array(
        z.object({
          titre: z.string(),
          texte: z.string(),
          bouton_texte: texte(),
          bouton_lien: texte(),
        }),
      )
      .default([]),
  }),
});

const reglages = defineCollection({
  loader: file('./src/content/reglages/site.json', { parser: (texte) => ({ site: JSON.parse(texte) }) }),
  schema: z.object({
    nom: z.string(),
    sigle: z.string(),
    courriel: texte(),
    telephone: texte(),
    adresses: z.array(z.object({ nom: z.string(), lignes: z.array(z.string()) })),
    facebook: url(),
    instagram: url(),
    linkedin: url(),
  }),
});

export const collections = { equipe, projets, publications, nouvelles, medias, partenaires, galerie, pages, reglages };
