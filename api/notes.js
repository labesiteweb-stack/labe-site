/*
 * Notes de révision du site (mode « Commenter » de l'aperçu).
 *
 * Fonction Vercel. Elle ne répond que sur les aperçus : en production, elle renvoie 404,
 * comme si elle n'existait pas. Les notes sont gardées dans une base Redis (Upstash)
 * reliée au projet dans Vercel, onglet « Storage ». Elles ne vont jamais dans le dépôt GitHub.
 *
 * GET  /api/notes            → { notes: [...] }
 * POST /api/notes  { action: 'creer' | 'repondre' | 'statut' | 'supprimer', ... }
 */

const CLE = 'labe:notes';
const MAX_NOTES = 3000;
const LIMITES = { note: 4000, auteur: 60, page: 300, selecteur: 1200, apercu: 200, libelle: 80, titre: 200 };

const json = (donnees, statut = 200) =>
  new Response(JSON.stringify(donnees), {
    status: statut,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });

/** Trouve l'adresse et le jeton de la base, quels que soient les noms donnés par l'intégration Vercel. */
function connexion() {
  const env = process.env;
  const cleUrl = Object.keys(env).find((k) => /(KV_REST_API_URL|UPSTASH_REDIS_REST_URL)$/.test(k));
  if (!cleUrl) return null;
  const prefixe = cleUrl.replace(/(KV_REST_API_URL|UPSTASH_REDIS_REST_URL)$/, '');
  const jeton = env[`${prefixe}KV_REST_API_TOKEN`] ?? env[`${prefixe}UPSTASH_REDIS_REST_TOKEN`];
  return jeton ? { url: env[cleUrl].replace(/\/$/, ''), jeton } : null;
}

async function redis(cnx, commande) {
  const r = await fetch(cnx.url, {
    method: 'POST',
    headers: { authorization: `Bearer ${cnx.jeton}`, 'content-type': 'application/json' },
    body: JSON.stringify(commande),
  });
  const corps = await r.json().catch(() => ({}));
  if (!r.ok || corps.error) throw new Error(corps.error || `Redis ${r.status}`);
  return corps.result;
}

const texte = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const nombre = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0.5);

function garde() {
  if (process.env.VERCEL_ENV === 'production') return json({ erreur: 'introuvable' }, 404);
  const cnx = connexion();
  if (!cnx) return json({ erreur: 'stockage', message: "La base des notes n'est pas encore reliée au projet." }, 503);
  return cnx;
}

async function lire(cnx, id) {
  const brut = await redis(cnx, ['HGET', CLE, id]);
  return brut ? JSON.parse(brut) : null;
}

export async function GET() {
  const cnx = garde();
  if (cnx instanceof Response) return cnx;
  try {
    const brut = (await redis(cnx, ['HGETALL', CLE])) ?? [];
    const notes = [];
    for (let i = 1; i < brut.length; i += 2) {
      try {
        notes.push(JSON.parse(brut[i]));
      } catch {}
    }
    notes.sort((a, b) => a.numero - b.numero);
    return json({ notes });
  } catch (e) {
    return json({ erreur: 'base', message: String(e.message || e) }, 502);
  }
}

export async function POST(request) {
  const cnx = garde();
  if (cnx instanceof Response) return cnx;
  let d;
  try {
    d = await request.json();
  } catch {
    return json({ erreur: 'requete' }, 400);
  }
  if (d && d.piege) return json({ ok: true }); // champ invisible rempli : robot
  const maintenant = new Date().toISOString();

  try {
    if (d.action === 'creer') {
      const note = texte(d.note, LIMITES.note);
      const page = texte(d.page, LIMITES.page);
      if (!note || !page.startsWith('/')) return json({ erreur: 'champs', message: 'La note et la page sont obligatoires.' }, 400);
      const total = await redis(cnx, ['HLEN', CLE]);
      if (total >= MAX_NOTES) return json({ erreur: 'plein', message: 'Nombre maximal de notes atteint.' }, 409);
      const numero = await redis(cnx, ['INCR', `${CLE}:compteur`]);
      const n = {
        id: `n${numero}-${Math.random().toString(36).slice(2, 8)}`,
        numero,
        page,
        titre: texte(d.titre, LIMITES.titre),
        selecteur: texte(d.selecteur, LIMITES.selecteur),
        apercu: texte(d.apercu, LIMITES.apercu),
        libelle: texte(d.libelle, LIMITES.libelle),
        x: nombre(d.x),
        y: nombre(d.y),
        note,
        auteur: texte(d.auteur, LIMITES.auteur) || 'Anonyme',
        date: maintenant,
        statut: 'a-faire',
        reponses: [],
      };
      await redis(cnx, ['HSET', CLE, n.id, JSON.stringify(n)]);
      return json({ note: n }, 201);
    }

    const id = texte(d.id, 40);
    const n = id ? await lire(cnx, id) : null;
    if (!n) return json({ erreur: 'introuvable', message: 'Cette note n’existe plus.' }, 404);

    if (d.action === 'repondre') {
      const t = texte(d.texte, LIMITES.note);
      if (!t) return json({ erreur: 'champs', message: 'La réponse est vide.' }, 400);
      if (n.reponses.length >= 100) return json({ erreur: 'plein' }, 409);
      n.reponses.push({ auteur: texte(d.auteur, LIMITES.auteur) || 'Anonyme', texte: t, date: maintenant });
    } else if (d.action === 'statut') {
      if (!['a-faire', 'fait'].includes(d.statut)) return json({ erreur: 'champs' }, 400);
      n.statut = d.statut;
      n.statut_date = maintenant;
    } else if (d.action === 'supprimer') {
      await redis(cnx, ['HDEL', CLE, id]);
      return json({ ok: true });
    } else {
      return json({ erreur: 'action' }, 400);
    }
    await redis(cnx, ['HSET', CLE, id, JSON.stringify(n)]);
    return json({ note: n });
  } catch (e) {
    return json({ erreur: 'base', message: String(e.message || e) }, 502);
  }
}
