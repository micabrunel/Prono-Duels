// Contenu du jeu : 5 niveaux, du plus doux au plus chaud.
// Chaque carte propose un choix à l'aveugle (Choix 1 / Choix 2).
// Une fois le choix fait, l'action se révèle.
//
// 👉 Tu peux modifier librement ce fichier pour adapter le jeu à votre couple.

export const LEVELS = [
  {
    level: 1,
    name: "Tendresse",
    emoji: "🌹",
    tagline: "Pour s'apprivoiser en douceur",
    color: "#ff8fab",
    cards: [
      {
        teaser: "Un mot doux pour commencer…",
        choices: [
          { label: "Choix 1", action: "Regarde-le dans les yeux pendant 20 secondes, sans rien dire, juste un sourire." },
          { label: "Choix 2", action: "Murmure-lui à l'oreille ce que tu as préféré chez lui aujourd'hui." }
        ]
      },
      {
        teaser: "Une petite attention…",
        choices: [
          { label: "Choix 1", action: "Dépose un baiser dans son cou, tout doucement." },
          { label: "Choix 2", action: "Prends-lui la main et embrasse l'intérieur de son poignet." }
        ]
      },
      {
        teaser: "On se rapproche…",
        choices: [
          { label: "Choix 1", action: "Installe-toi sur ses genoux et fais-lui un câlin de 30 secondes." },
          { label: "Choix 2", action: "Glisse-toi derrière lui et masse-lui les épaules une minute." }
        ]
      },
      {
        teaser: "Un compliment qui fait monter le rouge…",
        choices: [
          { label: "Choix 1", action: "Dis-lui à voix haute ce qui te plaît le plus dans son corps." },
          { label: "Choix 2", action: "Raconte-lui le souvenir le plus chaud que tu gardes de vous deux." }
        ]
      },
      {
        teaser: "Le premier vrai baiser de la soirée…",
        choices: [
          { label: "Choix 1", action: "Embrasse-le langoureusement pendant 15 secondes." },
          { label: "Choix 2", action: "Mordille-lui doucement la lèvre inférieure avant de l'embrasser." }
        ]
      }
    ]
  },
  {
    level: 2,
    name: "Frissons",
    emoji: "🔥",
    tagline: "Les caresses entrent en jeu",
    color: "#ff6b6b",
    cards: [
      {
        teaser: "Les mains se baladent…",
        choices: [
          { label: "Choix 1", action: "Caresse-lui le torse du bout des doigts, sous le tee-shirt." },
          { label: "Choix 2", action: "Passe tes ongles le long de son dos, très lentement." }
        ]
      },
      {
        teaser: "On enlève une couche…",
        choices: [
          { label: "Choix 1", action: "Retire-lui un vêtement de ton choix, sans te presser." },
          { label: "Choix 2", action: "Enlève toi-même un vêtement… et laisse-le regarder." }
        ]
      },
      {
        teaser: "Un massage qui réchauffe…",
        choices: [
          { label: "Choix 1", action: "Masse-lui le bas du dos en t'aventurant un peu plus bas." },
          { label: "Choix 2", action: "Allonge-toi sur lui et fais glisser ton corps contre le sien." }
        ]
      },
      {
        teaser: "La bouche s'invite…",
        choices: [
          { label: "Choix 1", action: "Embrasse-le dans le cou puis descends jusqu'à la clavicule." },
          { label: "Choix 2", action: "Parsème son ventre de baisers, en remontant doucement." }
        ]
      },
      {
        teaser: "Un défi à deux…",
        choices: [
          { label: "Choix 1", action: "Embrassez-vous sans utiliser les mains pendant une minute entière." },
          { label: "Choix 2", action: "Slow collé-serré sur la chanson de votre choix, lumières tamisées." }
        ]
      }
    ]
  },
  {
    level: 3,
    name: "Montée en température",
    emoji: "🌶️",
    tagline: "Ça devient sérieux…",
    color: "#e63946",
    cards: [
      {
        teaser: "On taquine…",
        choices: [
          { label: "Choix 1", action: "Caresse-le par-dessus les sous-vêtements, sans aller plus loin… encore." },
          { label: "Choix 2", action: "Guide sa main là où tu veux qu'il te touche." }
        ]
      },
      {
        teaser: "Les yeux bandés…",
        choices: [
          { label: "Choix 1", action: "Bande-lui les yeux et fais-lui deviner où tu vas l'embrasser." },
          { label: "Choix 2", action: "Laisse-le te bander les yeux et te caresser pendant deux minutes." }
        ]
      },
      {
        teaser: "Plus que les dessous…",
        choices: [
          { label: "Choix 1", action: "Déshabillez-vous mutuellement, jusqu'aux sous-vêtements." },
          { label: "Choix 2", action: "Fais-lui un petit effeuillage rien que pour lui." }
        ]
      },
      {
        teaser: "La langue mène la danse…",
        choices: [
          { label: "Choix 1", action: "Embrasse l'intérieur de ses cuisses, en te rapprochant lentement." },
          { label: "Choix 2", action: "Laisse-le t'embrasser partout… sauf là où tu en as le plus envie." }
        ]
      },
      {
        teaser: "Une règle du jeu…",
        choices: [
          { label: "Choix 1", action: "Interdiction de l'embrasser sur la bouche pendant 3 minutes. Tout le reste est permis." },
          { label: "Choix 2", action: "Il a le droit de te toucher partout, mais toi tu dois rester immobile." }
        ]
      }
    ]
  },
  {
    level: 4,
    name: "Désirs",
    emoji: "💋",
    tagline: "Plus rien ne vous arrête",
    color: "#c1121f",
    cards: [
      {
        teaser: "Le grand jeu…",
        choices: [
          { label: "Choix 1", action: "Offre-lui un préliminaire avec la bouche, à ta façon." },
          { label: "Choix 2", action: "Allonge-toi et laisse-le s'occuper de toi avec sa bouche." }
        ]
      },
      {
        teaser: "Qui commande ?",
        choices: [
          { label: "Choix 1", action: "Ce soir c'est toi qui mènes : dis-lui exactement quoi faire." },
          { label: "Choix 2", action: "Laisse-lui les commandes : tu suis ses envies sans discuter." }
        ]
      },
      {
        teaser: "Une position au hasard…",
        choices: [
          { label: "Choix 1", action: "Choisissez ensemble une nouvelle position que vous n'avez jamais essayée." },
          { label: "Choix 2", action: "Refaites l'amour comme la toute première fois, mêmes gestes, même fièvre." }
        ]
      },
      {
        teaser: "Confidences brûlantes…",
        choices: [
          { label: "Choix 1", action: "Dis-lui à l'oreille le fantasme dont tu n'as jamais osé parler." },
          { label: "Choix 2", action: "Demande-lui de te raconter le sien… et réalisez-en un bout ce soir." }
        ]
      },
      {
        teaser: "Le tempo…",
        choices: [
          { label: "Choix 1", action: "Le plus lentement possible : interdiction d'accélérer pendant 5 minutes." },
          { label: "Choix 2", action: "Changez de pièce pour continuer ailleurs que dans la chambre." }
        ]
      }
    ]
  },
  {
    level: 5,
    name: "Sans limites",
    emoji: "🖤",
    tagline: "La nuit ne fait que commencer",
    color: "#6a040f",
    cards: [
      {
        teaser: "Carte blanche…",
        choices: [
          { label: "Choix 1", action: "Tu réalises l'un de SES fantasmes ce soir, sans retenue." },
          { label: "Choix 2", action: "Il réalise l'UN des tiens, exactement comme tu l'imagines." }
        ]
      },
      {
        teaser: "Un accessoire entre en scène…",
        choices: [
          { label: "Choix 1", action: "Sortez un jouet ou un accessoire et intégrez-le à vos ébats." },
          { label: "Choix 2", action: "Improvisez avec un foulard et des liens légers : à lui les poignets." }
        ]
      },
      {
        teaser: "Endurance…",
        choices: [
          { label: "Choix 1", action: "Celui qui craque et termine en premier… aura un gage demain." },
          { label: "Choix 2", action: "Vous devez tenir 10 minutes avant d'aller au bout. Compte à rebours lancé." }
        ]
      },
      {
        teaser: "Le décor change…",
        choices: [
          { label: "Choix 1", action: "Faites l'amour dans une pièce inhabituelle de la maison." },
          { label: "Choix 2", action: "Devant le miroir : regardez-vous pendant que vous vous donnez l'un à l'autre." }
        ]
      },
      {
        teaser: "Le bouquet final…",
        choices: [
          { label: "Choix 1", action: "Tu prends complètement le contrôle jusqu'au bout de la nuit." },
          { label: "Choix 2", action: "Vous vous abandonnez totalement l'un à l'autre, sans aucune limite. Bonne nuit. 🖤" }
        ]
      }
    ]
  }
];
