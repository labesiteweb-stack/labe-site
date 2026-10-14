# Mise en place des comptes du site du LABE

Ce guide se suit dans l'ordre, une étape à la fois. Chaque étape dit quoi ouvrir, où cliquer, quoi noter. Les sites de GitHub, Vercel et Cloudflare sont en anglais : les noms de boutons sont donc écrits en anglais, entre guillemets, tels qu'ils apparaissent à l'écran.

Si un écran ne ressemble pas à ce qui est décrit, arrête-toi et envoie une capture d'écran à Claude. Ces sites changent parfois leurs écrans, et mieux vaut demander que deviner.

## Avant de commencer

**À quoi sert chaque compte**

| Compte | Rôle |
| --- | --- |
| Gmail dédié | La seule clé de tout le site. Tous les autres comptes s'ouvrent avec cette adresse. Isabelle la recevra à la remise. |
| GitHub | Garde les fichiers du site (textes, photos, code). Chaque modification faite dans le CMS y est enregistrée. |
| GitHub Desktop | Petit logiciel à installer sur ton ordinateur. Il envoie le dossier du site vers GitHub. |
| Vercel | Publie le site sur Internet. Chaque fois que GitHub change, Vercel republie le site tout seul en une minute ou deux. |
| Cloudflare | Héberge un petit service qui permet de se connecter au CMS avec son compte GitHub. |

**Ce qu'il te faut sous la main**

- Le dossier du site, décompressé à partir de `labe-site.zip`. Place-le dans un dossier simple, par exemple `Documents/labe-site`. Évite un dossier synchronisé par OneDrive, Dropbox ou iCloud.
- Ton téléphone, avec une application d'authentification installée : Google Authenticator ou Microsoft Authenticator (gratuites).
- Un gestionnaire de mots de passe (le « coffre »). Si tu n'en as pas encore, Bitwarden a une version gratuite. Crée dans le coffre une entrée par compte au fur et à mesure.

**La règle des notes.** Dans ce guide, chaque élément marqué « Coffre » va dans le gestionnaire de mots de passe, et chaque élément marqué « À envoyer à Claude » va dans un message à Claude à la fin.

## Étape 1. Créer le Gmail dédié

1. Va sur https://accounts.google.com/signup.
2. Prénom : `LABE`. Nom : `Site web`. Ce nom est visible dans les courriels envoyés par le compte.
3. Choisis une adresse du genre `labe.siteweb@gmail.com`. Si elle est prise, Google propose des variantes.
4. Choisis un mot de passe long, généré par le gestionnaire de mots de passe.
5. Google demande un numéro de téléphone pour vérifier le compte. Donne le tien pour l'instant. Il sera remplacé par celui d'Isabelle à la remise.
6. Si Google propose une adresse de récupération, mets la tienne pour l'instant (elle aussi sera remplacée).
7. Une fois dans la boîte courriel, active la validation en deux étapes : clique sur l'icône du compte en haut à droite, puis « Gérer votre compte Google », onglet « Sécurité », section « Validation en deux étapes ». Suis les écrans et choisis l'application d'authentification.
8. Dans la même section, génère les « Codes de secours » et copie-les.

**Coffre :** adresse Gmail, mot de passe, codes de secours Google.

## Étape 2. Créer le compte GitHub

1. Va sur https://github.com/signup.
2. Entre l'adresse du Gmail dédié, un nouveau mot de passe (généré par le coffre) et un nom d'utilisateur. Ce nom apparaîtra dans l'adresse du dépôt, par exemple `github.com/labe-udem`. Choisis quelque chose de sobre, comme `labe-udem` ou `labe-siteweb`.
3. GitHub envoie un code de vérification au Gmail dédié. Ouvre le Gmail et recopie le code.
4. Si GitHub pose des questions sur ton usage ou propose un forfait payant, passe ou choisis l'option gratuite (« Free »).

**Activer la validation en deux étapes (obligatoire sur GitHub)**

5. Clique sur ta photo de profil en haut à droite, puis « Settings ».
6. Dans le menu de gauche, clique sur « Password and authentication ».
7. Clique sur « Enable two-factor authentication ».
8. Scanne le code QR avec l'application d'authentification du téléphone, puis entre le code à six chiffres qu'elle affiche.
9. GitHub affiche des « recovery codes ». Clique sur « Download » et range le fichier dans le coffre. Sans ces codes, un téléphone perdu peut bloquer l'accès au compte pour de bon.

**Coffre :** nom d'utilisateur GitHub, mot de passe, codes de récupération GitHub.
**À envoyer à Claude :** le nom d'utilisateur GitHub.

## Étape 3. Envoyer le dossier du site vers GitHub

On utilise GitHub Desktop, qui fait tout avec des boutons.

1. Télécharge GitHub Desktop sur https://desktop.github.com et installe-le.
2. À l'ouverture, clique sur « Sign in to GitHub.com ». Le navigateur s'ouvre : connecte-toi avec le compte GitHub **dédié** (pas un compte personnel), puis autorise GitHub Desktop.
3. GitHub Desktop demande un nom et une adresse pour signer les modifications (écran « Configure Git »). Garde le nom et l'adresse proposés par le compte dédié, puis « Finish ».
4. Dans le menu du haut, clique sur « File », puis « Add local repository… ».
5. Clique sur « Choose… » et sélectionne le dossier `labe-site` décompressé (le dossier lui-même, pas un fichier à l'intérieur). Clique sur « Add repository ».
6. En haut de la fenêtre, clique sur le bouton « Publish repository ».
7. Dans la fenêtre qui s'ouvre :
   - « Name » : laisse `labe-site`.
   - **Décoche** « Keep this code private ». Le dépôt doit être public (voir l'encadré plus bas).
   - Si un menu « Organization » apparaît, laisse « None ».
8. Clique sur « Publish Repository ». L'envoi prend une ou deux minutes.
9. Vérifie : va sur `https://github.com/<nom d'utilisateur>/labe-site`. Tu dois voir la liste des dossiers du site (`public`, `src`, `docs`…).

> **Pourquoi un dépôt public.** Le forfait gratuit de Vercel refuse de publier les modifications envoyées par une autre personne que le propriétaire quand le dépôt est privé. Avec un dépôt public, cette restriction ne s'applique pas, ce qui laisse la porte ouverte à un intervenant technique plus tard. Le dépôt ne contient aucun mot de passe ni aucune clé : seulement le contenu déjà visible sur le site. À savoir quand même : une fiche marquée « Masquer du site » dans le CMS n'apparaît pas sur le site, mais elle reste lisible dans le dépôt GitHub. Rien de confidentiel ne doit donc être écrit dans le CMS.

## Étape 4. Publier le site avec Vercel

1. Va sur https://vercel.com/signup.
2. Vercel demande le type de projet : choisis l'option pour les projets personnels (« Hobby »), qui est gratuite. Entre `LABE` comme nom si on te le demande.
3. Choisis « Continue with GitHub ». Si le navigateur est déjà connecté au compte GitHub dédié, Vercel s'y relie directement. Sinon, connecte-toi avec le compte dédié.
4. Une fois dans Vercel, clique sur « Add New… » (en haut à droite), puis « Project ».
5. Dans la section « Import Git Repository », Vercel peut demander d'installer son application sur GitHub (« Install »). Accepte. Sur l'écran de GitHub qui suit, choisis « Only select repositories », sélectionne `labe-site`, puis « Install ».
6. De retour sur Vercel, clique sur « Import » à côté de `labe-site`.
7. L'écran « Configure Project » s'affiche. Vercel reconnaît le site tout seul (il affiche « Astro »). Ne change rien et clique sur « Deploy ».
8. Attends une ou deux minutes. Un écran de félicitations apparaît avec un aperçu du site.
9. Clique sur « Continue to Dashboard ». Dans la zone « Domains », Vercel affiche l'adresse du site, du genre `labe-site.vercel.app` (parfois avec quelques lettres en plus si le nom est déjà pris). Ouvre-la : le site du LABE doit s'afficher.

Rien à régler côté version de Node : le site l'indique lui-même dans ses fichiers.

**À envoyer à Claude :** l'adresse exacte du site affichée dans « Domains ».

## Étape 5. Créer le service de connexion sur Cloudflare

Ce service permet à Isabelle de cliquer sur « Se connecter avec GitHub » dans le CMS. Sans lui, il faudrait copier un code d'accès à la main.

1. Va sur https://dash.cloudflare.com/sign-up. Inscris-toi avec le Gmail dédié et un nouveau mot de passe. Confirme l'adresse avec le courriel reçu.
2. Ouvre ce lien, qui lance l'installation du service prêt à l'emploi :
   https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth
3. Cloudflare demande de relier un compte GitHub : choisis GitHub et accepte avec le compte **dédié**. Cloudflare va créer une copie du service dans ce compte GitHub, c'est normal (un deuxième dépôt nommé `sveltia-cms-auth` apparaîtra).
4. Sur la page de configuration, garde les noms proposés et clique sur le bouton de déploiement (« Create and deploy » ou « Deploy »).
5. Attends la fin du déploiement. Cloudflare affiche l'adresse du service, de la forme `https://sveltia-cms-auth.<quelque-chose>.workers.dev`. Si tu ne la vois pas : menu de gauche « Workers & Pages », clique sur `sveltia-cms-auth`, l'adresse est affichée sur sa page.

**À envoyer à Claude :** l'adresse du service (celle qui finit par `.workers.dev`).

## Étape 6. Créer l'application de connexion sur GitHub

Cette étape crée l'identifiant que le service Cloudflare utilisera pour parler à GitHub.

1. Sur https://github.com, connecté avec le compte dédié, clique sur ta photo de profil en haut à droite, puis « Settings ».
2. Tout en bas du menu de gauche, clique sur « Developer settings ».
3. Clique sur « OAuth Apps », puis sur « New OAuth App » (ou « Register a new application » si c'est la première).
4. Remplis les champs :
   - « Application name » : `LABE, gestion du contenu`
   - « Homepage URL » : l'adresse du site Vercel, par exemple `https://labe-site.vercel.app`
   - « Application description » : laisse vide.
   - « Authorization callback URL » : l'adresse du service Cloudflare, **suivie de** `/callback`. Par exemple : `https://sveltia-cms-auth.labe.workers.dev/callback`
   - « Enable Device Flow » : laisse décoché.
   - « Expire user access tokens » : **décoche**. Le service de connexion ne sait pas renouveler un accès expiré; avec cette case cochée, Isabelle serait déconnectée du CMS toutes les quelques heures.
5. Clique sur « Register application ».
6. La page de l'application affiche un « Client ID ». Copie-le.
7. Clique sur « Generate a new client secret ». GitHub peut redemander le code à six chiffres. Le secret s'affiche **une seule fois** : copie-le tout de suite.

**Coffre :** Client ID et Client secret.
**Ne pas envoyer le Client secret à Claude ni à personne.** Il sert uniquement à l'étape suivante.

## Étape 7. Donner les identifiants au service Cloudflare

1. Sur https://dash.cloudflare.com, menu de gauche « Workers & Pages », clique sur `sveltia-cms-auth`.
2. Clique sur l'onglet « Settings ».
3. Dans la section « Variables and Secrets », clique sur « Add ».
4. Ajoute ces trois éléments, un à la fois (« Add variable » pour en ajouter un autre) :

| Type | Variable name | Value |
| --- | --- | --- |
| Secret | `GITHUB_CLIENT_ID` | le Client ID de l'étape 6 |
| Secret | `GITHUB_CLIENT_SECRET` | le Client secret de l'étape 6 |
| Text | `ALLOWED_DOMAINS` | l'adresse du site **sans** `https://`, par exemple `labe-site.vercel.app` |

5. Clique sur « Deploy » pour enregistrer.

Attention aux noms : ils s'écrivent exactement comme dans le tableau, en majuscules, avec des traits de soulignement.

## Étape 8. Envoyer les informations à Claude

Envoie à Claude, dans un seul message :

- le nom d'utilisateur GitHub dédié (étape 2);
- l'adresse du site Vercel (étape 4);
- l'adresse du service Cloudflare (étape 5).

Claude prépare la modification du fichier de configuration du CMS et te dit exactement quoi remplacer. La modification se fait directement sur le site de GitHub, sans logiciel.

## Étape 9. Tester la connexion au CMS

Après la modification de l'étape 8, attends deux minutes que Vercel republie le site, puis :

1. Ouvre `https://<adresse du site>/admin/` dans Chrome, Edge ou Firefox.
2. Clique sur « Se connecter avec GitHub ».
3. Une fenêtre GitHub demande d'autoriser « LABE, gestion du contenu ». Clique sur « Authorize ».
4. Le CMS s'ouvre sur la liste des nouvelles.
5. Test : ouvre une nouvelle, ajoute un mot à la fin du texte, clique sur « Enregistrer ». Attends deux minutes et recharge la page Actualités du site : le mot doit apparaître. Retire-le ensuite de la même façon.

Si une étape bloque, envoie à Claude une capture d'écran du message affiché.

## Plus tard

**Quand Claude t'envoie une mise à jour du site.** Claude fournit alors un petit fichier compressé contenant seulement les fichiers modifiés.

1. Ouvre GitHub Desktop et clique sur « Fetch origin », puis « Pull origin » s'il apparaît. Cela récupère d'abord les changements faits dans le CMS.
2. Décompresse la mise à jour et copie ses fichiers dans le dossier `labe-site`, en acceptant de remplacer les fichiers existants.
3. Dans GitHub Desktop, en bas à gauche, écris un court résumé (par exemple « Mise à jour de la page Équipe ») et clique sur « Commit to main ».
4. Clique sur « Push origin ». Vercel republie le site.

**Le jour du vrai nom de domaine**

- Vercel : projet `labe-site`, « Settings », « Domains », ajouter le domaine et suivre les instructions affichées.
- Cloudflare : dans `ALLOWED_DOMAINS`, ajouter le domaine après une virgule, par exemple `labe-site.vercel.app,labe.umontreal.ca`.
- GitHub : dans l'application OAuth, remplacer la « Homepage URL » par le nouveau domaine.
- Claude met à jour l'adresse du site dans le code.

**Avant la remise à Isabelle**

- Si une autre personne doit pouvoir modifier le code après la remise (toi ou quelqu'un du labo), l'inviter sur le dépôt : `labe-site`, « Settings », « Collaborators », « Add people ».
- Remplacer le numéro de téléphone et l'adresse de récupération du Gmail par ceux d'Isabelle, et transférer l'application d'authentification sur son téléphone.
