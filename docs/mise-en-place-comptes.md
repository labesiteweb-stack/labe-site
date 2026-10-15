# Comptes et procédures du site du LABE

La mise en place est terminée (octobre 2026). Ce document décrit comment le site est branché et ce qu'il reste à faire le jour du nom de domaine et le jour de la remise à Isabelle.

Aucun mot de passe, code de récupération ou secret n'est écrit ici : ce dépôt est public. Ils sont rangés dans le coffre de mots de passe.

Les sites de GitHub, Vercel et Cloudflare sont en anglais : les noms de boutons sont écrits tels qu'ils apparaissent à l'écran. Ces sites changent parfois leurs écrans. Si un écran ne correspond pas, envoie une capture à Claude plutôt que de deviner.

## Comment le site est branché

| Élément | Adresse ou nom | Rôle |
| --- | --- | --- |
| Gmail dédié | (voir le coffre) | La seule clé de tout le site. Cloudflare s'ouvre avec cette adresse, GitHub aussi. |
| GitHub | compte `labesiteweb-stack`, dépôt public `labe-site` | Garde les fichiers du site. Chaque modification faite dans le CMS y est enregistrée. |
| GitHub, deuxième dépôt | `sveltia-cms-auth` | Copie du service de connexion, créée par Cloudflare. Ne pas supprimer. |
| GitHub, application OAuth | `LABE, gestion du contenu` | Permet de se connecter au CMS avec un compte GitHub. |
| Vercel | projet `labe-site`, connexion par « Continue with GitHub » | Publie le site. Republie tout seul en une ou deux minutes à chaque changement sur GitHub. |
| Site | https://labe-site.vercel.app | Adresse publique en attendant le nom de domaine. |
| CMS | https://labe-site.vercel.app/admin/ | Interface de modification du contenu. |
| Cloudflare | Worker `sveltia-cms-auth` | Service de connexion au CMS, à l'adresse `https://sveltia-cms-auth.labesiteweb-5b0.workers.dev`. |

**Réglages du Worker Cloudflare** (« Settings », « Runtime variables and secrets », tous de type Secret) :

- `GITHUB_CLIENT_ID` : l'identifiant de l'application OAuth GitHub.
- `GITHUB_CLIENT_SECRET` : le secret de l'application OAuth GitHub.
- `ALLOWED_DOMAINS` : les adresses autorisées à utiliser le service, séparées par des virgules, sans `https://`. Aujourd'hui : `labe-site.vercel.app`.

**Réglages de l'application OAuth GitHub** (photo de profil, « Settings », « Developer settings », « OAuth Apps ») :

- « Homepage URL » : `https://labe-site.vercel.app`
- « Redirect URI » : `https://sveltia-cms-auth.labesiteweb-5b0.workers.dev/callback`
- « Expire user access tokens » : décoché. Si cette case est cochée, le CMS déconnecte ses utilisateurs toutes les quelques heures.

## Comment le site est mis à jour

- **Contenu (nouvelles, équipe, projets, publications, photos)** : dans le CMS. La modification apparaît sur le site environ deux minutes après « Enregistrer ».
- **Code, design, structure** : Claude modifie les fichiers et les envoie directement sur GitHub. Le compte GitHub du LABE est relié à Claude dans les réglages de Claude (« Connecteurs »). Aucun logiciel n'est nécessaire.
- **Vérifier une mise à jour** : sur Vercel, projet `labe-site`, onglet « Deployments ». La plus récente doit être « Ready ». Si elle est en erreur, envoyer une capture à Claude.

## Le jour du nom de domaine

L'adresse `labe-site.vercel.app` continue de fonctionner pendant et après la transition.

1. **Vercel** : projet `labe-site`, « Settings », « Domains », ajouter le domaine, puis copier chez le vendeur du domaine les réglages DNS que Vercel affiche.
2. **Cloudflare** : Worker `sveltia-cms-auth`, « Settings », variable `ALLOWED_DOMAINS`, « Rotate », et entrer les deux adresses séparées par une virgule, par exemple `labe-site.vercel.app,labe.umontreal.ca`. Puis « Deploy ».
3. **GitHub** : application OAuth `LABE, gestion du contenu`, remplacer la « Homepage URL » par le nouveau domaine. La « Redirect URI » ne change pas.
4. **Claude** : met à jour l'adresse du site dans `astro.config.mjs` et dans `public/admin/config.yml`.
5. **Test** : ouvrir `https://<nouveau domaine>/admin/`, se connecter, modifier un mot dans une nouvelle, vérifier qu'il apparaît sur le site, puis le retirer.

Si le domaine est acheté, le titulaire inscrit chez le vendeur doit être Isabelle ou le LABE, et le renouvellement automatique doit être activé.

## Avant la remise à Isabelle

**Comptes**

- **Gmail dédié** : Isabelle choisit un nouveau mot de passe. Remplacer le téléphone et l'adresse de récupération par les siens, déplacer la validation en deux étapes sur son téléphone, générer de nouveaux codes de secours.
- **GitHub** : refaire la validation en deux étapes sur son téléphone et générer de nouveaux codes de récupération.
- **Cloudflare** : nouveau mot de passe choisi par Isabelle.
- **Vercel** : rien à faire, la connexion passe par GitHub.
- **Vendeur du domaine** (si domaine acheté) : nouveau mot de passe, courriel d'Isabelle en contact.

**Accès de Claude et de l'intermédiaire**

- Décider avec Isabelle qui intervient sur le code après la remise.
- Si l'accès de Claude doit cesser : dans GitHub (compte `labesiteweb-stack`), « Settings », « Applications », révoquer l'application Claude. Retirer aussi le compte GitHub du LABE des connecteurs de Claude.
- Si une autre personne doit pouvoir modifier le code : dépôt `labe-site`, « Settings », « Collaborators », « Add people ».

**Test final avec Isabelle** : elle se connecte au CMS avec le compte GitHub du LABE, modifie un mot dans une nouvelle, vérifie qu'il apparaît sur le site, puis le retire.
