import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

type AvecBrouillon = { data: { brouillon?: boolean } };

/** Entrées publiées d'une collection traduisible, pour une langue (dossier src/content/<collection>/<langue>/). */
export async function parLangue<C extends CollectionKey>(collection: C, lang: string) {
  const tout = await getCollection(collection);
  return tout.filter(
    (e) => e.id.startsWith(`${lang}/`) && !(e as unknown as AvecBrouillon).data.brouillon,
  ) as CollectionEntry<C>[];
}

/** Entrées publiées d'une collection sans langue (publications, médias, galerie, partenaires). */
export async function publiees<C extends CollectionKey>(collection: C) {
  const tout = await getCollection(collection);
  return tout.filter((e) => !(e as unknown as AvecBrouillon).data.brouillon) as CollectionEntry<C>[];
}

/** Identifiant sans le préfixe de langue (« fr/coactif » devient « coactif »). */
export const slug = (id: string) => id.replace(/^[a-z]{2}\//, '');

/** Un projet est en cours tant que son année de fin n'est pas passée. Le statut se met à jour à chaque publication du site. */
export const enCours = (fin: number) => fin >= new Date().getFullYear();

export const periode = (debut: number, fin: number) => (debut === fin ? `${debut}` : `${debut}–${fin}`);

const echapper = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const echapperRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function motif(alias: string) {
  const morceaux = alias.trim().split(/\s+/);
  const initiales = morceaux.pop() ?? '';
  const nom = morceaux.join('\\s+');
  // « Piché A » reconnaît aussi « Piché, A. » et « Piché AB », sans déborder sur l'auteur suivant.
  return `(?<![\\p{L}-])${nom.split('\\s+').map(echapperRegex).join('\\s+')},?\\s+${echapperRegex(initiales[0])}(?:\\.?-?\\p{Lu})*\\.?(?=[,;&)\\s]|$)`;
}

export type Surlignage = { direction: string[]; membres: string[] };

/** Met en gras la directrice et en couleur les membres du LABE dans une liste d'auteurs. */
export function surligner(auteurs: string, noms: Surlignage) {
  let html = echapper(auteurs);
  const remplacer = (alias: string[], classe: string) => {
    for (const a of alias) {
      if (!a.trim()) continue;
      html = html.replace(new RegExp(motif(echapper(a)), 'gu'), (m) => `<span class="${classe}">${m}</span>`);
    }
  };
  remplacer(noms.direction, 'auteur-direction');
  remplacer(noms.membres, 'auteur-membre');
  return html;
}

export async function nomsAsurligner(lang: string): Promise<Surlignage> {
  const equipe = await getCollection('equipe');
  const membres = equipe.filter((e) => e.id.startsWith(`${lang}/`));
  return {
    direction: membres.filter((m) => m.data.role === 'direction').flatMap((m) => m.data.nom_publication),
    membres: membres.filter((m) => m.data.role !== 'direction').flatMap((m) => m.data.nom_publication),
  };
}

/** Paragraphes d'un champ texte simple (lignes vides = nouveau paragraphe). */
export const paragraphes = (texte: string) => texte.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * Version d'aperçu : vraie partout sauf sur le site de production de Vercel.
 * Elle affiche les étiquettes « À valider » et le mode Commenter, jamais sur le site en ligne.
 */
export const APERCU = process.env.VERCEL_ENV !== 'production';

/** Projets phares : cochés dans le CMS, triés par ordre, cinq au plus. */
export async function projetsPhares(lang: string) {
  return (await parLangue('projets', lang))
    .filter((p) => p.data.phare && projetAUnePage(p))
    .sort((a, b) => a.data.ordre - b.data.ordre || b.data.debut - a.data.debut)
    .slice(0, 5);
}

/** Titre à afficher dans les menus et les cartes : le titre court s'il existe. */
export const titreCourt = (p: { data: { titre: string; titre_court?: string } }) => p.data.titre_court ?? p.data.titre;

/**
 * Un projet a sa propre page seulement s'il a une description (le texte de la fiche dans le CMS).
 * Sans description, il reste une ligne de la liste : une page n'aurait rien de plus à montrer.
 * Dès qu'une description est ajoutée dans le CMS, la page se crée et le titre devient cliquable.
 */
export const projetAUnePage = (p: { body?: string }) => Boolean(p.body?.trim());

/** Initiales pour le monogramme d'un portrait absent (« Isabelle Doré, Ph. D. » donne « ID »). */
export function initiales(nom: string) {
  const mots = nom.replace(/,.*$/, '').split(/\s+/).filter((m) => /^\p{Lu}/u.test(m));
  return ((mots[0]?.[0] ?? '') + (mots.length > 1 ? mots[mots.length - 1][0] : '')).toUpperCase();
}

const MOTS_FR = /\b(le|la|les|des|du|une|un|et|pour|chez|dans|sur|avec|aux|au|santé|activité|étude|programme|jeunes|entre|d'|l')\b|[éèêàùçôî]/i;

/** Langue d'un titre de publication : le champ du CMS, sinon une détection simple (accents et mots courants). */
export const langueTitre = (titre: string, langue?: 'fr' | 'en') => langue ?? (MOTS_FR.test(titre) ? 'fr' : 'en');

/** Extrait d'une nouvelle : le champ du CMS, sinon le début du texte, coupé proprement. */
export function extrait(texte: string | undefined, max = 180) {
  const brut = (texte ?? '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#>`]/g, '').replace(/\s+/g, ' ').trim();
  if (brut.length <= max) return brut;
  const coupe = brut.slice(0, max);
  return coupe.slice(0, coupe.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
}

/** Texte saisi dans le CMS avec des *astérisques* : le mot entouré passe en italique. */
export const emphase = (s: string) => echapper(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

/** Retire les astérisques d'emphase (pour les balises title et les attributs). */
export const sansEmphase = (s: string) => s.replace(/\*/g, '');
