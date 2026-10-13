/* =====================================================================
   MINE AUX TRÉSORS — RÉGLAGES DU JEU
   ---------------------------------------------------------------------
   Toutes les valeurs d'équilibrage sont ici. Tu peux les modifier
   librement, puis recharger la page du jeu pour voir l'effet.

   Quelques règles pour ne rien casser :
   - Ne change que les nombres (et les textes entre guillemets).
   - Garde les virgules à la fin des lignes, et les crochets [ ] / accolades { }.
   - Les durées sont en millisecondes : 1000 = 1 seconde.
   - Les pourcentages sont écrits en décimal : 0.12 = 12 %.
   ===================================================================== */

window.CONFIG = {
  // Version affichée en bas des Paramètres (avec la date de mise en ligne). À changer à chaque envoi aux testeurs.
  version: 'V1 test interne 0.1',


  /* ---------------------------------------------------------------
     SON ET MUSIQUE
     --------------------------------------------------------------- */
  audio: {
    // Volume des bruitages (coups, pièces, explosions…) : 1 = volume d'origine, 0.5 = moitié moins fort
    volumeSons: 0.45,
    // Volume de la musique de fond : 1 = normal, 2 = deux fois plus fort
    volumeMusique: 1.2,
  },

  /* ---------------------------------------------------------------
     ÉNERGIE
     --------------------------------------------------------------- */
  energie: {
    // Énergie maximum au début du jeu (l'énergie arrive avec la pioche, au niveau 6)
    maxDepart: 30,

    // L'énergie max grandit avec le niveau du joueur (progressionJoueur > niveaux : "energie")

    // Énergie qu'il faut pour dégager les trésors d'un niveau, pour chaque biome (1 à 10) : c'est le maximum.
    // Plus cher : de la roche au-dessus des trésors devient de la terre. Moins cher que coutMinimum × ce coût :
    // de la terre au-dessus des trésors devient de la roche.
    // Réglé (simulation du 11 octobre 2026) pour des expéditions d'environ 15 niveaux au début de la mine
    // et 25 à la fin, avec l'énergie du niveau de mineur : la mine 1 dure environ 2 semaines à 3 × 10 min par jour.
    // Un checkpoint tous les 10 niveaux : une expédition doit en faire au moins 10 pour avancer.
    coutNiveau: [3.4, 5, 6.3, 7.8, 9.2, 10.6, 12, 13.4, 14.8, 16],

    // Ce coût moyen est multiplié selon le type de niveau (voir aussi "rythme")
    multiplicateurCout: { facile: 0.8, niveau9: 1.3, tresor: 0.6, gardien: 2 },

    // Un niveau trop facile reçoit de la pierre au-dessus de ses trésors : son coût tombe au hasard
    // entre coutMinimum × le coût du biome et ce coût (0 = jamais de pierre ajoutée)
    coutMinimum: 0.7,

    // true = chaque trésor garde au moins une case dans la terre : en creusant la terre (gratuite),
    // le joueur voit toujours où casser, au lieu de chercher au hasard sous la roche
    indiceTresor: true,

    // Recharge automatique avec le temps : +1 point toutes les X millisecondes.
    // 0 = pas de recharge automatique (l'énergie ne revient qu'au village ou avec une potion).
    rechargeAutoMs: 0,

    // Recharge complète quand le joueur remonte au village (true = oui, false = non)
    rechargeAuVillage: true,

    // Recharge complète en descendant au niveau suivant (true = oui, false = non)
    rechargeEtageSuivant: false,

    // Retour forcé au village : plus d'énergie, plus de bombe, plus de potion, et plus rien à creuser
    // gratuitement sur l'étage (terre, cases bonus, trésor à ramasser). Le butin du sac est gardé.
    texteRetourForce: "Plus d'énergie ! Retour au village avec ton butin.",

    // Une fenêtre "Es-tu sûr de vouloir descendre ?" s'affiche si l'énergie est à ce nombre ou moins
    // (elle s'affiche aussi quand le sac est plein)
    alerteDescente: 5,
  },

  /* ---------------------------------------------------------------
     DÉPART D'UNE NOUVELLE PARTIE
     --------------------------------------------------------------- */
  depart: {
    pieces: 50,     // pièces au départ
    bombes: 0,      // bombes au départ
    radars: 0,      // radars au départ
    potions: 0,     // potions d'énergie au départ
  },

  /* ---------------------------------------------------------------
     SAC À DOS
     Chaque trésor et chaque géode prend 1 case. Les minerais ne vont pas
     dans le sac (ils sont illimités). Le sac se vide au retour au village.
     Un sac plein ne bloque jamais : le joueur peut toujours descendre.
     Chaque trésor prend une case, doublons compris (pas de vente automatique pour l'instant :
     ce sera une amélioration de la Tour du sorcier).
     --------------------------------------------------------------- */
  sac: {
    // true = le sac n'a plus de limite : tous les trésors trouvés y vont, sans fenêtre « sac plein ».
    // false = le sac limité (cases ci-dessous, agrandi par le niveau du joueur). La version limitée est aussi
    // gardée telle quelle sur la branche Git « sac-limite ».
    illimite: true,

    // Nombre de cases au début du jeu (sac limité)
    casesDepart: 4,

    // Sac plein : un doublon trouvé reste au sol, avec ce petit message (pas de fenêtre).
    // Une nouvelle découverte ouvre une fenêtre pour laisser un doublon du sac à la place.
    texteDoublonLaisse: "Sac plein : doublon laissé",

    // Le sac apparaît avec le premier trésor ramassé. La première fois qu'il est plein,
    // un petit tutoriel montre le bouton Remonter (texte : progression > textesTuto > sacPlein)

    // Le sac grandit avec le niveau du joueur (progressionJoueur > niveaux : "sac" et "poche"),
    // plus à la Boutique.
  },

  /* ---------------------------------------------------------------
     BIOMES
     1 niveau = 1 étage. La mine est découpée en biomes.
     --------------------------------------------------------------- */
  biomes: {
    // Nombre de niveaux dans chaque biome
    niveauxParBiome: 100,

    // La mine suivante se débloque dès ce niveau de la mine précédente : on peut alors partir de son niveau 1
    // (sans faire la fin de la mine précédente)
    niveauDeblocage: 80,

    // Écran de choix de la mine : une carte par biome, dans l'ordre. "visuel" = le dessin de la mine au centre de la carte,
    // "fond" = l'image de fond de la carte (fichiers dans Assets/). Sans image, la carte prend un visuel et un fond par défaut.
    cartes: [
      { visuel: 'Assets/Mines/Mine_Tente.png',     fond: 'Assets/Mines/Fond_Prairie.webp' },   // 1  Mine des pionniers
      { visuel: 'Assets/Mines/Mine_Cristal.png',   fond: 'Assets/Mines/Fond_Cristal.webp' },   // 2  Cavernes de cristal
      { visuel: 'Assets/Mines/Mine_Sousmarin.png', fond: 'Assets/Mines/Fond_Riviere.webp' },   // 3  Rivière souterraine
      { visuel: 'Assets/Mines/Mine_Lave.png',      fond: 'Assets/Mines/Fond_Volcan.webp' },    // 4  Cœur volcanique
      { visuel: 'Assets/Mines/Mine_Roche.png',     fond: 'Assets/Mines/Fond_Jungle.webp' },    // 5  Grottes obscures
      { visuel: 'Assets/Mines/Mine_Foret.png',     fond: 'Assets/Mines/Fond_Foret.webp' },     // 6  Forêt pétrifiée
      { visuel: 'Assets/Mines/Mine_Glace.png',     fond: 'Assets/Mines/Fond_Glacier.webp' },   // 7  Glacier profond
      { visuel: 'Assets/Mines/Mine_Desert.png',    fond: 'Assets/Mines/Fond_Desert.webp' },    // 8  Abysses
      { visuel: 'Assets/Mines/Mine_Plage.png',     fond: 'Assets/Mines/Fond_Riviere.webp' },   // 9  Cité engloutie
      { visuel: 'Assets/Mines/Mine_Nuage.png' },                                                 // 10 Trône du Roi Mineur (fond par défaut)
    ],

    // Nom de chaque biome, dans l'ordre (biome 1 = niveaux 1 à 100, etc.)
    noms: [
      'Mine des pionniers',
      'Cavernes de cristal',
      'Rivière souterraine',
      'Cœur volcanique',
      'Grottes obscures',
      'Forêt pétrifiée',
      'Glacier profond',
      'Abysses',
      'Cité engloutie',
      'Trône du Roi Mineur',
    ],
  },

  /* ---------------------------------------------------------------
     PROGRESSION : CE QUI SE DÉBLOQUE, ET QUAND
     Une nouveauté n'existe pas du tout avant son niveau (pas de cadenas).
     Le Musée s'ouvre au premier retour au village.
     Les bâtiments apparaissent au village au retour qui suit leur niveau.
     --------------------------------------------------------------- */
  progression: {
    // Niveau à partir duquel chaque nouveauté apparaît.
    // Rythme : une nouveauté tous les 5 niveaux (6, 11, 16), puis tous les 10 (26 à 66),
    // puis tous les 15 (81 à 216), puis au début et au milieu de chaque biome.
    // Toujours un niveau en …1 ou …6 : jamais sur un checkpoint, un niveau trésor ou un gardien.
    deblocages: {
      pioche: 6,         // pioche, pierre et énergie (le sac est présenté la 1re fois qu'il est plein)
      cuivre: 11,        // minerai de cuivre
      forge: 11,         // la Forge apparaît au village (au retour suivant) : c'est aussi l'ouverture de l'équipement
      boutique: 11,      // la Boutique apparaît en même temps, avec les coffres d'équipement
      geodes: 16,        // géodes vertes (Communes)
      atelier: 16,       // l'Atelier apparaît au village (au retour suivant)
      magma: 26,         // magma et arrosoir
      fer: 36,           // minerai de fer
      casque: 21,        // le Casque peut sortir des coffres
      bottes: 31,        // les Bottes peuvent sortir des coffres
      sac: 16,           // fin des premiers pas : un tutoriel montre la récompense « sac » du niveau du joueur
      autel: 51,         // l'Autel de la montagne apparaît au village (au retour suivant)
      bombes: 56,        // les bombes arrivent à la Boutique (tutoriel avec une bombe offerte)
      geodeRose: 66,     // géodes bleues (Rares)
      potions: 81,       // les potions d'énergie arrivent à la Boutique
      // Biomes suivants
      pierreDure: 101,   // biome 2 : pierre dure
      or: 116,           // minerai d'or
      geodeDoree: 131,   // géodes violettes (Épiques)
      // (161, 176, 191 : nouveautés à créer)
      source: 201,       // biome 3 : source
      radar: 216,        // le radar arrive en boutique
      magmaChaine: 301,  // biome 4 : magma en chaîne
      mystere: 401,      // biome 5 : case mystère
      geodeCristal: 451, // géodes dorées (Légendaires)
      racines: 501,      // biome 6 : racines et souches
      mithril: 551,      // minerai de mithril
      glace: 601,        // biome 7 : glace
      gaz: 701,          // biome 8 : gaz
      coffre: 801,       // biome 9 : coffre bonus
      cristalBrut: 851,  // minerai de cristal brut
    },

    // Cases spéciales des biomes 2 à 10.
    // "biomes" = les biomes où la case apparaît (le biome 10 mélange toutes les cases).
    // "part" = proportion des pierres (ou du magma) transformées ; "nombre" = [minimum, maximum] par niveau.
    casesSpeciales: {
      pierreDure:  { biomes: [2, 10], part: 0.5 },          // part des pierres qui deviennent dures
      source:      { biomes: [3, 10], nombre: [1, 2] },     // posées de préférence à côté du magma
      magmaChaine: { biomes: [4, 10], part: 1, magmaEnPlus: 1 }, // part du magma "en chaîne" + taches de magma en plus
      mystere:     { biomes: [5, 10], nombre: [1, 2] },
      racines:     { biomes: [6, 10], souches: [1, 2], racinesParSouche: [3, 5] },
      glace:       { biomes: [7, 10], part: 0.5 },          // part des pierres qui deviennent de la glace
      gaz:         { biomes: [8, 10], nombre: [1, 2] },
      coffre:      { biomes: [9, 10], nombre: [1, 1] },
    },

    // Ce que donnent la case mystère et le coffre bonus (toujours positif !)
    bonus: {
      // Case mystère : un seul cadeau, tiré au hasard selon ces chances
      mystere: {
        chances: { pieces: 45, minerai: 30, potion: 15, geode: 10 },
        pieces: [15, 40],       // [minimum, maximum]
        minerai: [2, 4],
      },
      // Coffre bonus : toujours des pièces, et parfois un cadeau en plus
      coffre: {
        pieces: [40, 150],
        chanceCadeauEnPlus: 0.4,
        cadeauEnPlus: { minerai: 50, potion: 30, geode: 20 },
        minerai: [3, 6],
      },
    },

    // Taille de la grille (carrée) et nombre de trésors, selon le niveau.
    // "depuis" = premier niveau concerné ; "tresors" = [minimum, maximum].
    // La grille grandit avec la profondeur : 1 case au niveau 1, puis 2×2, 3×3… jusqu'à 7×7.
    // Les trésors restent rares : les grandes grilles sont plus riches en minerai et en tas de pièces
    // (qui ne prennent pas de place dans le sac). "chanceMinerai" remplace mine > chanceMinerai ;
    // "tasDePieces" = [minimum, maximum] de tas de pièces sur un étage normal.
    grilles: [
      { depuis: 1,   taille: 1, tresors: [1, 1] },
      { depuis: 2,   taille: 2, tresors: [1, 1] },
      { depuis: 6,   taille: 3, tresors: [1, 1] },
      { depuis: 16,  taille: 4, tresors: [1, 1], tasDePieces: [0, 1] },
      { depuis: 51,  taille: 5, tresors: [2, 2], tasDePieces: [1, 1], chanceMinerai: 0.30 },
      { depuis: 251, taille: 6, tresors: [2, 3], tasDePieces: [1, 2], chanceMinerai: 0.33 },
      { depuis: 501, taille: 7, tresors: [3, 3], tasDePieces: [2, 2], chanceMinerai: 0.36 },
    ],

    // Niveaux tutoriels : grille 3×3, une seule nouveauté. Une main animée montre quoi faire,
    // avec une phrase très courte (8 mots maximum) ; elle disparaît dès que le joueur le fait.
    // "nouveaute" : 'pierre', 'cuivre', 'fer', 'geode', 'magma', 'bombe', 'pierreDure', 'source',
    //               'magmaChaine', 'mystere', 'racines', 'glace', 'gaz' ou 'coffre'.
    // "outil" : l'outil mis en avant ('shovel' pelle, 'pickaxe' pioche, 'bucket' arrosoir, 'bomb' bombe).
    // Trésors garantis la PREMIÈRE fois qu'on joue ces niveaux (ensuite, tirage normal).
    // "tresor" = un artefact (identifiant de la liste des collections) ; "geode" = 'blanche', 'rose', 'doree' ou 'cristal'.
    tresorsGarantis: [
      { niveau: 1,  tresor: 'feuille' },
      { niveau: 2,  tresor: 'coquillage' },
      { niveau: 3,  tresor: 'ammonite' },
      { niveau: 16, geode: 'blanche' },
    ],

    // PREMIERS PAS (niveaux 1 à 16) : le jeu guide le joueur jusqu'à sa première géode ouverte.
    // Une expédition guidée s'arrête toujours à un "retour" prévu :
    //   5 = le Musée, 11 = la Boutique et la Forge, 16 = l'Atelier (et l'agrandissement du sac).
    // Tant que le joueur n'est pas revenu du dernier retour :
    // - le bouton Remonter n'apparaît qu'à partir du prochain retour prévu (ou à 0 énergie) ;
    // - sac plein avant ce retour : le jeu montre "Descendre quand même" (les pièces et minerais ne prennent pas de place) ;
    // - la pierre est limitée pour que l'énergie suffise jusqu'au prochain retour, même en cassant tout.
    // - le popup "Sac plein" n'apparaît qu'une fois, ensuite un simple rappel ;
    // - c'est un tutoriel à usage unique : rentré plus tôt (0 énergie), l'étape est terminée,
    //   et les niveaux déjà joués (redescente depuis un checkpoint) se jouent normalement, avec Remonter.
    // Partout dans le jeu, un niveau tutoriel donne l'énergie qu'il faut pour le finir,
    // et son trésor (toujours une nouvelle découverte) ne prend pas de place dans le sac.
    guide: {
      fin: 16,                 // dernier niveau guidé
      retours: [5, 11, 16],    // fins d'expédition prévues
      pierresMax: 3,           // pierres maximum sur un niveau guidé (hors niveaux tutoriels)
    },

    tutoriels: [
      { niveau: 6,   nouveaute: 'pierre',      outil: 'pickaxe', texte: "Touche la pierre pour la casser" },
      { niveau: 11,  nouveaute: 'cuivre',      outil: 'pickaxe', texte: "Casse le minerai de cuivre" },
      { niveau: 16,  nouveaute: 'geode',       outil: 'shovel',  texte: "Glisse pour dégager la géode" },
      { niveau: 26,  nouveaute: 'magma',       outil: 'bucket',  texte: "Arrose le magma" },
      { niveau: 36,  nouveaute: 'fer',         outil: 'pickaxe', texte: "Casse le minerai de fer" },
      { niveau: 56,  nouveaute: 'bombe',       outil: 'bomb',    texte: "Touche une case pour exploser" },
      { niveau: 101, nouveaute: 'pierreDure',  outil: 'pickaxe', texte: "La pierre dure demande plus de coups" },
      { niveau: 201, nouveaute: 'source',      outil: 'shovel',  texte: "Creuse la source" },
      { niveau: 301, nouveaute: 'magmaChaine', outil: 'bucket',  texte: "Arrose une case : tout refroidit" },
      { niveau: 401, nouveaute: 'mystere',     outil: 'shovel',  texte: "Creuse la case mystère" },
      { niveau: 501, nouveaute: 'racines',     outil: 'pickaxe', texte: "Casse la souche" },
      { niveau: 601, nouveaute: 'glace',       outil: 'shovel',  texte: "Creuse la glace près du magma" },
      { niveau: 701, nouveaute: 'gaz',         outil: 'bomb',    texte: "Fais exploser le gaz" },
      { niveau: 801, nouveaute: 'coffre',      outil: 'shovel',  texte: "Touche le coffre" },
    ],

    // Textes des autres tutoriels (une phrase très courte, 8 mots maximum).
    // Chaque tutoriel montre une main animée et disparaît dès que le joueur fait l'action.
    textesTuto: {
      toucher: "Touche la terre pour creuser",        // niveau 1 (une seule case)
      creuser: "Glisse pour creuser",                 // niveau 2 (première grille 2×2)
      tresor: "Touche le trésor pour le ramasser",    // le 1er trésor dégagé
      sacPlein: "Sac plein ! Remonte au village",     // la 1re fois que le sac est plein
      casserRefroidi: "Casse le magma refroidi",     // tutoriel du magma, après l'arrosoir
      surface: "Rentre au village avec ton butin",    // la 1re fin d'expédition
      descendre: "Descends dans la mine",             // tout premier lancement, au village
      batiments: {                                    // quand un bâtiment apparaît au village
        museum: "Entre dans ton Musée",
        forge: "Entre dans la Forge",
        atelier: "Entre dans l'Atelier",
        shop: "Entre dans la Boutique",
        altar: "Entre dans l'Autel de la montagne",
      },
      prime: "Récupère ta récompense",                // 1re prime de collection au Musée
      museeRetour: "Retourne au village",             // fin de la 1re visite du Musée
      redescendre: "Redescends dans la mine",         // après la 1re visite du Musée
      checkpoints: "Les checkpoints t'évitent de tout refaire",  // 1re fois dans l'ascenseur, avant « Reprends au niveau »
      ascenseur: "Reprends au niveau {n}",            // 1re fois que l'ascenseur propose un checkpoint
      // Premier coffre d'équipement (à la 1re visite de la Boutique, niveau 11)
      equipement: {
        ouvrirCoffre: "Ouvre ton coffre offert",      // sur le coffre en bois de la Boutique
        toucherCoffre: "Touche le coffre !",           // dans la fenêtre d'ouverture
        equiper: "Équipe ta nouvelle pioche",          // bouton Équiper
        personnage: "Va voir ton équipement",          // onglet Personnage
        toucherObjet: "Touche ta pioche",              // la pioche sur le mineur
        ameliorer: "Améliore-la, c'est offert !",      // bouton Améliorer de la fiche
        fusionner: "Fusionne 3 objets identiques",     // 1re fusion possible, à la Forge
      },
      // Premiers pas (niveaux 1 à 16)
      sac: "Tes trésors vont dans ton sac",           // 1er trésor ramassé (touche pour continuer)
      suivant: "Descends au niveau suivant",          // 1re fois que le bouton « Niveau suivant » apparaît
      energie: "Chaque coup de pioche coûte 1 énergie", // niveau de la pioche (touche pour continuer)
      continuer: "Continue jusqu'au checkpoint !",    // 1er sac plein avant un retour prévu, sur « Descendre quand même »
      echanger: "Garde ta nouvelle découverte",       // 1re fenêtre « Nouvelle découverte » (sac plein)
      remonter: "Remonte : du nouveau au village !",  // à chaque retour prévu (niveaux 11 et 16)
      forge: "Le cuivre sert à améliorer ta pioche",  // 1re visite de la Forge (touche pour continuer)
      retourVillage: "Retourne au village",           // fin des tutoriels de la Boutique et de l'Atelier
      retourPersonnage: "Retourne à ton personnage",  // fin du tutoriel de la Forge (bouton retour rouge)
      atelier: "Tape quand le curseur est dans la zone", // 1re géode à l'Atelier (elle ne peut pas rater)
      sacBoutique: "Ton niveau de mineur agrandit ton sac !",  // fin des premiers pas : l'encart du niveau du joueur
      sacAcheter: "Récupère ta case de sac en plus",           // puis la récompense dans Progression
      priere: "Prie pour graver ta première rune",            // 1re visite de l'Autel
      objectifs: "Tes objectifs rapportent des pièces", // fin des premiers pas : le bouton Objectifs apparaît
      fin: "Bravo, tu connais la mine ! Bonne chance !", // message de fin des premiers pas
      energieOfferte: "Énergie offerte pour ce tutoriel", // un niveau tutoriel remet l'énergie qu'il faut
      horsSac: "Bonus : hors du sac",                 // trésor d'un niveau tutoriel
      ouvrirSac: "Ouvre ton sac",                     // tutoriels de la bombe
      utiliserBombe: "Utilise la bombe",
      // Quand il faut d'abord changer d'outil
      outils: { shovel: "Prends la pelle", pickaxe: "Prends la pioche", bucket: "Prends l'arrosoir" },
    },
  },

  /* ---------------------------------------------------------------
     RYTHME EN DENTS DE SCIE
     Dans chaque tranche de 10 niveaux : les niveaux 1 à 8 sont faciles,
     le 9e un peu plus dur, le 10e (le checkpoint) est un "niveau trésor".
     Les niveaux 100, 200… 900 sont des "niveaux gardiens".
     --------------------------------------------------------------- */
  rythme: {
    // Quantité de pierre et de magma : 1 = normal, plus petit = plus facile
    difficulte: {
      facile: 0.8,     // niveaux 1 à 8 de chaque tranche
      niveau9: 1.3,    // 9e niveau de la tranche : un peu plus dur
    },

    // Niveau trésor (10, 20, 30…) : rempli de minerai et de tas de pièces
    niveauTresor: {
      tailleEnPlus: 1,             // la grille est plus grande d'un cran (7×7 maximum), la première fois
      chanceMinerai: 0.75,         // chance qu'une pierre contienne du minerai (au lieu de 0.26)
      tasDePieces: [3, 5],         // nombre de tas de pièces (un coup de pelle pour les ramasser)
      piecesParTas: [6, 12],       // pièces dans chaque tas
      bonusParBiome: 0.5,          // les tas valent +50 % à chaque biome plus profond
      texte: "Niveau trésor ! Des tas de pièces et du minerai à ramasser.",
    },

    // Niveau gardien (100, 200… 900) : un petit défi, une grosse récompense
    niveauGardien: {
      // Niveaux gardiens en plus de 100, 200… 900 (le premier gardien arrive au niveau 30)
      niveauxEnPlus: [30],
      pierreEnPlus: 1.6,           // quantité de pierre (1 = normal)
      partPierreDure: 0.6,         // part des pierres qui deviennent dures (dès que la pierre dure existe)
      casesDuBiomeEnPlus: 2,       // les cases spéciales du biome sont 2 fois plus nombreuses
      recompense: {
        pieces: 300,               // pièces au biome 1…
        piecesEnPlusParBiome: 200, // … et autant en plus à chaque biome
        potions: 1,
        geode: true,               // une géode de la meilleure couleur déjà débloquée
      },
      texte: "Niveau gardien ! Un peu plus de roche dure… et une grosse récompense à la fin.",
    },

    // Niveau 1000 : la salle du trésor du Roi Mineur (grille 7×7)
    niveau1000: {
      // Le coffre du centre s'ouvre avec les 5 Clés du Roi Mineur (c'est un bonus, pas obligatoire)
      coffreDuRoi: { pieces: 5000, message: "Le trésor du Roi Mineur est à toi !" },
      texte: "La salle du trésor du Roi Mineur ! Le grand coffre du centre s'ouvre avec les 5 Clés du Roi Mineur.",
    },
  },

  /* ---------------------------------------------------------------
     CHECKPOINTS (ASCENSEUR)
     Niveaux où le joueur peut redescendre directement depuis le village.
     Un checkpoint se débloque dès que le joueur atteint ce niveau.
     Utiliser un checkpoint est gratuit.
     Les checkpoints placés à la fin d'un biome (100, 200…) sont des
     "camps de biome", mis en avant dans l'ascenseur.
     --------------------------------------------------------------- */
  checkpoints: {
    tousLesNiveaux: 10,   // un checkpoint tous les X niveaux (10, 20, 30…)
    enPlus: [5],          // checkpoints en plus (le 5 évite de refaire le tout début après le premier retour)
    dernier: 990,         // dernier niveau qui a un checkpoint
  },

  /* ---------------------------------------------------------------
     MINE : SOLIDITÉ DES ROCHES ET MINERAIS
     --------------------------------------------------------------- */
  mine: {
    // Nombre de coups de pioche (niveau 1) pour casser chaque type de bloc
    coupsPierre: 3,
    coupsPierreMinerai: 3,
    coupsMagmaRefroidi: 5,
    coupsPierreDure: 6,     // pierre dure (biome 2) : 2 fois plus que la pierre
    coupsGlace: 3,          // glace (biome 7) : la pioche y fait moitié moins de dégâts, donc 6 coups en vrai
    coupsRacine: 4,         // une racine (biome 6) cassée sans passer par sa souche
    coupsSouche: 3,         // la souche : la casser fait disparaître toutes ses racines

    // Chance qu'une pierre contienne du minerai (0.26 = 26 %)
    chanceMinerai: 0.26,

    // Fréquence relative de chaque minerai (plus le nombre est grand, plus il est courant)
    // (chaque minerai n'apparaît qu'à partir de son niveau, voir progression > deblocages)
    frequenceMinerais: { fer: 55, cuivre: 32, or: 13, mithril: 10, cristalBrut: 8 },

    // Quantité obtenue en cassant une pierre à minerai : [minimum, maximum]
    quantiteMinerais: { fer: [1, 3], cuivre: [1, 2], or: [1, 1], mithril: [1, 1], cristalBrut: [1, 1] },
  },

  /* ---------------------------------------------------------------
     GÉODES
     4 géodes, une par rareté, de la couleur de leur rareté : verte, bleue, violette, dorée.
     Les pierres précieuses ne se trouvent plus dans la mine :
     elles sortent uniquement des géodes, ouvertes à l'Atelier.
     Une géode donne une pierre précieuse tirée au hasard parmi TOUTES celles de sa rareté.
     --------------------------------------------------------------- */
  geodes: {
    // Fréquence d'apparition de chaque géode dans la mine
    // (plus le nombre est grand, plus elle apparaît souvent)
    // (les noms gardent les anciennes couleurs : blanche = verte, rose = bleue, doree = violette, cristal = dorée)
    frequence: { blanche: 60, rose: 25, doree: 12, cristal: 3 },

    // Sur un étage à un seul trésor : chance que ce trésor soit une géode plutôt qu'un artefact
    // (avec 2 trésors ou plus, un sur deux est une géode)
    chanceEtageUnTresor: 0.35,
  },

  /* ---------------------------------------------------------------
     ÉCONOMIE : VENTE DES DOUBLONS ET PRIMES
     --------------------------------------------------------------- */
  economie: {
    // Prix de vente d'un doublon, selon la rareté du trésor (en pièces)
    venteDoublons: { common: 8, rare: 20, epic: 40, legendary: 80 },

    // Prime pour une NOUVELLE découverte (la première fois qu'on trouve ce trésor), selon sa rareté (en pièces)
    primeDecouverte: { common: 10, rare: 25, epic: 50, legendary: 100 },

    // ÉTOILES DES COLLECTIONS (au Musée) : une collection complétée 1 fois = 1 étoile, 2 fois = 2 étoiles, etc.
    etoilesSeries: {
      // Nombre maximum d'étoiles. Pour en ajouter, augmente ce nombre ET ajoute une valeur
      // dans "bonusRevente" et dans "primes" ci-dessous.
      max: 3,
      // Bonus de revente des doublons de la collection, selon son nombre d'étoiles (0.10 = +10 %)
      bonusRevente: [0.10, 0.25, 0.50],          // 1 étoile, 2 étoiles, 3 étoiles
      // Prime de chaque nouvelle étoile, en fraction de la prime de la collection
      // (1 = la prime entière ; 0.5 = la moitié). À récupérer au Musée avec le bouton "Récupérer".
      primes: [1, 0.5, 1],                       // 1re étoile, 2e étoile, 3e étoile
    },
  },

  /* ---------------------------------------------------------------
     COLLECTIONS DU MUSÉE
     Rareté : 'common', 'rare', 'epic' ou 'legendary'.
     "prime" = pièces de la collection, à récupérer au Musée à chaque nouvelle étoile
     (en fraction de cette prime : voir economie > etoilesSeries > primes).
     Tu peux changer les noms, les raretés, les primes et les niveaux.
     Ne change pas les mots avant les deux-points (quartz:, fossiles:…) :
     ce sont les identifiants utilisés par le jeu et par les images.
     --------------------------------------------------------------- */
  collections: {
    // Chance d'apparition d'un artefact dans la mine selon sa rareté
    // (plus le nombre est grand, plus il apparaît souvent)
    frequenceArtefacts: { common: 12, rare: 6, epic: 3, legendary: 2 },

    // Un artefact pas encore découvert (ni au Musée, ni déjà dans le sac) a X fois plus de chances d'apparaître
    chanceNonDecouvert: 3,

    // PIERRES PRÉCIEUSES (clé "gemmes") : elles sortent uniquement des géodes (une géode en donne une de sa rareté)
    gemmes: {
      claires: { nom: 'Pierres claires', prime: 100, objets: {
        quartz:      { nom: 'Quartz',       rarete: 'common' },
        aigueMarine: { nom: 'Aigue-marine', rarete: 'common' },
        topazeBleue: { nom: 'Topaze bleue', rarete: 'common' },
        diamantBrut: { nom: 'Diamant brut', rarete: 'rare' },
      } },
      roses: { nom: 'Pierres roses', prime: 200, objets: {
        quartzRose:    { nom: 'Quartz rose',   rarete: 'common' },
        rhodochrosite: { nom: 'Rhodochrosite', rarete: 'common' },
        kunzite:       { nom: 'Kunzite',       rarete: 'rare' },
        saphirRose:    { nom: 'Saphir rose',   rarete: 'epic' },
      } },
      dorees: { nom: 'Pierres dorées', prime: 400, objets: {
        citrine:         { nom: 'Citrine',          rarete: 'rare' },
        ambre:           { nom: 'Ambre',            rarete: 'rare' },
        topazeImperiale: { nom: 'Topaze impériale', rarete: 'epic' },
        heliodore:       { nom: 'Héliodore',        rarete: 'legendary' },
      } },
      royales: { nom: 'Pierres royales', prime: 400, objets: {
        rubis:        { nom: 'Rubis',         rarete: 'rare' },
        emeraude:     { nom: 'Émeraude',      rarete: 'epic' },
        saphirEtoile: { nom: 'Saphir étoilé', rarete: 'epic' },
        diamantPur:   { nom: 'Diamant pur',   rarete: 'legendary' },
      } },
    },

    // ARTEFACTS : trouvés dans la grille de la mine.
    // "niveaux" = [premier niveau, dernier niveau] où la série peut apparaître.
    // "sol" = ce qui recouvre l'artefact : 'terre', 'pierre', 'magma', ou 'tout' (n'importe quoi).
    // Un objet peut avoir son propre "biome" (ex. une pièce ou une clé par biome) :
    // il n'apparaît alors que dans ce biome (biome 1 = niveaux 1 à 100, biome 2 = 101 à 200…).
    // Sols possibles : 'terre', 'pierre', 'pierreDure', 'magma', 'coffre' ou 'tout'.
    // (pierre dure et coffres arrivent avec les biomes 2 et 9 : en attendant, ils sont remplacés
    //  par de la pierre normale / n'importe quelle case.)
    artefacts: {
      fossiles: { nom: 'Fossiles de surface', prime: 50, niveaux: [1, 30], sol: 'terre', objets: {
        coquillage: { nom: 'Coquillage fossile', rarete: 'common' },
        feuille:    { nom: 'Feuille fossile',    rarete: 'common' },
        ammonite:   { nom: 'Petite ammonite',    rarete: 'common' },
      } },
      celestes: { nom: 'Cartes célestes', prime: 50, niveaux: [10, 100], sol: 'tout', objets: {
        lion:     { nom: 'Plaque du Lion',     rarete: 'common' },
        taureau:  { nom: 'Plaque du Taureau',  rarete: 'common' },
        scorpion: { nom: 'Plaque du Scorpion', rarete: 'common' },
        dragon:   { nom: 'Plaque du Dragon',   rarete: 'rare' },
      } },
      outils: { nom: 'Outils du mineur oublié', prime: 100, niveaux: [16, 100], sol: 'pierre', objets: {
        lampe:   { nom: 'Lampe rouillée',          rarete: 'common' },
        gourde:  { nom: 'Vieille gourde',          rarete: 'common' },
        casque:  { nom: 'Casque cabossé',          rarete: 'common' },
        pioche:  { nom: 'Pioche du premier mineur', rarete: 'rare' },
      } },
      tablette: { nom: 'Tablette ancienne', prime: 100, niveaux: [101, 200], sol: 'pierreDure',
        // Texte affiché quand la tablette est complète
        legende: "« Sous la montagne dort le trésor du Roi Mineur. Cinq clés, cachées de plus en plus profond, ouvrent son coffre. »",
        objets: {
          fragmentGauche:  { nom: 'Fragment gauche',  rarete: 'common' },
          fragmentCentral: { nom: 'Fragment central', rarete: 'common' },
          fragmentDroit:   { nom: 'Fragment droit',   rarete: 'common' },
        } },
      feu: { nom: 'Pierres de feu', prime: 200, niveaux: [301, 400], sol: 'magma', objets: {
        obsidienne:   { nom: 'Obsidienne',     rarete: 'common' },
        pierreDeLave: { nom: 'Pierre de lave', rarete: 'common' },
        coeurDeBraise: { nom: 'Cœur de braise', rarete: 'epic' },
      } },
      abysses: { nom: 'Trésors des abysses', prime: 200, niveaux: [701, 800], sol: 'tout', objets: {
        corail:     { nom: 'Corail pétrifié', rarete: 'common' },
        conque:     { nom: 'Conque abyssale', rarete: 'common' },
        perleNoire: { nom: 'Perle noire',     rarete: 'epic' },
      } },
      // Une pièce par biome, du biome 1 au biome 6
      monnaies: { nom: 'Monnaies du royaume perdu', prime: 200, sol: 'tout', objets: {
        sou:     { nom: 'Sou de cuivre',     rarete: 'common', biome: 1 },
        denier:  { nom: "Denier d'argent",   rarete: 'common', biome: 2 },
        ecu:     { nom: 'Écu de bronze',     rarete: 'common', biome: 3 },
        ducat:   { nom: "Ducat d'or",        rarete: 'common', biome: 4 },
        florin:  { nom: 'Florin de platine', rarete: 'common', biome: 5 },
        pieceDuRoi: { nom: 'Pièce du roi',   rarete: 'epic',   biome: 6 },
      } },
      reliques: { nom: 'Reliques ornées', prime: 400, niveaux: [801, 900], sol: 'coffre', objets: {
        calice:  { nom: 'Calice orné',          rarete: 'epic' },
        masque:  { nom: "Masque d'or",          rarete: 'epic' },
        sceptre: { nom: 'Sceptre du roi mineur', rarete: 'legendary' },
      } },
      // Une clé par biome, du biome 6 au biome 10
      cles: { nom: 'Clés du Roi Mineur', prime: 1000, sol: 'tout',
        // Message affiché quand toutes les clés sont réunies
        message: 'Coffre du roi ouvert !',
        objets: {
          cleFer:     { nom: 'Clé de fer',     rarete: 'legendary', biome: 6 },
          cleCuivre:  { nom: 'Clé de cuivre',  rarete: 'legendary', biome: 7 },
          cleArgent:  { nom: "Clé d'argent",   rarete: 'legendary', biome: 8 },
          cleOr:      { nom: "Clé d'or",       rarete: 'legendary', biome: 9 },
          cleCristal: { nom: 'Clé de cristal', rarete: 'legendary', biome: 10 },
        } },
    },
  },

  /* ---------------------------------------------------------------
     BOUTIQUE : PRIX DES CONSOMMABLES (en pièces)
     --------------------------------------------------------------- */
  boutique: {
    // Prix au biome 1 ; "parBiome" = la part du prix ajoutée à chaque biome atteint (1 = +100 % : 25, 50, 75…).
    // Les pièces gagnées grandissent avec la profondeur : des prix fixes deviendraient vite gratuits.
    bombe: { prix: 25, parBiome: 1 },
    radar: { prix: 30, parBiome: 1 },
    // Potion : prix = prixParEnergie × l'énergie max ; "parJour" = achats possibles par jour.
    // Une potion vaut une expédition de plus sans remonter : elle doit rester rare pour que l'énergie compte.
    potion: { prixParEnergie: 4, parJour: 3 },
  },

  /* ---------------------------------------------------------------
     ÉQUIPEMENT ET COFFRES (style Archero 2 / Dicero)
     Le mineur porte 6 pièces d'équipement, gagnées dans les coffres de la Boutique.
     Elles s'améliorent et se fusionnent à la Forge.
     L'équipement s'ouvre avec la Forge (progression > deblocages > forge).
     --------------------------------------------------------------- */
  equipement: {
    // Nom du personnage, affiché au-dessus du mineur sur l'écran Personnage
    nomPersonnage: 'Bidule',

    // Les 7 raretés (échelle Habby), de la plus courante à la plus rare.
    // "niveauMax" = niveau maximum d'un objet de cette rareté ;
    // "multiplicateur" = la stat principale de l'objet est multipliée par ce nombre ;
    // "S" = palier « S » : même couleur que la rareté, avec un badge S.
    // "fusion" = ce qu'il faut pour passer à la rareté suivante, avec l'objet + 2 autres de la même rareté :
    //   'identique'   = 2 objets du même modèle (ex. 3 Pics lourds) ;
    //   'emplacement' = 2 objets du même emplacement, n'importe quel modèle (ex. 3 pioches).
    raretes: {
      commun:      { nom: 'Commun',       niveauMax: 10, multiplicateur: 1,   fusion: 'identique' },
      rare:        { nom: 'Rare',         niveauMax: 20, multiplicateur: 1.4, fusion: 'identique' },
      epique:      { nom: 'Épique',       niveauMax: 30, multiplicateur: 2,   fusion: 'emplacement' },
      epiqueS:     { nom: 'Épique S',     niveauMax: 40, multiplicateur: 2.5, fusion: 'identique', S: true },
      legendaire:  { nom: 'Légendaire',   niveauMax: 50, multiplicateur: 3,   fusion: 'identique' },
      legendaireS: { nom: 'Légendaire S', niveauMax: 60, multiplicateur: 3.6, fusion: 'identique', S: true },
      mythique:    { nom: 'Mythique',     niveauMax: 70, multiplicateur: 4.5 },
    },

    // Fusion à la Forge : l'objet + 2 autres de la même rareté donnent 1 objet de la rareté suivante
    // (voir "fusion" dans chaque rareté). L'objet choisi garde son niveau (la fusion auto garde celui
    // qui a le plus haut niveau) ; tout ce qui a été dépensé pour améliorer les deux autres est rendu.
    // La fusion auto ne fusionne que les Communs et les Rares.
    fusion: { nombre: 3, autoJusqua: 'rare' },

    // Les 6 emplacements. "deblocage" = la nouveauté qui le fait apparaître dans les coffres
    // (mêmes noms que progression > deblocages ; null = dès l'ouverture de l'équipement).
    // Stat principale = (depart + parNiveau × (niveau − 1)) × multiplicateur de la rareté, sans dépasser "max".
    // Les pourcentages sont écrits en décimal : 0.1 = 10 % ("nombre: true" = un nombre, pas un pourcentage).
    // "modeles" = les archétypes de l'emplacement. "biome" = biome à partir duquel il sort des coffres.
    // Chaque modèle a un passif qui s'active à Épique et grandit à chaque rareté au-dessus :
    // "valeurs" = [Épique, Épique S, Légendaire, Légendaire S, Mythique].
    emplacements: {
      pioche: {
        nom: 'Pioche', deblocage: 'pioche',
        stat: { texte: '+{v} dégâts par coup', depart: 0.3, parNiveau: 0.05, nombre: true },
        modeles: {
          picLourd:  { nom: 'Pic lourd',  biome: 1, passif: '{v} de chance de frapper deux fois plus fort', valeurs: [0.12, 0.16, 0.2, 0.25, 0.3] },
          picEclats: { nom: 'Pic à éclats', biome: 2, passif: '{v} de chance de casser aussi une roche voisine', valeurs: [0.12, 0.17, 0.22, 0.275, 0.33] },
          picGivre:  { nom: 'Pic de givre', biome: 3, passif: 'Dégâts sur la glace × {v} (au lieu de moitié)', valeurs: [1, 1.125, 1.25, 1.375, 1.5], nombre: true },
        },
      },
      pelle: {
        nom: 'Pelle', deblocage: null,
        stat: { texte: '+{v} de pièces par tas', depart: 0.1, parNiveau: 0.02 },
        modeles: {
          pelleProspecteur: { nom: 'Pelle de prospecteur', biome: 1, passif: '+{v} tas de pièces sur les niveaux trésor', valeurs: [1, 1.5, 2, 2.5, 3], nombre: true },
          pelleLarge:       { nom: 'Pelle large', biome: 2, passif: '{v} de chance de creuser aussi une terre voisine', valeurs: [0.15, 0.2, 0.25, 0.325, 0.4] },
        },
      },
      gants: {
        nom: 'Gants', deblocage: 'cuivre',
        stat: { texte: '{v} de chance de +1 minerai par bloc', depart: 0.1, parNiveau: 0.03, max: 2 },
        modeles: {
          gantsFer:        { nom: 'Gants de fer', biome: 1, passif: '{v} de chance de trouver aussi le meilleur minerai', valeurs: [0.05, 0.075, 0.1, 0.15, 0.2] },
          gantsDynamiteur: { nom: 'Gants de dynamiteur', biome: 2, passif: '{v} de chance qu\'une bombe ne soit pas utilisée', valeurs: [0.2, 0.225, 0.25, 0.29, 0.33] },
        },
      },
      casque: {
        nom: 'Casque', deblocage: 'casque',
        stat: { texte: '{v} de chance de coup gratuit (sans énergie)', depart: 0.02, parNiveau: 0.0025, max: 0.4 },
        modeles: {
          casqueChantier: { nom: 'Casque de chantier', biome: 1, passif: 'Un coup gratuit casse le bloc d\'un coup : {v} de chance', valeurs: [0.25, 0.375, 0.5, 0.75, 1] },
          casqueVeine:    { nom: 'Casque de veine', biome: 2, passif: '+{v} de chance de coup gratuit sur le minerai', valeurs: [0.1, 0.15, 0.2, 0.25, 0.3] },
        },
      },
      lanterne: {
        nom: 'Lanterne', deblocage: 'geodes',
        stat: { texte: 'Géodes rares {v} plus fréquentes', depart: 0.1, parNiveau: 0.03 },
        modeles: {
          lanterneProspecteur: { nom: 'Lanterne de prospecteur', biome: 1, passif: '{v} de chance qu\'une géode monte d\'une rareté', valeurs: [0.1, 0.15, 0.2, 0.275, 0.35] },
          lanterneAncienne:    { nom: 'Lanterne ancienne', biome: 2, passif: 'Artefacts jamais trouvés × {v} plus fréquents', valeurs: [1.5, 1.75, 2, 2.5, 3], nombre: true },
        },
      },
      bottes: {
        nom: 'Bottes', deblocage: 'bottes',
        stat: { texte: '{v} de chance qu\'une case de terre cache un tas d\'or', depart: 0.02, parNiveau: 0.003, max: 0.5 },
        modeles: {
          bottesProspecteur:  { nom: 'Bottes de prospecteur', biome: 1, passif: '+{v} de tas d\'or en plus', valeurs: [0.25, 0.375, 0.5, 0.75, 1] },
          bottesPorteBonheur: { nom: 'Bottes porte-bonheur', biome: 2, passif: '{v} de chance qu\'un tas de pièces soit doublé', valeurs: [0.15, 0.2, 0.25, 0.325, 0.4] },
        },
      },
    },

    // Améliorer un objet d'un niveau (à la Forge, ou depuis sa fiche).
    // Pièces : "depart" pour passer du niveau 1 au 2, puis × "hausse" à chaque niveau.
    // Minerai : selon la tranche de niveaux, "depart" + "parNiveau" × (niveaux déjà faits dans la tranche).
    // Le tout premier niveau est offert pendant le tutoriel.
    ameliorer: {
      pieces: { depart: 20, hausse: 1.15 },
      minerai: [
        { jusqua: 10, minerai: 'cuivre',      depart: 2, parNiveau: 1 },
        { jusqua: 20, minerai: 'fer',         depart: 4, parNiveau: 1 },
        { jusqua: 30, minerai: 'or',          depart: 3, parNiveau: 1 },
        { jusqua: 40, minerai: 'mithril',     depart: 3, parNiveau: 1 },
        { jusqua: 50, minerai: 'cristalBrut', depart: 3, parNiveau: 1 },
      ],
    },

    // Les 4 coffres de la Boutique, comme dans Dicero : chaque coffre a ses boutons « Ouvrir 1 » et « Ouvrir 10 ».
    // Les clés sont utilisées d'abord ; s'il en manque, une fenêtre propose de payer le reste en perles
    // ("gemmes" = prix d'une ouverture en perles ; 0 = impossible sans clé).
    // "pub" = nombre de publicités par jour qui ouvrent ce coffre gratuitement (0 ou absent = pas de bouton pub).
    // "chances" = chance de chaque rareté (le total fait 100).
    // Aucun Légendaire dans les coffres : ils ne s'obtiennent que par la fusion, les événements et les offres.
    // "pitie" = au bout de ce nombre de coffres sans la rareté "pitieRarete", elle est garantie (absent = pas de pitié).
    // L'objet est tiré au hasard parmi les emplacements et les modèles déjà débloqués.
    coffres: {
      bois:   { nom: 'Coffre en bois',   cle: 'Clé en bois',   gemmes: 30,  pub: 2, chances: { commun: 90, rare: 10 } },
      argent: { nom: 'Coffre d\'argent', cle: 'Clé d\'argent', gemmes: 80,  chances: { commun: 50, rare: 45, epique: 5 } },
      or:     { nom: 'Coffre d\'or',     cle: 'Clé d\'or',     gemmes: 300, chances: { commun: 20, rare: 70, epique: 10 } },
      etoile: { nom: 'Coffre étoilé',    cle: 'Clé étoilée',   gemmes: 500, chances: { epique: 99, epiqueS: 1 } },
    },

    // D'où viennent les clés (en plus des gemmes)
    cles: {
      // (plus de coffre du jour ni de clés achetées en pièces : la publicité est sur le coffre en bois, 2 fois par jour)
      // Les récompenses de profondeur (clés des niveaux trésor, gardiens, records) sont espacées selon la mine :
      // les intervalles ci-dessous valent pour la mine 3 et les suivantes (environ 33 niveaux par jour),
      // et sont multipliés par "facteurParMine" dans les mines plus rapides (mine 1 en 1 semaine ≈ 140 niveaux
      // par jour : × 4 ; mine 2 en 2 semaines ≈ 70 par jour : × 2). Ainsi le nombre de coffres par jour reste
      // le même dans toutes les mines (simulation du 2026-10-09 : ~3,8 par jour gratuit, ~8 à 10 engagé).
      facteurParMine: [4, 2, 1],
      // Dans la mine : une clé en bois posée sur un niveau trésor tous les X niveaux (la première fois ; comme les
      // centaines sont des niveaux gardiens, la clé va sur le niveau trésor juste après : 410, 810… en mine 1),
      // et une chance d'en trouver une sur un niveau normal (0 = jamais)
      niveauTresor: 'bois',
      niveauTresorTousLes: 100,
      chanceEtage: 0,
      // Niveau gardien vaincu : une clé en plus de sa récompense, tous les X niveaux
      gardien: 'argent',
      gardienTousLes: 100,
      // Nouveau record : une clé tous les X niveaux de la mine (plusieurs peuvent tomber en même temps)
      records: [
        { tousLes: 100, cle: 'argent' },
        { tousLes: 250, cle: 'or' },
        { tousLes: 250, cle: 'etoile' },
      ],
      // (les clés des missions sont maintenant dans la récompense des chapitres : voir chapitres)
    },

    // Perles (monnaie premium, clé "gemmes") au début d'une partie. Dans le prototype, le menu cheat en ajoute.
    gemmesDepart: 0,

    // IMAGES : laisser '' pour garder le dessin temporaire.
    // Pour une vraie image : la poser dans Assets/Gear/ et écrire son chemin ici,
    // par exemple picLourd: 'Assets/Gear/PicLourd.png'. Voir Assets/Gear/LISEZMOI.md.
    images: {
      // Pelle et pioche de base, dans la mine, avant le premier coffre
      pelleDeBase: 'Assets/Equipements/Shovel_01.png', piocheDeBase: 'Assets/Equipements/Pickaxe_01.png',
      // Modèles d'équipement (un par archétype)
      picLourd: 'Assets/Equipements/Pickaxe_03.png', picEclats: 'Assets/Equipements/Pickaxe_13.png',
      picGivre: 'Assets/Equipements/Pickaxe_12.png',
      pelleProspecteur: 'Assets/Equipements/Shovel_09.png', pelleLarge: 'Assets/Equipements/Shovel_02.png',
      gantsFer: '', gantsDynamiteur: '',
      casqueChantier: '', casqueVeine: '',
      lanterneProspecteur: '', lanterneAncienne: '',
      bottesProspecteur: '', bottesPorteBonheur: '',
      // Coffres (fermés) et clés
      coffreBois: 'Assets/UI/Chest_Wood.png', coffreArgent: 'Assets/UI/Chest_Silver.png',
      coffreOr: 'Assets/UI/Chest_Gold.png', coffreEtoile: 'Assets/UI/Chest_Star.png',
      cleBois: 'Assets/UI/Key_Wood.png', cleArgent: 'Assets/UI/Key_Silver.png',
      cleOr: 'Assets/UI/Key_Gold.png', cleEtoile: 'Assets/UI/Key_Star.png',
      // Monnaie premium
      gemmes: 'Assets/UI/Icon_Pearl.png',
    },
  },

  /* ---------------------------------------------------------------
     CHAPITRES (missions principales)
     Un seul chapitre à la fois, en haut de la fenêtre Objectifs :
     atteindre un niveau de la mine. Sa récompense (clés, perles, XP)
     se récupère dans la fenêtre, puis le chapitre suivant commence et
     de nouvelles missions (voir objectifs ci-dessous) arrivent.
     --------------------------------------------------------------- */
  chapitres: {
    // Les premiers chapitres de la mine 1, plus courts.
    // "niveau" = le niveau à atteindre. "recompense" : pieces, gemmes (perles), xp,
    // et cles = { bois, argent, or, etoile : combien }.
    debut: [
      { niveau: 16, recompense: { cles: { argent: 1, bois: 1 }, gemmes: 10, xp: 40 } },
      { niveau: 30, recompense: { cles: { argent: 1, bois: 1 }, gemmes: 10, xp: 40 } },
      { niveau: 50, recompense: { cles: { argent: 1, bois: 1 }, gemmes: 15, xp: 50 } },
    ],

    // Ensuite, un chapitre tous les X niveaux, selon la mine : [mine 1, mine 2, mine 3 et suivantes].
    // Mine 1 = un chapitre par biome (100 niveaux). Les mines suivantes vont moins vite (voir
    // equipement > cles > facteurParMine), donc leurs chapitres sont plus courts : environ 1 par jour partout.
    tousLes: [100, 50, 25],

    // Récompense de ces chapitres
    recompense: { cles: { or: 1, bois: 1 }, gemmes: 20, xp: 60 },
  },

  /* ---------------------------------------------------------------
     OBJECTIFS AU VILLAGE (missions secondaires)
     3 missions simples sont affichées à la fois. Quand l'une est réussie,
     le joueur touche "Récupérer" pour gagner ses pièces et ses minerais,
     et une nouvelle mission la remplace, tant que le chapitre en a encore.
     --------------------------------------------------------------- */
  objectifs: {
    nombre: 3,                   // missions affichées en même temps
    parChapitre: 10,             // missions proposées par chapitre ; ensuite il faut finir le chapitre

    // Chaque chapitre, les récompenses grandissent de 15 % et les quantités de 10 % (arrondies à 5)
    bonusParChapitre: 0.15,
    quantiteParChapitre: 0.1,

    // Minerais gagnés en plus des pièces : le meilleur minerai déjà débloqué, en cette quantité (au chapitre 1)
    minerais: { cuivre: 5, fer: 4, or: 2, mithril: 1, cristalBrut: 1 },

    // Liste des missions possibles.
    // "texte" : {n} est remplacé par la quantité.
    // "choix" : la quantité est tirée au hasard parmi ces nombres ronds (les quantités de 5 et plus grandissent avec le chapitre).
    // "pieces" : récompense (au chapitre 1).
    // "xp" (facultatif) : XP du joueur gagnée, à la place de progressionJoueur > xpParMission.
    // "deblocage" : la mission n'est proposée qu'une fois cette nouveauté débloquée
    //   (mêmes noms que progression > deblocages, ou 'musee').
    liste: [
      { type: 'terre',      texte: 'Creuse {n} cases de terre',          choix: [20, 25, 30, 50], pieces: 25 },
      { type: 'tresors',    texte: 'Trouve {n} trésors',                 choix: [5, 10],          pieces: 40 },
      { type: 'niveaux',    texte: 'Termine {n} niveaux',                choix: [5, 10],          pieces: 40 },
      { type: 'pierres',    texte: 'Casse {n} pierres',                  choix: [10, 20, 25],     pieces: 40, deblocage: 'pioche' },
      { type: 'minerais',   texte: 'Récolte {n} minerais',               choix: [10, 20, 25],     pieces: 50, deblocage: 'cuivre' },
      { type: 'forge',      texte: 'Améliore un objet à la Forge', choix: [1],              pieces: 50, deblocage: 'forge' },
      { type: 'coffres',    texte: 'Ouvre {n} coffres',                  choix: [1, 2, 3],        pieces: 50, deblocage: 'forge' },
      { type: 'geodes',     texte: 'Ouvre {n} géodes',                   choix: [3, 5],           pieces: 60, deblocage: 'atelier' },
      { type: 'magma',      texte: 'Refroidis {n} cases de magma',       choix: [5, 10],          pieces: 40, deblocage: 'magma' },
      { type: 'bombes',     texte: 'Utilise {n} bombes',                 choix: [3, 5],           pieces: 50, deblocage: 'bombes' },
      { type: 'collection', texte: 'Complète une collection',            choix: [1],              pieces: 100, deblocage: 'musee' },
    ],
  },

  /* ---------------------------------------------------------------
     PROGRESSION DU JOUEUR (niveau du personnage)
     Le joueur gagne de l'XP en réussissant des missions (les objectifs du village).
     Chaque niveau atteint donne une récompense, à récupérer dans le menu Progression
     (en touchant l'encart en haut à gauche du village). Certains niveaux débloquent une fonctionnalité.
     --------------------------------------------------------------- */
  progressionJoueur: {
    // ---- D'où vient l'XP ----
    xpParMission: 20,                 // par mission réussie ("xp" dans objectifs > liste pour une valeur à part)
    xpRecord: 12,                     // par nouveau niveau atteint dans la mine (record)…
    xpRecordParBiome: 2,              // … + ça par biome au-delà du 1er (biome 2 : 14, biome 10 : 30)
    xpNiveau: 6,                      // par niveau terminé, même déjà joué (hors premiers pas) : un joueur bloqué progresse quand même
    xpNouveauTresor: 5,               // par trésor jamais vu ramené au Musée (peu : au début, presque tout est nouveau)
    xpEtoileCollection: 15,           // par nouvelle étoile de collection au Musée
    xpEquipement: { nouveau: 5, amelioration: 2, fusion: 10 },  // l'équipement compte, mais moins
    xpParPriere: 5,                   // par prière à l'Autel

    // ---- XP à gagner pour passer chaque niveau ----
    // Niveau 2 : "depart" ; chaque niveau suivant demande "enPlus" de plus (niveau 3 : 120, niveau 10 : 260…).
    // Repère : fin des premiers pas (niveau 16 de la mine) ≈ niveau 3 (sac 5 cases), niveau 4 avec les premières missions.
    // Une ligne de "niveaux" peut avoir son propre "xp".
    xp: { depart: 100, enPlus: 20 },

    // ---- Les niveaux, à partir du niveau 2 ----
    // "recompense" : pieces, gemmes (perles), potions, bombes, cle ('bois', 'argent', 'or', 'etoile') avec "cles" = combien,
    //   et les BÉNÉDICTIONS GARANTIES (paliers) :
    //   energie = énergie max (remplace l'ancienne Réserve d'énergie de la Forge),
    //   sac = nombre de cases du sac, poche = géodes qui ne prennent pas de case.
    // "deblocage" : la fonctionnalité qui s'ouvre à ce niveau (voir "fonctionnalites" ci-dessous).
    // Repères (à vérifier en test) : niveau 13 vers la fin du biome 1, 19 au biome 2, 35 au biome 5, 53 à la fin de la mine 1.
    // Après le dernier niveau de la liste, l'XP continue de grandir, sans récompense.
    niveaux: [
      { recompense: { pieces: 100 } },                              // 2
      { recompense: { sac: 5 } },                                   // 3  (montré à la fin des premiers pas)
      { recompense: { energie: 40 } },                              // 4
      { recompense: { pieces: 300 }, deblocage: 'evenements' },     // 5
      { recompense: { poche: 1 } },                                 // 6
      { recompense: { energie: 50 } },                              // 7
      { recompense: { gemmes: 10, cle: 'bois', cles: 1 } },         // 8
      { recompense: { sac: 6 } },                                   // 9
      { recompense: { energie: 60, gemmes: 50, cle: 'or', cles: 1 } }, // 10
      { recompense: { pieces: 600 } },                              // 11
      { recompense: { energie: 70 } },                              // 12
      { recompense: { cle: 'argent', cles: 1 } },                   // 13
      { recompense: { sac: 8 } },                                   // 14
      { recompense: { gemmes: 20, potions: 2 } },                   // 15
      { recompense: { energie: 85 } },                              // 16
      { recompense: { poche: 2 } },                                 // 17
      { recompense: { pieces: 1000 } },                             // 18
      { recompense: { energie: 100 } },                             // 19
      { recompense: { sac: 10, cle: 'or', cles: 1 } },              // 20
      { recompense: { bombes: 3 } },                                // 21
      { recompense: { energie: 115 } },                             // 22
      { recompense: { gemmes: 30 } },                               // 23
      { recompense: { sac: 12 } },                                  // 24
      { recompense: { energie: 130, cle: 'or', cles: 1 } },         // 25
      { recompense: { poche: 3 } },                                 // 26
      { recompense: { energie: 145 } },                             // 27
      { recompense: { pieces: 2000 } },                             // 28
      { recompense: { sac: 14 } },                                  // 29
      { recompense: { energie: 160, gemmes: 50 } },                 // 30
      { recompense: { potions: 3 } },                               // 31
      { recompense: { energie: 175 } },                             // 32
      { recompense: { sac: 16 } },                                  // 33
      { recompense: { cle: 'argent', cles: 2 } },                   // 34
      { recompense: { energie: 190, gemmes: 50 } },                 // 35
      { recompense: { poche: 4 } },                                 // 36
      { recompense: { energie: 205 } },                             // 37
      { recompense: { sac: 18 } },                                  // 38
      { recompense: { pieces: 4000 } },                             // 39
      { recompense: { energie: 220, gemmes: 100, cle: 'or', cles: 1 } }, // 40
      { recompense: { sac: 20 } },                                  // 41
      { recompense: { energie: 235 } },                             // 42
      { recompense: { bombes: 5 } },                                // 43
      { recompense: { energie: 250 } },                             // 44
      { recompense: { sac: 22, gemmes: 50 } },                      // 45
      { recompense: { energie: 265 } },                             // 46
      { recompense: { cle: 'or', cles: 1 } },                       // 47
      { recompense: { energie: 280 } },                             // 48
      { recompense: { sac: 24 } },                                  // 49
      { recompense: { energie: 295, gemmes: 100 } },                // 50
      { recompense: { energie: 310 } },                             // 51
      { recompense: { pieces: 8000 } },                             // 52
      { recompense: { energie: 340 } },                             // 53
    ],

    // Les fonctionnalités débloquées par le niveau du joueur : nom affiché dans le menu Progression
    fonctionnalites: {
      evenements: 'Événements',
    },
  },

  /* ---------------------------------------------------------------
     AUTEL DE LA MONTAGNE : LES RUNES (façon cartes de talent d'Archero 2)
     L'Autel apparaît au village au retour qui suit le niveau progression > deblocages > autel.
     Chaque prière coûte des pièces (de plus en plus cher) et tire une rune au hasard :
     une nouvelle rune (1 étoile) ou une étoile de plus sur une rune déjà gravée (5 étoiles max).
     Les runes plus rares entrent dans le tirage au fil des prières. Pas d'autre limite que le prix.
     La Rune du Roi Mineur n'a pas de limite d'étoiles : une fois les autres au maximum, chaque prière va sur elle.
     --------------------------------------------------------------- */
  autel: {
    nom: "Autel de la montagne",
    image: '',                        // image du bâtiment (vide = dessin provisoire)

    // Prix de la prière n° n (en commençant à 0) = depart + parPriere × n  →  150, 210, 270… 3 690 à la 60e
    prix: { depart: 150, parPriere: 60 },

    // Chances de tirer chaque rareté (parmi les runes qui peuvent encore gagner une étoile)
    chances: { commun: 55, rare: 28, epique: 13, legendaire: 4 },
    // Nombre de prières déjà faites pour que la rareté entre dans le tirage
    // (simulation : ~10 prières le 2e jour, ~20 vers le 6e, ~35 vers le 11e, ~42 à la fin de la mine 1)
    ouverture: { commun: 0, rare: 8, epique: 20, legendaire: 35 },
    etoilesMax: 5,

    // "valeurs" = l'effet à 1, 2, 3, 4 et 5 étoiles ; {v} dans "texte" est remplacé par la valeur.
    // "pourcent" : la valeur s'affiche en %. "deblocage" : la rune n'entre dans le tirage qu'une fois la nouveauté débloquée.
    // Certaines doublent un bonus d'équipement (Pelle, Gants, Casque, Lanterne, Bottes) : ils s'additionnent.
    runes: {
      source:       { nom: 'Rune de la Source',     rarete: 'commun',     texte: 'L\'arrosoir se recharge en {v} s (5 s sans rune)', valeurs: [4.5, 4, 3.5, 3, 2.5], deblocage: 'magma' },
      torrent:      { nom: 'Rune du Torrent',       rarete: 'commun',     texte: '{v} arrosages avant de recharger (1 sans rune)', valeurs: [2, 2, 3, 3, 4], deblocage: 'magma' },
      fortune:      { nom: 'Rune de Fortune',       rarete: 'commun',     texte: '+{v} de pièces par tas', valeurs: [0.05, 0.1, 0.15, 0.2, 0.3], pourcent: true },
      filon:        { nom: 'Rune du Filon',         rarete: 'commun',     texte: '+{v} de chance d\'un minerai en plus', valeurs: [0.05, 0.1, 0.15, 0.2, 0.3], pourcent: true },
      artificier:   { nom: 'Rune de l\'Artificier', rarete: 'rare',       texte: '{v} de chance qu\'une bombe ne soit pas utilisée', valeurs: [0.05, 0.1, 0.15, 0.2, 0.25], pourcent: true, deblocage: 'bombes' },
      herboriste:   { nom: 'Rune de l\'Herboriste', rarete: 'rare',       texte: '{v} de chance de recevoir une potion en remontant', valeurs: [0.1, 0.2, 0.3, 0.4, 0.5], pourcent: true, deblocage: 'potions' },
      conservateur: { nom: 'Rune du Conservateur',  rarete: 'rare',       texte: '+{v} sur les primes de collection du Musée', valeurs: [0.05, 0.1, 0.15, 0.2, 0.25], pourcent: true },
      savoir:       { nom: 'Rune du Savoir',        rarete: 'rare',       texte: '+{v} d\'XP de mineur', valeurs: [0.05, 0.1, 0.15, 0.2, 0.3], pourcent: true },
      souffle:      { nom: 'Rune du Souffle',       rarete: 'epique',     texte: '+{v} de chance de coup gratuit', valeurs: [0.02, 0.04, 0.06, 0.08, 0.1], pourcent: true },
      lueur:        { nom: 'Rune de la Lueur',      rarete: 'epique',     texte: '+{v} de géodes rares', valeurs: [0.05, 0.1, 0.15, 0.2, 0.25], pourcent: true },
      orpailleur:   { nom: 'Rune de l\'Orpailleur', rarete: 'epique',     texte: '{v} de chance de trouver un tas d\'or en creusant la terre', valeurs: [0.01, 0.02, 0.03, 0.04, 0.05], pourcent: true },
      arcEnCiel:    { nom: 'Rune Arc-en-ciel',      rarete: 'legendaire', texte: '{v} de chance par niveau d\'une case arc-en-ciel', valeurs: [0.005, 0.0075, 0.01, 0.0125, 0.015], pourcent: true },
      roi:          { nom: 'Rune du Roi Mineur',    rarete: 'legendaire', texte: '+{v} de pièces par tas (sans limite d\'étoiles)', parEtoile: 0.01, pourcent: true, sansLimite: true },
    },

    // Case arc-en-ciel (Rune Arc-en-ciel) : se creuse à la pelle, vaut ce nombre de tas de pièces d'un coup
    arcEnCiel: { tas: 60 },
  },

  /* ---------------------------------------------------------------
     ATELIER : MINI-JEU D'OUVERTURE DES GÉODES
     Chaque liste a 4 valeurs, une par géode :
     [Verte (Commune), Bleue (Rare), Violette (Épique), Dorée (Légendaire)]
     --------------------------------------------------------------- */
  atelier: {
    coupsNecessaires: [2, 3, 4, 5],              // coups réussis pour ouvrir
    largeurZoneVerte: [48, 39, 31, 24],          // en % de la barre (50 % plus large qu'avant : 32, 26, 21, 16)
    vitesseCurseur: [0.7, 0.85, 1.0, 1.15],      // allers-retours par seconde
    vies: 4,                                     // nombre de cœurs
    accelerationParCoup: 0.08,                   // le curseur accélère de 8 % après chaque coup réussi

    // Si le joueur perd tous ses cœurs, la géode s'ouvre quand même mais donne une gemme
    // d'une rareté en dessous. Une géode verte ratée donne ce nombre de pièces à la place :
    piecesGeodeBlancheRatee: 15,
  },

  /* ---------------------------------------------------------------
     ÉVÉNEMENTS
     --------------------------------------------------------------- */
  evenements: {
    // « Wide Mine » : une seule très grande mine, à la profondeur du record du joueur.
    // Un bouton « Déplacer » (au-dessus des outils) écarte l'interface pour faire glisser la mine.
    mineLarge: {
      nom: "Wide Mine",
      taille: 20,              // cases de côté (20 = 20 × 20)
      tresors: [8, 12],        // nombre de trésors cachés (au hasard entre les deux)
      largeurCase: 65,         // largeur d'une case en pixels, sur un écran de téléphone de 430 de large (s'adapte aux autres écrans)
    },
  },
};
