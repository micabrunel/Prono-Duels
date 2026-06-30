# Duo Délice ❤️‍🔥

Un petit jeu coquin et tout doux pour pimenter les soirées en couple.

## Le principe

- Le jeu propose des cartes **« Choix 1 / Choix 2 »** (à la manière des petits papiers) :
  on pioche à l'aveugle, puis **l'action se révèle**.
- **5 niveaux**, du plus soft (🌹 *Tendresse*) au plus chaud (🖤 *Sans limites*).
- **C'est elle qui décide** : quel soir elle joue, et jusqu'à quel niveau elle veut monter.
- Après chaque niveau, le jeu lui propose de **continuer au niveau suivant** ou de
  **rester là pour ce soir**.
- Quand elle a fini, un **récap de la soirée est envoyé par email** (par défaut à
  `brunel.michael@gmail.com`).

## 🔒 Code d'accès

L'app est protégée par un code à l'entrée : **`2805`**.
Une fois entré, l'appareil reste déverrouillé (mémorisé dans le navigateur).
Pour le changer : modifie `ACCESS_CODE` en haut de [`public/app.js`](public/app.js).

> ⚠️ Le code est une simple barrière de confort, vérifiée côté navigateur.
> Comme le site et le dépôt sont publics, considère le contenu comme « semi-privé »
> (quelqu'un qui a l'URL et le code peut y accéder).

## Démarrage rapide (en local)

```bash
npm install
npm start
```

Puis ouvre **http://localhost:3000** (idéalement depuis son téléphone — l'app est
pensée pour le mobile).

> Sans configuration email, le jeu fonctionne quand même : à la fin, il propose un
> bouton **« Envoyer le récap manuellement »** (lien `mailto:` pré-rempli).

## 🚀 Déploiement sur Cloudflare Pages

Le projet est prêt pour Cloudflare Pages (site statique + une fonction serveur
pour l'email).

1. Va sur **https://dash.cloudflare.com** → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**, et choisis le dépôt `Duo-Delice`.
2. Réglages de build :
   - **Framework preset** : `None`
   - **Build command** : *(laisser vide)*
   - **Build output directory** : `public`
3. **Save and Deploy**. C'est en ligne 🎉

### Activer l'envoi automatique du récap (Resend)

Cloudflare ne fait pas de SMTP : l'email passe par l'API HTTP **Resend** (gratuit).

1. Crée un compte sur **https://resend.com** et génère une **clé API**.
2. Dans Cloudflare Pages → **Settings → Environment variables**, ajoute :
   - `RESEND_API_KEY` = ta clé Resend
   - `RECIPIENT_EMAIL` = `brunel.michael@gmail.com`
   - `MAIL_FROM` = `Duo Délice <onboarding@resend.dev>`
     *(ou une adresse de ton domaine vérifié dans Resend)*
3. Redéploie. La fonction [`functions/api/recap.js`](functions/api/recap.js)
   enverra alors le récap automatiquement.

> En mode test Resend, l'expéditeur `onboarding@resend.dev` ne peut envoyer
> qu'à l'adresse de ton propre compte Resend. Pour envoyer à n'importe quelle
> adresse, vérifie un domaine dans Resend.

## Personnaliser le jeu

Tout le contenu (niveaux, cartes, actions) est dans
[`public/data/duels.js`](public/data/duels.js). Modifie-le librement pour l'adapter
à votre couple : change les actions, ajoute des cartes, renomme les niveaux…

## Structure

```
public/index.html        → l'app
public/styles.css        → le style
public/app.js            → la logique du jeu (+ le code d'accès)
public/data/duels.js     → le contenu (les 5 niveaux et leurs cartes)
shared/recap.js          → construction du récap (texte + email HTML)
functions/api/recap.js   → fonction Cloudflare Pages : envoi via Resend
server.js                → serveur local Express (dev), Resend ou SMTP
wrangler.toml            → config Cloudflare Pages
.env.example             → modèle de configuration email (dev local)
```

Bon jeu 😉
