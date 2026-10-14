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
