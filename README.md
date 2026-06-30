# Prono-Duels ❤️‍🔥

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

## Démarrage rapide

```bash
npm install
npm start
```

Puis ouvre **http://localhost:3000** (idéalement depuis son téléphone — l'app est
pensée pour le mobile).

> Sans configuration email, le jeu fonctionne quand même : à la fin, il propose un
> bouton **« Envoyer le récap manuellement »** (lien `mailto:` pré-rempli).

## Activer l'envoi automatique du récap par email

1. Copie le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```
2. Remplis les infos SMTP. **Avec Gmail** :
   - Active la validation en 2 étapes sur ton compte Google.
   - Crée un *mot de passe d'application* : https://myaccount.google.com/apppasswords
   - Mets ce mot de passe (16 caractères) dans `SMTP_PASS`.
3. Relance `npm start`. Au démarrage, le serveur affiche `📧 Email configuré.`

## Personnaliser le jeu

Tout le contenu (niveaux, cartes, actions) est dans
[`public/data/duels.js`](public/data/duels.js). Modifie-le librement pour l'adapter
à votre couple : change les actions, ajoute des cartes, renomme les niveaux…

## Structure

```
server.js              → serveur Express + envoi du récap par email
public/index.html      → l'app
public/styles.css      → le style
public/app.js          → la logique du jeu
public/data/duels.js   → le contenu (les 5 niveaux et leurs cartes)
.env.example           → modèle de configuration email
```

Bon jeu 😉
