/*
 * Textes de l'interface (menus, boutons, titres de sections).
 * Pour ajouter l'anglais : ajouter 'en' à LANGUES ici et dans astro.config.mjs (i18n.locales),
 * puis traduire le contenu dans src/content/<collection>/en/.
 */
export const LANGUES = ['fr'] as const;
export type Langue = (typeof LANGUES)[number] | 'en';
export const LANGUE_DEFAUT = 'fr';

export const ui = {
  fr: {
    'site.nom': 'Laboratoire Activité physique et Bien-Être',
    'nav.recherche': 'Recherche',
    'nav.equipe': 'Équipe',
    'nav.publications': 'Publications',
    'nav.actualites': 'Actualités',
    'nav.galerie': 'Galerie',
    'nav.contact': 'Nous joindre',
    'nav.menu': 'Menu',
    'nav.principale': 'Navigation principale',
    'lien.evitement': 'Aller au contenu',
    'accueil.axes': 'Ce que nous étudions',
    'accueil.projets': 'Projets phares',
    'accueil.nouvelles': 'Dernières nouvelles',
    'accueil.partenaires': 'Affiliations et partenaires',
    'accueil.voir_projets': 'Voir les projets',
    'accueil.rejoindre': 'Joindre le laboratoire',
    'accueil.toutes_nouvelles': 'Toutes les actualités',
    'partenaires.affiliation': 'Affiliations',
    'partenaires.financement': 'Organismes subventionnaires',
    'partenaires.partenaire': 'Partenaires',
    'projets.titre': 'Recherche',
    'projets.intro': "Les projets que le LABE dirige, et ceux auxquels l'équipe contribue avec d'autres chercheuses et chercheurs.",
    'projets.en_cours': 'En cours',
    'projets.termines': 'Terminés',
    'projets.statut_en_cours': 'en cours',
    'projets.statut_termine': 'terminé',
    'projets.principale': 'Projets dirigés par le LABE',
    'projets.contribue': 'Contribue aussi à',
    'projets.financement': 'Financement',
    'projets.chercheur_principal': 'Direction',
    'projets.co_chercheurs': 'Cochercheurs',
    'projets.partenaires': 'Partenaires et collaborateurs',
    'projets.site': 'Site du projet',
    'projets.retour': 'Tous les projets',
    'equipe.titre': 'Équipe',
    'equipe.intro': "Les personnes qui font la recherche au LABE, et celles qui y sont passées.",
    'equipe.direction': 'Direction',
    'equipe.personnel': 'Personnel de recherche',
    'equipe.postdoc': 'Stagiaires postdoctoraux',
    'equipe.doctorat': 'Doctorat',
    'equipe.maitrise': 'Maîtrise',
    'equipe.stagiaire': 'Stages',
    'equipe.anciens': 'Anciens membres',
    'equipe.sujet': 'Projet',
    'equipe.distinctions': 'Bourses et distinctions',
    'publications.titre': 'Publications',
    'publications.intro': "Le nom d'Isabelle Doré est en gras, et ceux des membres du LABE sont en vert.",
    'publications.recherche': 'Rechercher par titre, auteur ou revue',
    'publications.aucun': 'Aucune publication ne correspond à cette recherche.',
    'publications.tous': 'Toutes',
    'publications.lien': 'Lire',
    'type.article': 'Articles révisés par les pairs',
    'type.soumis': 'Articles soumis',
    'type.livre': 'Livres et collaborations',
    'type.rapport': 'Rapports de recherche',
    'type.abrege': 'Abrégés de conférence',
    'type.transfert': 'Transfert de connaissances',
    'type.formation': 'Formations développées',
    'actualites.titre': 'Actualités',
    'actualites.intro': 'Les nouvelles du laboratoire, les distinctions de ses membres et sa présence dans les médias.',
    'actualites.nouvelles': 'Nouvelles et distinctions',
    'actualites.medias': 'Dans les médias',
    'actualites.distinction': 'Distinction',
    'actualites.en_savoir_plus': 'En savoir plus',
    'galerie.titre': 'Galerie',
    'galerie.intro': 'La vie du laboratoire, en images.',
    'galerie.photos': 'photos',
    'galerie.photo': 'photo',
    'galerie.retour': 'Tous les albums',
    'galerie.fermer': 'Fermer',
    'galerie.precedente': 'Photo précédente',
    'galerie.suivante': 'Photo suivante',
    'contact.coordonnees': 'Coordonnées',
    'contact.courriel': 'Courriel',
    'contact.telephone': 'Téléphone',
    'pied.suivre': 'Suivre le LABE',
    'pied.maj': 'Contenu mis à jour par le LABE',
  },
  en: {},
} as const;

type Cle = keyof (typeof ui)['fr'];

export function t(lang: string, cle: Cle): string {
  const dict = (ui as Record<string, Record<string, string>>)[lang] ?? {};
  return dict[cle] ?? ui.fr[cle];
}

export function lien(lang: string, chemin = ''): string {
  const propre = chemin.replace(/^\/+|\/+$/g, '');
  return `/${lang}/${propre ? propre + '/' : ''}`;
}

export function dateLongue(d: Date, lang: string): string {
  return d.toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
