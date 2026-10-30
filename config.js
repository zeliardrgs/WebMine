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
  version: 'V1 test interne 0.2',


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

    // Mines suivantes (après la Mine des pionniers) : résistance de toutes les roches, par mine (1re valeur = mine 1).
    // Le coût "coutNiveau" ci-dessus est multiplié d'autant. Au-delà de la liste, la dernière valeur.
    resistanceParMine: [1, 20, 26, 32],

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

    // À 0 énergie dans la mine, une fenêtre propose : boire une potion du sac, regarder une pub (+pubEnergie),
    // une recharge complète contre des perles, ou remonter au village.
    panne: { pubEnergie: 10, pubsParJour: 5, prixRechargePerles: 30 },

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

    // La mine suivante se débloque quand le joueur TERMINE ce niveau de la mine précédente
    // (100 = battre l'étage gardien du niveau 100). On peut alors partir de son niveau 1.
    niveauDeblocage: 100,
    // Message affiché quand une nouvelle mine se débloque ({x} = le nom de la mine)
    texteDeblocage: "Nouvelle mine débloquée : {x} !",

    // Écran de choix de la mine : une carte par biome, dans l'ordre. "visuel" = le dessin de la mine au centre de la carte,
    // "fond" = l'image de fond de la carte (fichiers dans Assets/). Sans image, la carte prend un visuel et un fond par défaut.
    // "fondMine" = l'image de fond de l'écran pendant qu'on creuse dans cette mine (sans image : la grotte violette).
    // "terre" = les 3 images de la terre dans cette mine (les 3 variantes d'une case ; sans image : la terre marron).
    // "pierre" = les 3 images de la pierre dans cette mine : intacte, fissurée, très fissurée (sans image : la pierre grise).
    //   Les minerais sont dessinés par-dessus (mine > imagesMinerais).
    cartes: [
      { visuel: 'Assets/Mines/Mine_Tente.png',     fond: 'Assets/Mines/Fond_Prairie.webp' },   // 1  Mine des pionniers
      // Fond de plage provisoire (dessin simple) : à remplacer par la vraie illustration
      { visuel: 'Assets/Mines/Mine_Plage.png',     fond: 'Assets/Mines/Fond_Plage.svg', fondMine: 'Assets/Mines/Fond_Plage.svg',   // 2  Grotte des Marées
        terre: ['Assets/Ground/Tile_Beach_Sand1.png', 'Assets/Ground/Tile_Beach_Sand2.png', 'Assets/Ground/Tile_Beach_Sand3.png'],   // du sable
        pierre: ['Assets/Ground/Tile_Beach_Stone.png', 'Assets/Ground/Tile_Beach_Stone2.png', 'Assets/Ground/Tile_Beach_Stone3.png'] },
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
      'Grotte des Marées',
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
      // Pierre dure : retirée de la Grotte des Marées (une autre nouveauté viendra à sa place).
      // Provisoire : elle arrive au niveau 6 de la mine 3, à revoir quand on fera la mine 3.
      pierreDure: 206,
      or: 116,           // minerai d'or
      geodeDoree: 131,   // géodes violettes (Épiques)
      // (161, 176, 191 : nouveautés à créer)
      petrole: 106,      // Grotte des Marées (la plage) : le pétrole qui s'étend
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
      pierreDure:  { biomes: [3, 10], part: 0.5 },          // part des pierres qui deviennent dures
      source:      { biomes: [3, 10], nombre: [1, 2] },     // posées de préférence à côté du magma
      magmaChaine: { biomes: [4, 10], part: 1, magmaEnPlus: 1 }, // part du magma "en chaîne" + taches de magma en plus
      mystere:     { biomes: [5, 10], nombre: [1, 2] },
      racines:     { biomes: [6, 10], souches: [1, 2], racinesParSouche: [3, 5] },
      glace:       { biomes: [7, 10], part: 0.5 },          // part des pierres qui deviennent de la glace
      gaz:         { biomes: [8, 10], nombre: [1, 2] },
      coffre:      { biomes: [9, 10], nombre: [1, 1] },
      // PÉTROLE (la plage) : une flaque posée SUR une case, sans la casser. Tant qu'elle est là, la case dessous ne se creuse pas.
      // Les cases de pétrole qui se touchent forment une flaque : elle demande autant de coups de pioche qu'elle a de cases
      // (1 énergie par coup, sur n'importe laquelle de ses cases ; la puissance ne compte pas), puis disparaît d'un coup.
      // Tous les "tapsParExtension" coups sur la grille (pelle, pioche, arrosoir, bombe), chaque flaque prend une case
      // à côté au hasard, trésors compris (jamais une case déjà vide). Pas de limite de taille. Une bombe la souffle.
      // "chance" = chance qu'un niveau ait du pétrole ; "nombre" = flaques de départ (1 case chacune).
      petrole:     { biomes: [2, 10], nombre: [1, 2], chance: 0.6, tapsParExtension: 2 },
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
    // "mine" = le niveau est celui de cette mine (sans "mine" : Mine des pionniers).
    tresorsGarantis: [
      { niveau: 1,  tresor: 'feuille' },
      { niveau: 2,  tresor: 'coquillage' },
      { niveau: 3,  tresor: 'ammonite' },
      { niveau: 16, geode: 'blanche' },
      { mine: 2, niveau: 15, tresor: 'longueVue1' },   // le premier morceau du premier trésor en fragments
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
      { niveau: 206, nouveaute: 'pierreDure',  outil: 'pickaxe', texte: "La pierre dure demande plus de coups" },
      { niveau: 106, nouveaute: 'petrole',     outil: 'pickaxe', texte: "Casse vite le pétrole à la pioche : il s'étend !" },
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
        forge: "Découvre ton équipement",
        atelier: "Entre dans l'Atelier",
        shop: "Entre dans la Boutique",
        altar: "Entre dans l'Autel de la montagne",
      },
      galerie: "Ouvre ta nouvelle collection",        // 1re visite du Musée : le rideau de la collection
      ameliorerCollection: "Améliore ta collection",  // 1re visite du Musée : le bouton d'upgrade (1re étoile)
      prime: "Récupère ta récompense",                // 1re prime de collection au Musée (si le tutoriel du rideau est déjà passé)
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
        fusionner: "Fusionne 3 objets identiques",     // 1re fusion possible (écran Personnage, puis la fiche de l'objet)
      },
      // Premiers pas (niveaux 1 à 16)
      sac: "Tes trésors vont dans ton sac",           // 1er trésor ramassé (touche pour continuer)
      suivant: "Descends au niveau suivant",          // 1re fois que le bouton « Niveau suivant » apparaît
      energie: "Chaque coup de pioche coûte 1 énergie", // niveau de la pioche (touche pour continuer)
      continuer: "Continue jusqu'au checkpoint !",    // 1er sac plein avant un retour prévu, sur « Descendre quand même »
      echanger: "Garde ta nouvelle découverte",       // 1re fenêtre « Nouvelle découverte » (sac plein)
      remonter: "Remonte : du nouveau au village !",  // à chaque retour prévu (niveaux 11 et 16)
      retourVillage: "Retourne au village",           // fin des tutoriels de la Boutique et de l'Atelier
      atelier: "Tape quand le curseur est dans la zone", // 1re géode à l'Atelier (elle ne peut pas rater)
      sacBoutique: "Ton niveau de mineur agrandit ton sac !",  // fin des premiers pas : l'encart du niveau du joueur
      sacAcheter: "Récupère ta case de sac en plus",           // puis la récompense dans Progression
      priere: "Prie pour graver ta première rune",            // 1re visite de l'Autel
      objectifs: "Chaque jour, de nouvelles missions", // fin des premiers pas : le bouton Missions apparaît
      fin: "Bravo, tu connais la mine ! Bonne chance !", // message de fin des premiers pas
      energieOfferte: "Énergie offerte pour ce tutoriel", // un niveau tutoriel remet l'énergie qu'il faut
      horsSac: "Bonus : hors du sac",                 // trésor d'un niveau tutoriel
      ouvrirSac: "Ouvre ton sac",                     // tutoriels de la bombe
      utiliserBombe: "Utilise la bombe",
      // Le tout premier morceau d'un trésor en fragments ({x} = le trésor, avec son article)
      morceau: "Un morceau ! Trouve les autres pour reconstituer {x}.",
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
     TYPES D'ÉTAGES (Mine des pionniers, niveaux 1 à 100)
     Chaque étage a un type, qui décide de la taille de la grille, du nombre de trésors
     et de la composition du sol. Les étages tutoriels (progression > tutoriels) gardent leur
     grille de 3 × 3 ; les niveaux 1 et 2 gardent leur petite grille (voir grillesFixes).
     Les autres mines utilisent encore l'ancien système (progression > grilles et rythme).
     --------------------------------------------------------------- */
  etages: {
    actif: true,        // false = la Mine des pionniers revient à l'ancien système
    mine: 1,            // la mine concernée (1 = Mine des pionniers)

    // Le cycle de 10 niveaux, répété sur toute la mine (1er niveau du cycle = 1, 11, 21…).
    // Types : 'respiration', 'standard', 'fouille', 'defi', 'miniboss', 'tresor'.
    cycle: ['respiration', 'standard', 'standard', 'fouille', 'respiration', 'defi', 'respiration', 'defi', 'miniboss', 'tresor'],

    // true = les niveaux 2 à 8 de chaque cycle sont mélangés (toujours le même mélange pour un même joueur),
    // sans jamais mettre deux étages Défi d'affilée. Le 1er, le mini-boss (9) et l'étage trésor (10) ne bougent pas.
    melanger: true,

    // true = un niveau où arrive une nouveauté (une case, un minerai, une géode, un tutoriel) est toujours
    // un étage Respiration : son type est échangé avec un étage Respiration du même cycle
    nouveauteSurRespiration: true,
    // Ce qui compte comme une nouveauté de la mine (les noms de progression > deblocages) ;
    // les niveaux tutoriels (progression > tutoriels) comptent aussi
    nouveautes: ['pioche', 'cuivre', 'fer', 'or', 'geodes', 'geodeRose', 'geodeDoree', 'geodeCristal', 'magma', 'bombes'],

    // Niveaux qui gardent une grille à part : [colonnes, lignes]
    // (niveau 1 : une seule case pour apprendre à toucher ; niveau 2 : 2 × 2 pour apprendre à glisser)
    grillesFixes: { 1: [1, 1], 2: [2, 2] },

    // Composition du sol de chaque type : "pierre" et "magma" = part des cases (le reste est de la terre).
    // Avant le niveau du magma (progression > deblocages > magma), le magma est remplacé par de la pierre ;
    // avant la pioche, il n'y a que de la terre.
    // "cout" = l'énergie que l'étage demande au plus pour dégager ses trésors, en multiple de
    // profondeur > energie : au-delà, le recouvrement le plus dur est adouci d'un cran (le "plafond").
    // "plafond: false" = pas de plafond : les recouvrements suivent toujours les probabilités (etages > recouvrement),
    // même si l'étage coûte cher et termine parfois l'expédition (Défi et Mini-boss).
    // "texte" = la bulle affichée en arrivant sur l'étage (une fois par niveau). Vide = pas de bulle.
    types: {
      respiration: { nom: 'Respiration',   pierre: 0.15, magma: 0,    cout: 0.5 },
      standard:    { nom: 'Standard',      pierre: 0.40, magma: 0.08, cout: 1 },
      fouille:     { nom: 'Fouille',       pierre: 0.20, magma: 0.03, cout: 0.9 },
      defi:        { nom: 'Défi',          pierre: 0.50, magma: 0.22, cout: 1.4, plafond: false },
      miniboss:    { nom: 'Mini-boss',     pierre: 0.45, magma: 0.20, cout: 2,   plafond: false,
        texte: "Mini-boss ! Plus de roche… et plus de trésors à trouver." },
      // Étage trésor : pièces et minerai, réglés dans rythme > niveauTresor (comme avant)
      tresor:      { nom: 'Étage trésor',  pierre: 0.30, magma: 0,    cout: 0.6 },
      // Demi-gardien (niveau 50) : sa récompense = celle du gardien (rythme > niveauGardien) × "recompense"
      demiGardien: { nom: 'Demi-gardien',  pierre: 0.45, magma: 0.20, cout: 2.2, recompense: 0.5,
        texte: "Demi-gardien ! Une grande mine pleine de trésors… et une récompense à la fin." },
      gardien:     { nom: 'Gardien',       pierre: 0.50, magma: 0.22, cout: 1.5 },
      // Étage Lucky (voir "lucky" plus bas) : surtout de la terre, la pierre est presque toujours à minerai
      lucky:       { nom: 'Lucky',         pierre: 0.15, magma: 0,    cout: 0.3 },
    },

    // Taille de la grille [colonnes, lignes] et nombre de trésors [minimum, maximum] de chaque type, par tranche de niveaux.
    // "depuis" = premier niveau de la tranche. defi: null = pas d'étage Défi dans la tranche (remplacé par Standard).
    // Un type peut aussi changer sa composition dans une tranche (ex. un mini-boss plus doux : pierre, magma).
    tranches: [
      { depuis: 1,
        respiration: { grille: [2, 2], tresors: [1, 1] },
        standard:    { grille: [3, 3], tresors: [1, 1] },
        fouille:     { grille: [4, 4], tresors: [2, 2] },
        defi:        null,
        miniboss:    { grille: [4, 4], tresors: [3, 3], pierre: 0.25, magma: 0 },   // doux
        tresor:      { grille: [4, 4], tresors: [1, 1] } },
      { depuis: 11,
        respiration: { grille: [3, 3], tresors: [1, 1] },
        standard:    { grille: [4, 4], tresors: [2, 2] },
        fouille:     { grille: [5, 5], tresors: [3, 3] },
        defi:        { grille: [4, 4], tresors: [2, 2] },
        miniboss:    { grille: [6, 5], tresors: [4, 4] },
        tresor:      { grille: [5, 5], tresors: [1, 1] } },
      { depuis: 21,
        respiration: { grille: [3, 3], tresors: [1, 1] },
        standard:    { grille: [4, 4], tresors: [2, 2] },
        fouille:     { grille: [6, 5], tresors: [3, 3] },
        defi:        { grille: [5, 5], tresors: [2, 3] },
        miniboss:    { grille: [7, 6], tresors: [4, 4] },
        tresor:      { grille: [5, 5], tresors: [2, 2] } },
      { depuis: 31,
        respiration: { grille: [4, 4], tresors: [1, 1] },
        standard:    { grille: [5, 5], tresors: [2, 2] },
        fouille:     { grille: [6, 6], tresors: [4, 4] },
        defi:        { grille: [5, 5], tresors: [3, 3] },
        miniboss:    { grille: [8, 6], tresors: [5, 5] },
        tresor:      { grille: [6, 6], tresors: [2, 2] } },
      { depuis: 51,
        respiration: { grille: [4, 4], tresors: [1, 2] },
        standard:    { grille: [5, 5], tresors: [2, 3] },
        fouille:     { grille: [7, 6], tresors: [4, 4] },
        defi:        { grille: [6, 6], tresors: [3, 3] },
        miniboss:    { grille: [8, 7], tresors: [5, 5] },
        tresor:      { grille: [6, 6], tresors: [2, 2] } },
      { depuis: 71,
        respiration: { grille: [4, 4], tresors: [2, 2] },
        standard:    { grille: [6, 5], tresors: [3, 3] },
        fouille:     { grille: [7, 7], tresors: [5, 5] },
        defi:        { grille: [6, 6], tresors: [4, 4] },
        miniboss:    { grille: [9, 7], tresors: [5, 5] },
        tresor:      { grille: [7, 7], tresors: [2, 2] } },
    ],

    // Étages à part, qui remplacent l'étage prévu par le cycle
    speciaux: {
      50:  { type: 'demiGardien', grille: [10, 8],  tresors: [5, 5] },
      100: { type: 'gardien',     grille: [12, 10], tresors: [6, 6] },
    },

    // Ce qui monte avec la profondeur, par tranche de niveaux ("depuis" = premier niveau) :
    // "resistance" = multiplie la résistance de TOUTES les roches (pierre, minerai, magma refroidi, pierre dure…) :
    //   une pierre demande mine > coupsPierre coups à la puissance 0, × resistance. La puissance de l'équipement
    //   fait baisser le nombre de coups : un joueur sous-équipé paie beaucoup plus d'énergie en profondeur ;
    // "energie" = énergie de base (coups à la puissance 0) qu'un étage peut demander au plus pour ses trésors
    //   (multipliée par le "cout" du type) : si les recouvrements tirés coûtent plus, le plus dur est adouci d'un cran
    //   (Scellé → Caché → Mixte → Indice → Ouvert) ;
    // "durete" = multiplie les chances des recouvrements durs (Caché et Scellé) : plus il est grand, plus ils sont fréquents.
    // Refonte du 30 octobre 2026 (puissance de l'équipement) : la difficulté ne monte qu'avec la profondeur, jamais avec l'équipement.
    // Simulation (WebMine/.sim/gearsim.js) : un joueur à 3 × 10 min par jour, qui met ses pièces dans l'équipement,
    // finit la mine vers le jour 15 en dépensant 5 à 10 énergie par étage.
    profondeur: [
      { depuis: 1,  resistance: 1,  energie: 3,   durete: 0.6 },
      { depuis: 11, resistance: 2,  energie: 10,   durete: 0.8 },
      { depuis: 21, resistance: 3,  energie: 21,  durete: 0.8 },
      { depuis: 31, resistance: 5,  energie: 35,  durete: 1 },
      { depuis: 51, resistance: 8,  energie: 94,  durete: 1.4 },
      { depuis: 61, resistance: 11, energie: 119,  durete: 1.6 },
      { depuis: 71, resistance: 14, energie: 175, durete: 1.8 },
      { depuis: 91, resistance: 17, energie: 189, durete: 1.8 },
    ],

    // RECOUVREMENT DES TRÉSORS : ce qui cache chaque trésor.
    //   ouvert = uniquement de la terre ;
    //   indice = une seule case de terre, le reste en pierre ou magma (seulement pour les trésors de plus d'une case) ;
    //   mixte  = moitié terre, moitié pierre ou magma ;
    //   cache  = uniquement de la pierre ;
    //   scelle = pierre et magma.
    // Chance d'un recouvrement = parRarete × parType × (durete de la profondeur, pour cache et scelle seulement).
    // Les séries "sol: 'terre'" (Fossiles) sont toujours ouvertes ; "sol: 'pierre'" et "sol: 'magma'" choisissent
    // la matière (pierre ou magma) de leurs cases couvertes. Avant la pioche : tout est ouvert ;
    // avant le magma : le magma est remplacé par de la pierre.
    recouvrement: {
      // Poids de base selon la rareté du trésor (les géodes ont aussi une rareté)
      parRarete: {
        common:    { ouvert: 55, indice: 35, mixte: 10, cache: 3,  scelle: 1 },
        rare:      { ouvert: 8,  indice: 40, mixte: 35, cache: 12, scelle: 5 },
        epic:      { ouvert: 0,  indice: 8,  mixte: 17, cache: 40, scelle: 35 },
        legendary: { ouvert: 0,  indice: 5,  mixte: 15, cache: 40, scelle: 40 },
      },
      // Multiplicateurs selon le type d'étage (1 = sans changement, 0 = jamais).
      // toujours = ce recouvrement, quoi qu'il arrive ; auMoinsUnDur = au moins un trésor Caché ou Scellé sur l'étage.
      parType: {
        respiration: { ouvert: 12, indice: 1,   mixte: 0.2, cache: 0.05, scelle: 0 },
        fouille:     { ouvert: 12, indice: 1,   mixte: 0.2, cache: 0.05, scelle: 0 },
        standard:    { ouvert: 0.2, indice: 2,  mixte: 2,   cache: 0.3,  scelle: 0.1 },
        defi:        { ouvert: 0,  indice: 0.2, mixte: 2,   cache: 3,    scelle: 3 },
        miniboss:    { ouvert: 1,  indice: 1,   mixte: 1,   cache: 1.5,  scelle: 1.5, auMoinsUnDur: true },
        demiGardien: { ouvert: 1,  indice: 1,   mixte: 1,   cache: 1.5,  scelle: 1.5, auMoinsUnDur: true },
        gardien:     { ouvert: 0.5, indice: 1,  mixte: 1,   cache: 2,    scelle: 2,   auMoinsUnDur: true },
        tresor:      { toujours: 'ouvert' },
        lucky:       { toujours: 'ouvert' },
      },
    },

    // Grandes grilles (mini-boss, demi-gardien, gardien) : si les cases deviennent plus petites que
    // "caseMin" pixels (sur un téléphone de 430 de large), la mine s'affiche comme la Wide Mine :
    // cases de cette taille, et un bouton « Déplacer » pour faire glisser la grille.
    grandeGrille: { caseMin: 44 },

    // ÉTAGE LUCKY : à chaque descente, petite chance que l'étage prévu soit remplacé par un étage chanceux.
    // Il compte comme un niveau normal. Pas de trésor à trouver : on peut descendre tout de suite.
    // Jamais sur un mini-boss, un étage trésor, les gardiens (50 et 100), un étage tutoriel, un niveau à trésor garanti
    // ou pendant les premiers pas ; jamais deux d'affilée.
    lucky: {
      actif: true,
      chance: 0.06,              // chance à chaque descente (0.06 ≈ 1 étage sur 17)
      pasAvantMiniboss: false,   // true = jamais sur l'étage juste avant un mini-boss
      tailleComme: 'fouille',    // la grille est celle de ce type d'étage, dans la tranche de niveaux (etages > tranches)
      chanceMinerai: 0.85,       // chance qu'une pierre de l'étage contienne du minerai
      // Tas de pièces : "nombre" = [minimum, maximum] de tas, "pieces" = [minimum, maximum] de pièces dans chaque tas
      tas: {
        petit: { nombre: [3, 5], pieces: [3, 6] },
        moyen: { nombre: [2, 3], pieces: [8, 14] },
        grand: { nombre: [1, 2], pieces: [20, 30] },
      },
      // La tuile arc-en-ciel (une par étage) : l'énergie rendue quand on la creuse (sans dépasser le maximum)
      arcEnCiel: { energie: 15 },
      images: {
        petit: 'Assets/Ground/Tile_Overlay_CoinSmall-1.png',   // 1 pièce
        moyen: 'Assets/Ground/Tile_Overlay_CoinSmall.png',     // 2 pièces
        grand: 'Assets/Ground/Tile_Overlay_CoinBig.png',       // 3 pièces et plus
        arcEnCiel: 'Assets/Ground/Tile_Rainbow.png',
      },
      banniere: "Étage chanceux !",                      // à l'arrivée, aux couleurs de l'arc-en-ciel
      recap: "Tu as trouvé un étage chanceux !",         // sur l'écran de fin d'expédition
      texteArcEnCiel: "+{n} énergie",                    // au-dessus de la tuile arc-en-ciel creusée
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
    // Dégâts de la pioche de base (sans équipement). Les « coups » ci-dessous sont comptés avec cette pioche :
    // une pierre de 3 coups a donc 3 × 10 = 30 points de résistance. Les dégâts affichés sont toujours des nombres entiers.
    degatsPioche: 10,
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

    // Image de chaque minerai, posée par-dessus la pierre de la mine (une pierre à minerai prend la pierre de la mine
    // où l'on creuse, puis ce dessin). Vide = le mithril reprend le fer, le cristal brut reprend le cuivre, recolorés.
    imagesMinerais: {
      cuivre: 'Assets/Ground/Tile_Overlay_Copper.png',
      fer: 'Assets/Ground/Tile_Overlay_iron.png',
      or: 'Assets/Ground/Tile_Overlay_Gold.png',
      mithril: '',
      cristalBrut: '',
    },

    // Quantité obtenue en cassant une pierre à minerai : [minimum, maximum]
    quantiteMinerais: { fer: [1, 3], cuivre: [1, 2], or: [1, 1], mithril: [1, 1], cristalBrut: [1, 1] },
    // Tas de pièces des étages normaux : petit, moyen ou grand (mêmes images que l'étage Lucky, etages > lucky > images).
    // chance = poids du tirage ; valeur = multiplie la valeur d'un tas (en moyenne ≈ 1, la même économie qu'avant).
    taillesTasDePieces: { petit: { chance: 40, valeur: 0.6 }, moyen: { chance: 40, valeur: 1 }, grand: { chance: 20, valeur: 1.6 } },
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

    // Pièces gagnées en ouvrant une nouvelle collection au Musée (bouton « Ouvrir » du rideau),
    // en fraction de la prime de la collection (0.5 = la moitié ; arrondi à 5 pièces)
    primeNouvelleCollection: 0.5,

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

    // TRÉSORS EN FRAGMENTS, au Musée : le trésor est en silhouette, chaque morceau trouvé la remplit.
    // Quand tous les morceaux sont réunis, le bouton « Reconstituer » apparaît ; c'est seulement alors
    // que le trésor compte comme trouvé (prime de découverte, collection, étoiles).
    // Un nouveau jeu complet de morceaux (doublons compris) permet de le reconstituer encore une fois.
    // MUSÉE : le bouton Collection (en haut à gauche) range les collections par catégorie.
    // Une catégorie par mine (dans l'ordre des mines), puis « Pierres précieuses et Reliques » : les pierres des géodes
    // et les trésors trouvables dans plusieurs mines (Monnaies du royaume perdu, Clés du Roi Mineur).
    // "fond" = l'image derrière les vitrines (vide = le fond par défaut) ; "bandeau" = la couleur du bandeau de titre.
    vitrines: {
      mines: [
        { fond: 'Assets/UI/Character BG.png', bandeau: '#0aa0e6' },   // Mine des pionniers (bleu)
        { fond: 'Assets/Mines/Fond_Plage.svg', bandeau: '#12a594' },  // Grotte des Marées (bleu-vert)
      ],
      precieux: { nom: 'Pierres précieuses et Reliques', icone: 'Assets/Treasures/Gem_Purple_4.png',
        fond: 'Assets/Mines/Fond_Cristal.webp', bandeau: '#8d42cc' },   // violet
    },

    fragments: {
      bouton: "Reconstituer",
      message: "Trésor reconstitué : {x} !",
      // Durée de l'animation d'assemblage, en millisecondes
      dureeAnimation: 1400,
    },

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
    // Un objet peut aussi avoir ses propres "niveaux" (ex. un objet rare qui n'arrive qu'en fin de mine) :
    // ils passent avant son biome et avant les niveaux de la série.
    // Mine des pionniers = niveaux 1 à 100.
    // "taille" = [largeur, hauteur] du trésor en cases (ex. [2, 1] = 2 cases côte à côte, [1, 2] = 2 cases l'une sur l'autre).
    // "mine" (sur une série ou sur un objet) : les "niveaux" sont ceux de CETTE mine, de 1 à 100
    // (ex. mine: 2, niveaux: [10, 60] = niveaux 10 à 60 de la Grotte des Marées). Sans "mine" : mine 1.
    // Sols possibles : 'terre', 'pierre', 'pierreDure', 'magma', 'coffre' ou 'tout'.
    // (pierre dure et coffres arrivent avec les biomes 3 et 9 : en attendant, ils sont remplacés
    //  par de la pierre normale / n'importe quelle case.)
    //
    // Pour un nouvel objet, on peut donner son image et sa taille ici :
    // "image" = le fichier dans Assets/Treasures/, sans « .png » (ex. 'BeachPirate/image 1') ;
    // "taille" = [largeur, hauteur] en cases dans la grille (sans taille : 1 case).
    //
    // TRÉSORS EN FRAGMENTS : un seul trésor du Musée, découpé en morceaux trouvés séparément.
    // "morceaux" = la liste des morceaux, dans l'ordre (morceau 1, 2, 3…). Chaque morceau :
    //   "image" = son image découpée ; "position" = [centre X, centre Y, largeur, rotation] du morceau
    //   sur l'image entière, en % de l'image entière (rotation en degrés). Ces positions ont été mesurées
    //   en recalant chaque morceau sur l'image entière : à refaire si l'artiste change les images.
    // Les morceaux s'appellent comme le trésor suivi de leur numéro : longueVue1, longueVue2…
    // Chaque morceau prend une case dans la grille et une case dans le sac. Un morceau déjà trouvé est un doublon.
    // "article" = le petit mot devant le nom dans le tutoriel (« reconstituer LA Longue-vue »).
    artefacts: {
      fossiles: { nom: 'Fossiles de surface', prime: 50, niveaux: [1, 30], sol: 'terre', objets: {
        coquillage: { nom: 'Coquillage fossile', rarete: 'common', taille: [1, 1] },
        feuille:    { nom: 'Feuille fossile',    rarete: 'common', taille: [1, 1] },
        ammonite:   { nom: 'Petite ammonite',    rarete: 'common', taille: [1, 1] },
      } },
      // Une pièce par mine : le Sou de cuivre dans la Mine des pionniers, les autres dans les mines suivantes
      monnaies: { nom: 'Monnaies du royaume perdu', prime: 200, sol: 'tout', objets: {
        sou:     { nom: 'Sou de cuivre',     rarete: 'common', niveaux: [5, 100], taille: [1, 1] },
        denier:  { nom: "Denier d'argent",   rarete: 'common', mine: 2, niveaux: [5, 100] },
        ecu:     { nom: 'Écu de bronze',     rarete: 'common', biome: 3 },
        ducat:   { nom: "Ducat d'or",        rarete: 'common', biome: 4 },
        florin:  { nom: 'Florin de platine', rarete: 'common', biome: 5 },
        pieceDuRoi: { nom: 'Pièce du roi',   rarete: 'epic',   biome: 6 },
      } },
      celestes: { nom: 'Cartes célestes', prime: 50, niveaux: [10, 70], sol: 'tout', objets: {
        lion:     { nom: 'Plaque du Lion',     rarete: 'common', taille: [2, 2] },
        taureau:  { nom: 'Plaque du Taureau',  rarete: 'common', taille: [2, 2] },
        scorpion: { nom: 'Plaque du Scorpion', rarete: 'common', taille: [2, 2] },
        dragon:   { nom: 'Plaque du Dragon',   rarete: 'rare', taille: [2, 2] },
      } },
      outils: { nom: 'Outils du mineur oublié', prime: 100, niveaux: [20, 80], sol: 'pierre', objets: {
        lampe:   { nom: 'Lampe rouillée',          rarete: 'common', taille: [1, 2] },
        gourde:  { nom: 'Vieille gourde',          rarete: 'common', taille: [1, 1] },
        casque:  { nom: 'Casque cabossé',          rarete: 'common', taille: [1, 1] },
        pioche:  { nom: 'Pioche du premier mineur', rarete: 'rare', taille: [3, 1] },
      } },
      feu: { nom: 'Pierres de feu', prime: 200, niveaux: [30, 100], sol: 'magma', objets: {
        obsidienne:   { nom: 'Obsidienne',     rarete: 'common', taille: [1, 1] },
        pierreDeLave: { nom: 'Pierre de lave', rarete: 'common', taille: [2, 1] },
        coeurDeBraise: { nom: 'Cœur de braise', rarete: 'epic', niveaux: [70, 100], taille: [2, 2] },
      } },
      tablette: { nom: 'Tablette ancienne', prime: 100, niveaux: [50, 100], sol: 'pierre',
        // Texte affiché quand la tablette est complète
        legende: "« Sous la montagne dort le trésor du Roi Mineur. Cinq clés, cachées de plus en plus profond, ouvrent son coffre. »",
        objets: {
          fragmentGauche:  { nom: 'Fragment gauche',  rarete: 'common', taille: [1, 2] },
          fragmentCentral: { nom: 'Fragment central', rarete: 'common', taille: [1, 2] },
          fragmentDroit:   { nom: 'Fragment droit',   rarete: 'common', taille: [1, 2] },
        } },

      /* ----- GROTTE DES MARÉES (mine 2) -----
         Primes : même logique que la Mine des pionniers (plus la collection est difficile, plus la prime est grande),
         × 1,5 car les tas de pièces valent 50 % de plus dans la mine 2 (rythme > niveauTresor > bonusParBiome).
         Du plus facile au plus dur : Coquillages 75, Butin des pirates 150 (morceaux : 2), Journal du capitaine 225
         (morceaux : 3), Trésors des abysses 300 (Épique), Épave engloutie 450 (Épique en 4 morceaux). */
      coquillages: { nom: 'Coquillages de la crique', prime: 75, mine: 2, niveaux: [1, 30], sol: 'terre', objets: {
        saintJacques: { nom: 'Coquille Saint-Jacques', rarete: 'common', image: 'BeachPirate/image 1' },
        etoileDeMer:  { nom: 'Étoile de mer',          rarete: 'common', image: 'BeachPirate/image 2' },
        oursin:       { nom: 'Oursin',                 rarete: 'common', image: 'BeachPirate/image 3' },
        hippocampe:   { nom: 'Hippocampe',             rarete: 'rare',   image: 'BeachPirate/image 4' },
      } },
      pirates: { nom: 'Butin des pirates', prime: 150, mine: 2, niveaux: [10, 60], sol: 'tout', objets: {
        pieceDeHuit: { nom: 'Pièce de huit',  rarete: 'common', image: 'BeachPirate/image 7' },
        crochet:     { nom: 'Crochet rouillé', rarete: 'common', image: 'BeachPirate/image 8', taille: [2, 2] },
        bandana:     { nom: 'Bandana troué',   rarete: 'common', image: 'BeachPirate/image 9', taille: [2, 2] },
        // Le premier trésor en fragments du jeu : ses morceaux n'arrivent qu'à partir du niveau 15
        // (le morceau 1 est garanti au niveau 15 : progression > tresorsGarantis)
        longueVue: { nom: 'Longue-vue', article: 'la', rarete: 'rare', niveaux: [15, 60], image: 'BeachPirate/image 10', morceaux: [
          { image: 'BeachPirate/Mask group-3', position: [31.1, 59.5, 74.2, -30] },   // l'objectif
          { image: 'BeachPirate/Mask group-4', position: [74.8, 33.4, 46.1, -30] },   // l'oculaire
        ] },
      } },
      journal: { nom: 'Journal du capitaine', prime: 225, mine: 2, niveaux: [30, 80], sol: 'tout', objets: {
        encrier: { nom: 'Encrier',          rarete: 'common', image: 'BeachPirate/image 11', taille: [2, 2] },
        plume:   { nom: 'Plume de mouette', rarete: 'common', image: 'BeachPirate/image 12', taille: [2, 2] },
        sablier: { nom: 'Sablier',          rarete: 'common', image: 'BeachPirate/image 13', taille: [2, 2] },
        carteAuTresor: { nom: 'Carte au trésor', article: 'la', rarete: 'rare', image: 'BeachPirate/image 14', morceaux: [
          { image: 'BeachPirate/Mask group',   position: [37.7, 26.2, 81.8, 0] },   // le haut
          { image: 'BeachPirate/Mask group-1', position: [26.2, 83.9, 58.8, 0] },   // le palmier
          { image: 'BeachPirate/Mask group-2', position: [73.7, 58.6, 64.5, 0] },   // la croix
        ] },
      } },
      epave: { nom: 'Épave engloutie', prime: 450, mine: 2, niveaux: [50, 100], sol: 'tout', objets: {
        ancre:      { nom: 'Ancre miniature',     rarete: 'common', image: 'BeachPirate/image 11-1', taille: [2, 2] },
        cloche:     { nom: 'Cloche du navire',    rarete: 'common', image: 'BeachPirate/image 12-1', taille: [2, 2] },
        gouvernail: { nom: 'Roue de gouvernail',  rarete: 'common', image: 'BeachPirate/image 13-1', taille: [2, 2] },
        figureDeProue: { nom: 'Figure de proue', article: 'la', rarete: 'epic', image: 'BeachPirate/image 14-1', morceaux: [
          { image: 'BeachPirate/Mask group-5', position: [53.6, 17.2, 69.8, 0] },   // la tête
          { image: 'BeachPirate/Mask group-6', position: [29.0, 46.5, 50.2, 0] },   // les cheveux
          { image: 'BeachPirate/Mask group-7', position: [70.7, 52.8, 35.5, 0] },   // le buste
          { image: 'BeachPirate/Mask group-8', position: [53.6, 86.1, 69.8, 0] },   // la queue
        ] },
      } },
      // Déplacée de l'ancien biome 8 (niveaux 701 à 800) vers la Grotte des Marées
      abysses: { nom: 'Trésors des abysses', prime: 300, mine: 2, niveaux: [70, 100], sol: 'tout', objets: {
        corail:     { nom: 'Corail pétrifié', rarete: 'common', image: 'BeachPirate/image 11-2', taille: [2, 2] },
        conque:     { nom: 'Conque abyssale', rarete: 'common', image: 'BeachPirate/image 12-2', taille: [2, 2] },
        perleNoire: { nom: 'Perle noire',     rarete: 'epic',   image: 'BeachPirate/image 13-2', taille: [2, 2] },
      } },
      // Une pièce par biome, du biome 1 au biome 6

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
     Elles s'améliorent et se fusionnent depuis leur fiche (écran Personnage).
     L'équipement s'ouvre avec la Forge (progression > deblocages > forge).
     --------------------------------------------------------------- */
  equipement: {
    // Nom du personnage, affiché au-dessus du mineur sur l'écran Personnage
    nomPersonnage: 'Bidule',

    // Les 7 raretés (échelle Habby), de la plus courante à la plus rare.
    // "niveauMax" = niveau maximum de l'EMPLACEMENT quand un objet de cette rareté y est équipé (null = sans limite).
    //   Le niveau appartient à l'emplacement, pas à l'objet (comme dans les jeux Habby) : changer d'objet garde le niveau,
    //   mais un objet de rareté plus basse le limite à son niveauMax tant qu'il est équipé ;
    // "multiplicateur" = la puissance et la stat secondaire de l'objet sont multipliées par ce nombre ;
    // "S" = palier « S » : même couleur que la rareté, avec un badge S.
    // "fusion" = ce qu'il faut pour passer à la rareté suivante, avec l'objet + 2 autres de la même rareté :
    //   'identique'   = 2 objets du même modèle (ex. 3 Pics lourds) ;
    //   'emplacement' = 2 objets du même emplacement, n'importe quel modèle (ex. 3 pioches).
    raretes: {
      commun:      { nom: 'Commun',       niveauMax: 10,   multiplicateur: 1,   fusion: 'identique' },
      rare:        { nom: 'Rare',         niveauMax: 30,   multiplicateur: 1.4, fusion: 'identique' },
      epique:      { nom: 'Épique',       niveauMax: 75,   multiplicateur: 2,   fusion: 'emplacement' },
      epiqueS:     { nom: 'Épique S',     niveauMax: 75,   multiplicateur: 2.5, fusion: 'identique', S: true },
      legendaire:  { nom: 'Légendaire',   niveauMax: 100,  multiplicateur: 3,   fusion: 'identique' },
      legendaireS: { nom: 'Légendaire S', niveauMax: 100,  multiplicateur: 3.6, fusion: 'identique', S: true },
      mythique:    { nom: 'Mythique',     niveauMax: null, multiplicateur: 4.5 },
    },

    // Fusion (bouton en haut à droite de la fiche de l'objet) : l'objet + 2 autres de la même rareté donnent
    // 1 objet de la rareté suivante (voir "fusion" dans chaque rareté). Le niveau reste celui de l'emplacement.
    fusion: { nombre: 3 },
    // Bouton « Fusion auto » (écran Personnage) : fait d'un coup toutes les fusions dont le résultat est au plus de cette rareté
    // (Commun → Rare, Rare → Épique). Au-dessus, les fusions restent à la main.
    fusionAuto: 'epique',

    // Les 6 emplacements. "deblocage" = la nouveauté qui le fait apparaître dans les coffres
    // (mêmes noms que progression > deblocages ; null = dès l'ouverture de l'équipement).
    // PUISSANCE : chaque objet équipé donne de la puissance ; les dégâts d'un coup de pioche = mine > degatsPioche + la puissance
    // de tout l'équipement. Puissance d'un objet = (depart + parNiveau × (niveau de l'emplacement − 1)) × multiplicateur de la rareté.
    // "stat" = la STAT SECONDAIRE de l'emplacement (l'ancienne stat principale), calculée de la même façon, sans dépasser "max".
    // "court" = nom court de la stat, affiché avec sa valeur dans la fiche de l'objet. La Pioche n'a pas de stat secondaire :
    // elle donne plus de puissance que les autres.
    // Les pourcentages sont écrits en décimal : 0.1 = 10 % ("nombre: true" = un nombre, pas un pourcentage).
    // "modeles" = les archétypes de l'emplacement. "biome" = biome à partir duquel il sort des coffres.
    // Chaque modèle a un passif qui s'active à Épique et grandit à chaque rareté au-dessus :
    // "valeurs" = [Épique, Épique S, Légendaire, Légendaire S, Mythique].
    emplacements: {
      pioche: {
        nom: 'Pioche', deblocage: 'pioche',
        puissance: { depart: 3, parNiveau: 1 },
        stat: null,
        modeles: {
          picLourd:  { nom: 'Pic lourd',  biome: 1, passif: '{v} de chance de frapper deux fois plus fort', valeurs: [0.12, 0.16, 0.2, 0.25, 0.3] },
          picEclats: { nom: 'Pic à éclats', biome: 2, passif: '{v} de chance de casser aussi une roche voisine', valeurs: [0.12, 0.17, 0.22, 0.275, 0.33] },
          picGivre:  { nom: 'Pic de givre', biome: 3, passif: 'Dégâts sur la glace : {v} (au lieu de 50 %)', valeurs: [1, 1.125, 1.25, 1.375, 1.5] },
        },
      },
      pelle: {
        nom: 'Pelle', deblocage: null,
        puissance: { depart: 1, parNiveau: 0.4 },
        stat: { court: 'Pièces par tas', texte: '+{v} de pièces par tas', depart: 0.1, parNiveau: 0.02 },
        modeles: {
          pelleProspecteur: { nom: 'Pelle de prospecteur', biome: 1, passif: '+{v} tas de pièces sur les niveaux trésor', valeurs: [1, 1.5, 2, 2.5, 3], nombre: true },
          pelleLarge:       { nom: 'Pelle large', biome: 2, passif: '{v} de chance de creuser aussi une terre voisine', valeurs: [0.15, 0.2, 0.25, 0.325, 0.4] },
        },
      },
      gants: {
        nom: 'Gants', deblocage: 'cuivre',
        puissance: { depart: 1, parNiveau: 0.4 },
        stat: { court: 'Minerai en plus', texte: '{v} de chance de +1 minerai par bloc', depart: 0.1, parNiveau: 0.03, max: 2 },
        modeles: {
          gantsFer:        { nom: 'Gants de fer', biome: 1, passif: '{v} de chance de trouver aussi le meilleur minerai', valeurs: [0.05, 0.075, 0.1, 0.15, 0.2] },
          gantsDynamiteur: { nom: 'Gants de dynamiteur', biome: 2, passif: '{v} de chance qu\'une bombe ne soit pas utilisée', valeurs: [0.2, 0.225, 0.25, 0.29, 0.33] },
        },
      },
      casque: {
        nom: 'Casque', deblocage: 'casque',
        puissance: { depart: 1, parNiveau: 0.4 },
        // Endurance = chance qu'un coup de pioche ne coûte pas d'énergie (un « coup gratuit »). Source principale
        // d'énergie de la mine avec les niveaux de la pioche (réglé par simulation le 16 octobre 2026).
        stat: { court: 'Endurance', texte: 'Endurance : {v} de chance qu\'un coup de pioche ne coûte pas d\'énergie', depart: 0.09, parNiveau: 0.015, max: 0.45 },
        modeles: {
          casqueChantier: { nom: 'Casque de chantier', biome: 1, passif: 'Un coup gratuit casse le bloc d\'un coup : {v} de chance', valeurs: [0.25, 0.375, 0.5, 0.75, 1] },
          casqueVeine:    { nom: 'Casque de veine', biome: 2, passif: '+{v} de chance de coup gratuit sur le minerai', valeurs: [0.1, 0.15, 0.2, 0.25, 0.3] },
        },
      },
      lanterne: {
        nom: 'Lanterne', deblocage: 'geodes',
        puissance: { depart: 1, parNiveau: 0.4 },
        stat: { court: 'Géodes rares', texte: 'Géodes rares {v} plus fréquentes', depart: 0.1, parNiveau: 0.03 },
        modeles: {
          lanterneProspecteur: { nom: 'Lanterne de prospecteur', biome: 1, passif: '{v} de chance qu\'une géode monte d\'une rareté', valeurs: [0.1, 0.15, 0.2, 0.275, 0.35] },
          lanterneAncienne:    { nom: 'Lanterne ancienne', biome: 2, passif: 'Artefacts jamais trouvés × {v} plus fréquents', valeurs: [1.5, 1.75, 2, 2.5, 3], nombre: true },
        },
      },
      bottes: {
        nom: 'Bottes', deblocage: 'bottes',
        puissance: { depart: 1, parNiveau: 0.4 },
        stat: { court: "Tas d'or caché", texte: '{v} de chance qu\'une case de terre cache un tas d\'or', depart: 0.02, parNiveau: 0.003, max: 0.5 },
        modeles: {
          bottesProspecteur:  { nom: 'Bottes de prospecteur', biome: 1, passif: '+{v} de tas d\'or en plus', valeurs: [0.25, 0.375, 0.5, 0.75, 1] },
          bottesPorteBonheur: { nom: 'Bottes porte-bonheur', biome: 2, passif: '{v} de chance qu\'un tas de pièces soit doublé', valeurs: [0.15, 0.2, 0.25, 0.325, 0.4] },
        },
      },
    },

    // Améliorer un emplacement d'un niveau (depuis la fiche de l'objet équipé).
    // Pièces : depart × niveau ^ exposant (niveau 1 → 2 : depart ; niveau 10 : ~190 ; niveau 30 : ~990 ; niveau 75 : ~3 900).
    // Minerai : selon la tranche de niveaux, "depart" + "parNiveau" × (niveaux déjà faits dans la tranche).
    // Le tout premier niveau est offert pendant le tutoriel.
    ameliorer: {
      pieces: { depart: 6, exposant: 1.5 },
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
      // (les clés des missions sont dans la récompense du jour : voir missions > recompenses)
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
     MISSIONS DU JOUR (bouton Missions du village)
     Chaque jour, de nouvelles missions. Le joueur touche "Récupérer" sur
     une mission réussie pour gagner ses pièces, ses minerais et son XP.
     Quand toutes les missions du jour sont récupérées, il gagne la
     récompense du jour (perles, clé ou fée). La frise du haut montre les jours 1 à 7 (le jour 1 = le premier
     jour de jeu) : un jour passé de la semaine reste jouable jusqu'à la fin de la semaine.
     --------------------------------------------------------------- */
  missions: {
    nombre: 4,                   // missions par jour
    relances: 1,                 // missions qu'on peut changer (bouton ↻) par jour, gratuitement

    // Les récompenses grandissent de 4 % et les quantités de 3 % (arrondies à 5) par niveau du joueur au-delà du 1er
    bonusParNiveau: 0.04,
    quantiteParNiveau: 0.03,

    // Minerais gagnés en plus des pièces : le meilleur minerai déjà débloqué, en cette quantité (au niveau 1)
    minerais: { cuivre: 5, fer: 4, or: 2, mithril: 1, cristalBrut: 1 },

    // MISSIONS DIFFICILES : une mission tirée avec la plus grande quantité de ses "choix" est difficile.
    // Elle donne en plus un consommable (au hasard parmi ceux déjà débloqués), en cette quantité.
    // C'est le seul moyen d'obtenir des potions, des bombes et des radars (ni la Boutique ni les événements n'en vendent).
    // Ils ne s'utilisent que dans la mine principale.
    consommables: { potion: 1, bombe: 2, radar: 1 },

    // Liste des missions possibles (une même mission ne revient pas deux fois le même jour).
    // "texte" : {n} est remplacé par la quantité ; [singulier, pluriel] quand la quantité peut valoir 1.
    // "choix" : la quantité est tirée au hasard parmi ces nombres ronds (ceux de 5 et plus grandissent avec le niveau du joueur).
    // "pieces" : récompense (au niveau 1).
    // "xp" (facultatif) : XP du joueur gagnée, à la place de progressionJoueur > xpParMission.
    // "deblocage" : la mission n'est proposée qu'une fois cette nouveauté débloquée
    //   (mêmes noms que progression > deblocages, ou 'musee').
    liste: [
      { type: 'terre',      texte: 'Creuse {n} cases de terre',          choix: [30, 50, 80],     pieces: 25 },
      { type: 'tresors',    texte: 'Trouve {n} trésors',                 choix: [5, 10],          pieces: 40 },
      { type: 'niveaux',    texte: 'Termine {n} niveaux',                choix: [5, 10],          pieces: 40 },
      { type: 'pierres',    texte: 'Casse {n} pierres',                  choix: [10, 20, 25],     pieces: 40, deblocage: 'pioche' },
      { type: 'minerais',   texte: 'Récolte {n} minerais',               choix: [10, 20, 25],     pieces: 50, deblocage: 'cuivre' },
      { type: 'forge',      texte: 'Améliore un objet',                  choix: [1],              pieces: 50, deblocage: 'forge' },
      { type: 'coffres',    texte: ['Ouvre un coffre', 'Ouvre {n} coffres'], choix: [1, 2],          pieces: 50, deblocage: 'forge' },
      { type: 'geodes',     texte: 'Ouvre {n} géodes',                   choix: [3, 5],           pieces: 60, deblocage: 'atelier' },
      { type: 'magma',      texte: 'Refroidis {n} cases de magma',       choix: [5, 10],          pieces: 40, deblocage: 'magma' },
      { type: 'bombes',     texte: 'Utilise {n} bombes',                 choix: [3, 5],           pieces: 50, deblocage: 'bombes' },
    ],

    // Jauge de la semaine (sous les jours) : toutes les missions récupérées dans la semaine, jours passés compris.
    // "missions" = nombre à atteindre (4 missions × 7 jours = 28 au plus).
    semaine: {
      paliers: [
        { missions: 10, recompense: { cles: { bois: 1 } } },
        { missions: 20, recompense: { cles: { argent: 1 } } },
        { missions: 28, recompense: { cles: { or: 1 }, gemmes: 30 } },
      ],
    },

    // Récompense du jour, du jour 1 au jour 7, gagnée quand toutes les missions du jour sont récupérées.
    // Le jour 1 est le premier jour où le joueur a les missions ; après le jour 7, un nouveau cycle recommence au jour 1.
    // gemmes (perles), cles = { bois, argent, or, etoile : combien }, fee ('hasard' = une couleur que le joueur
    // n'a pas encore, ou une couleur de pets > fees), pieces, xp. La page montre le cadeau principal en grand
    // (la fée, sinon la meilleure clé, sinon les perles) et le reste à côté.
    recompenses: [
      { gemmes: 15 },             // jour 1
      { cles: { bois: 1 } },      // jour 2
      { gemmes: 20 },             // jour 3
      { cles: { argent: 1 } },    // jour 4
      { gemmes: 25 },             // jour 5
      { cles: { or: 1 } },        // jour 6
      { fee: 'hasard' },         // jour 7 : une fée
    ],
  },

  /* ---------------------------------------------------------------
     PROGRESSION DU JOUEUR (niveau du personnage)
     Le joueur gagne de l'XP en réussissant des missions (les missions du jour).
     Chaque niveau atteint donne une récompense, à récupérer dans le menu Progression
     (en touchant l'encart en haut à gauche du village). Certains niveaux débloquent une fonctionnalité.
     --------------------------------------------------------------- */
  progressionJoueur: {
    // ---- D'où vient l'XP ----
    // Seuls les nouveaux trésors, les collections complétées (étoiles, récupérées au Musée) et les checkpoints de la mine
    // donnent de l'XP. Tout le reste est à 0.
    xpCheckpoint: 50,                 // par nouveau checkpoint de mine atteint (tous les 10 niveaux)
    xpParMission: 0,                  // missions : plus d'XP
    xpRecord: 0,                      // records de profondeur : plus d'XP (seuls les checkpoints en donnent)
    xpRecordParBiome: 0,
    // Énergie maximum en plus à chaque niveau du mineur, en complément des récompenses « energie » ci-dessous
    // (0 = seulement les récompenses ; réglé par simulation le 16 octobre 2026)
    energieParNiveau: 1,
    xpNiveau: 0,                      // niveaux terminés : plus d'XP
    xpNouveauTresor: 15,              // par trésor jamais vu ramené au Musée
    xpEtoileCollection: 40,           // par collection complétée (chaque étoile), récupérée au Musée
    xpEquipement: { nouveau: 0, amelioration: 0, fusion: 0 },  // équipement : plus d'XP
    xpParPriere: 0,                   // Autel : plus d'XP
    xpGeode: 0,                       // géodes ouvertes : plus d'XP (la pierre nouvelle qu'elle donne compte comme un nouveau trésor)

    // ---- XP à gagner pour passer chaque niveau ----
    // Niveau 2 : "depart" ; chaque niveau suivant demande "enPlus" de plus (niveau 3 : 70, niveau 10 : 140…).
    // Réglé par simulation le 30 octobre 2026 (seuls trésors, collections et checkpoints donnent de l'XP) :
    // fin des premiers pas ≈ niveau 3-4, fin de la Mine des pionniers (~jour 15) ≈ niveau 13.
    // Une ligne de "niveaux" peut avoir son propre "xp".
    xp: { depart: 60, enPlus: 10 },

    // ---- Les niveaux, à partir du niveau 2 ----
    // "recompense" : pieces, gemmes (perles), potions, bombes, cle ('bois', 'argent', 'or', 'etoile') avec "cles" = combien,
    //   et les BÉNÉDICTIONS GARANTIES (paliers) :
    //   energie = énergie max (remplace l'ancienne Réserve d'énergie de la Forge),
    //   sac = nombre de cases du sac, poche = géodes qui ne prennent pas de case,
    //   fee = une fée : 'hasard' (une couleur que le joueur n'a pas encore) ou une couleur de pets > fees (ex. 'bleue').
    // "deblocage" : la fonctionnalité qui s'ouvre à ce niveau (voir "fonctionnalites" ci-dessous).
    // Repère (simulation du 30 octobre 2026) : niveau 8 à la fin du 1er jour, 12 vers le jour 7, 13 à la fin de la Mine des pionniers.
    // Après le dernier niveau de la liste, l'XP continue de grandir, sans récompense.
    niveaux: [
      { recompense: { pieces: 100 } },                              // 2
      { recompense: { sac: 5, fee: 'hasard' } },                    // 3  (montré à la fin des premiers pas) : la 1re fée
      { recompense: { energie: 40 } },                              // 4
      { recompense: { pieces: 300 }, deblocage: 'evenements' },     // 5
      { recompense: { poche: 1, fee: 'hasard' } },                  // 6  : la 2e fée
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
     AUTEL DE LA MONTAGNE : LES RUNES (comme les talents d'Archero 2)
     L'Autel apparaît au village au retour qui suit le niveau progression > deblocages > autel.
     Toutes les runes sont là dès le début, au niveau 0. Chaque prière coûte des pièces (de plus en plus cher) :
     une lumière passe sur les runes et s'arrête sur l'une d'elles au hasard, qui gagne un niveau (jusqu'à "niveauMax").
     Une rune au maximum ne sort plus. Pas de rareté, pas d'étoiles : un niveau, un bonus.
     --------------------------------------------------------------- */
  autel: {
    nom: "Autel de la montagne",
    image: '',                        // image du bâtiment (vide = dessin provisoire)

    // Prix de la prière n° n (en commençant à 0) = depart + parPriere × n  →  150, 210, 270… (80 prières pour tout finir)
    prix: { depart: 150, parPriere: 60 },

    niveauMax: 10,

    // Effet d'une rune au niveau N = base + parNiveau × N ("pourcent" : affiché en %, "arrondi: 'bas'" : nombre entier).
    // "deblocage" : la rune n'apparaît qu'une fois la nouveauté débloquée. Certaines s'ajoutent aux bonus de l'équipement.
    runes: {
      fortune:      { nom: 'Rune de Fortune',       texte: '+{v} de pièces par tas',            parNiveau: 0.03, pourcent: true },
      filon:        { nom: 'Rune du Filon',         texte: '+{v} de chance d\'un minerai en plus', parNiveau: 0.03, pourcent: true },
      souffle:      { nom: 'Rune du Souffle',       texte: '+{v} de chance de coup gratuit',     parNiveau: 0.01, pourcent: true },
      lueur:        { nom: 'Rune de la Lueur',      texte: '+{v} de géodes rares',               parNiveau: 0.03, pourcent: true },
      conservateur: { nom: 'Rune du Conservateur',  texte: '+{v} sur les primes du Musée',       parNiveau: 0.03, pourcent: true },
      savoir:       { nom: 'Rune du Savoir',        texte: '+{v} d\'XP de mineur',               parNiveau: 0.03, pourcent: true },
      source:       { nom: 'Rune de la Source',     texte: 'L\'arrosoir se recharge en {v} s',   base: 5, parNiveau: -0.25, deblocage: 'magma' },
      torrent:      { nom: 'Rune du Torrent',       texte: '{v} arrosages avant de recharger',   base: 1, parNiveau: 0.3, arrondi: 'bas', deblocage: 'magma' },
    },

    // Case arc-en-ciel (anciennes sauvegardes seulement : la rune qui la faisait apparaître a été retirée)
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

    // Ouvrir plusieurs géodes d'un coup : tailles de groupe possibles. Le jeu prend automatiquement le plus
    // grand groupe possible avec le stock. Seulement des géodes de la même rareté, et seulement une fois
    // qu'une géode de cette rareté a déjà été ouverte seule.
    // Le mini-jeu se joue une fois pour tout le groupe : réussi, chaque géode donne une gemme de sa rareté ;
    // raté, chaque géode donne une gemme d'une rareté en dessous (ou des pièces pour les vertes).
    groupes: [5, 10, 20],

    // Bouton « Passer » : ouvre la géode tout de suite (comme réussie), une fois que ce type de géode a déjà été
    // ouvert ce nombre de fois (les géodes d'un groupe comptent chacune). Rareté absente = jamais (Légendaire).
    passer: { common: 3, rare: 5, epic: 10 },
  },

  /* ---------------------------------------------------------------
     PETS
     --------------------------------------------------------------- */
  pets: {
    // Catégories des fées : chacune a son nom et son icône, montrés sur la carte de la fée (Liste) et dans sa fiche
    categories: {
      energie:  { nom: "Énergie",  icone: "Assets/Pets/Cat_Energie.png" },
      tresor:   { nom: "Trésor",   icone: "Assets/Pets/Cat_Tresor.png" },
      fortune:  { nom: "Fortune",  icone: "Assets/Pets/Cat_Fortune.png" },
      minerais: { nom: "Minerais", icone: "Assets/Pets/Cat_Minerais.png" },
    },
    // Les fées (une image par couleur, dans Assets/Pets/). categorie = une des catégories ci-dessus (la Liste les range dans cet ordre).
    // bonus = phrase courte (fiche de la fée, bulle dans la mine) ; detail = quand et comment elle agit (fiche de la fée)
    // effet = ce que fait la fée équipée, chance = probabilité que ça marche (la fée s'anime quand ça arrive) :
    //   À la pioche ou à l'arrosoir :
    //   unCoup   : au premier coup de pioche sur une pierre, la casse directement
    //   energie  : sur un coup de pioche, rend de l'énergie (valeur = combien)
    //   arrosoir : quand l'arrosoir se vide, le recharge d'un coup
    //   En arrivant dans l'étage (une fois par étage) :
    //   magma    : refroidit un magma de la grille (nombre: 2 = deux magmas côte à côte)
    //   tasDOr   : cache un tas d'or dans la terre (on le trouve en creusant la bonne case ; nombre: 2 = deux tas)
    //   reveler  : montre où se cache un trésor (comme un radar)
    //   inconnu  : un trésor de l'étage est un trésor encore jamais découvert (s'il en reste à cette profondeur)
    //   minerai  : ajoute un minerai dans la grille (une pierre devient un minerai)
    //   geode    : une géode cachée de l'étage devient plus rare
    fees: {
      rouge:     { nom: "Fée rouge",       categorie: 'energie',  visuel: "Assets/Pets/Pet_Fairy_Red.png",    effet: 'unCoup',   chance: 0.15,
                   bonus: "Peut casser une pierre d'un coup",        detail: "Au premier coup de pioche sur une pierre : peut la casser directement" },
      verte:     { nom: "Fée verte",       categorie: 'energie',  visuel: "Assets/Pets/Pet_Fairy_Green.png",  effet: 'energie',  chance: 0.12, valeur: 2,
                   bonus: "Peut rendre un peu d'énergie",            detail: "Sur un coup de pioche : peut rendre un peu d'énergie" },
      bleue:     { nom: "Fée bleue",       categorie: 'energie',  visuel: "Assets/Pets/Pet_Fairy_Blue.png",   effet: 'magma',    chance: 0.35,
                   bonus: "Peut refroidir un magma",                 detail: "En arrivant dans l'étage : peut refroidir un magma de la grille" },
      glace:     { nom: "Fée des glaces",  categorie: 'energie',  visuel: "Assets/Pets/Pet_Fairy_Ice.png",    effet: 'arrosoir', chance: 0.25,
                   bonus: "Peut remplir l'arrosoir",                 detail: "Quand l'arrosoir est vide : peut le recharger d'un coup" },
      jaune:     { nom: "Fée jaune",       categorie: 'fortune',  visuel: "Assets/Pets/Pet_Fairy_Yellow.png", effet: 'tasDOr',   chance: 0.35,
                   bonus: "Peut faire apparaître un tas d'or",       detail: "En arrivant dans l'étage : peut cacher un tas d'or dans la terre" },
      rose:      { nom: "Fée rose",        categorie: 'tresor',   visuel: "Assets/Pets/Pet_Fairy_Pink.png",   effet: 'reveler',  chance: 0.25,
                   bonus: "Peut révéler un trésor caché",            detail: "En arrivant dans l'étage : peut montrer où se cache un trésor" },
      nuit:      { nom: "Fée de nuit",     categorie: 'tresor',   visuel: "Assets/Pets/Pet_Fairy_Night.png",  effet: 'inconnu',  chance: 0.25,
                   bonus: "Peut attirer un trésor jamais trouvé",    detail: "En arrivant dans l'étage : un trésor de l'étage peut être un trésor encore jamais découvert" },
      orange:    { nom: "Fée orange",      categorie: 'minerais', visuel: "Assets/Pets/Pet_Fairy_Orange.png", effet: 'minerai',  chance: 0.4,
                   bonus: "Peut ajouter un minerai",                 detail: "En arrivant dans l'étage : peut ajouter un minerai dans la grille" },
      violette:  { nom: "Fée violette",    categorie: 'tresor',   visuel: "Assets/Pets/Pet_Fairy_Purple.png", effet: 'geode',    chance: 0.3,
                   bonus: "Peut améliorer une géode",                detail: "En arrivant dans l'étage : si une géode est cachée, peut la rendre plus rare" },
      // Fées rares de la boutique premium : rarete 'rare' (carte bleue), prix = texte du bouton d'achat (pas encore de vrai paiement :
      // l'achat donne la fée tout de suite). Elles ne se gagnent qu'en les achetant (jamais dans une récompense « fée au hasard »).
      // couleurAccueil = fond de son encart sur la page d'accueil (un encart par fée pas encore achetée).
      champi:    { nom: "Fée champignon",  categorie: 'fortune',  visuel: "Assets/Pets/Pet_Fairy_Mushroom.png", effet: 'tasDOr', chance: 0.3, nombre: 2,
                   rarete: 'rare', prix: "0.00$", couleurAccueil: "#ff8a7a",
                   bonus: "Peut faire apparaître 2 tas d'or",        detail: "En arrivant dans l'étage : peut cacher 2 tas d'or dans la terre" },
      meduse:    { nom: "Fée méduse",      categorie: 'energie',  visuel: "Assets/Pets/Pet_Fairy_Jellyfish.png", effet: 'magma', chance: 0.35, nombre: 2,
                   rarete: 'rare', prix: "0.00$", couleurAccueil: "#5ec8ff",
                   bonus: "Peut refroidir 2 magmas côte à côte",     detail: "En arrivant dans l'étage : peut refroidir 2 magmas adjacents" },
    },
    perlesDoublon: 10,        // pas de fée en double : quand le joueur a déjà toutes les fées, une fée gagnée devient ces perles
    feeSurNiveauVide: true,   // sac illimité : les niveaux de Progression qui ne donnaient que de la place dans le sac donnent une fée
    depart: 0,          // fées données au joueur au début (couleurs au hasard). Les autres arrivent par la Progression (recompense > fee)
    vitesse: 40,        // vitesse de vol, en % de la largeur de l'écran par seconde (40 = traverse l'écran en ~2,5 s)
    taille: 17,         // largeur d'une fée, en % de la largeur de l'écran
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

  /* ---------------------------------------------------------------
     MINE HANTÉE (événement d'Halloween, temporaire)
     Une mine à part, de 30 niveaux, avec les règles de la mine principale :
     terre gratuite à la pelle, pierre à la pioche (1 énergie par coup), arrosoir,
     bombes, radars et potions. Elle est tirée à nouveau à chaque descente.
     Ta progression dans la vraie mine n'est jamais touchée : elle est mise de côté
     pendant la descente et revient quand le joueur remonte.
     L'événement apparaît avec les Événements (progressionJoueur > niveaux : "evenements").
     IMAGES : laisser '' pour garder le dessin provisoire. Le nom du fichier attendu est
     écrit en commentaire à côté : pose l'image dans Assets/Event/Halloween/ et écris son chemin.
     --------------------------------------------------------------- */
  mineHantee: {
    nom: "La Mine Hantée",
    // Écran d'accueil de l'événement (maquette Figma « Spooky Mine ») : fond, logo, entrée de la mine
    accueil: {
      fond: 'Assets/Event/Halloween/HauntedMine_BG.jpg',
      logo: 'Assets/Event/Halloween/SpookyMine_Logo.png',
      entree: 'Assets/Event/Halloween/HauntedMine_Entrance.png',
    },
    iconeTicket: 'Assets/Event/Halloween/Icon_Ticket.png',

    // Jour 1 de l'événement (année-mois-jour). Les jours changent à minuit, à l'heure du téléphone du joueur.
    debut: '2026-10-18',
    // Calendrier, en jours de l'événement (J1 = le jour "debut", J14 = le soir d'Halloween)
    calendrier: {
      mineOuverte: [1, 14],    // la mine est ouverte du J1 au J14 (Tickets gratuits ces jours-là seulement)
      promo: [13, 16],         // packs de Tickets en promo
      fin: 16,                 // dernier jour de l'événement. J15 et J16 : la boutique seule reste ouverte
    },

    // TICKETS : 1 Ticket = 1 descente, avec l'énergie bleue pleine (energieTicket)
    tickets: {
      parJour: 3,              // Tickets gratuits par jour. Pas de cumul : ceux qui restent sont perdus à minuit
      // true = les Tickets gratuits arrivent en deux fois : "aMinuit" à minuit, le reste à "heure" (18 = 18 h)
      enDeuxFois: false,
      deuxFois: { aMinuit: 2, heure: 18 },
      pubsParJour: 2,          // Tickets en plus par jour avec une publicité (1 pub = 1 Ticket, perdu à minuit comme les gratuits)
      // Les Tickets achetés (boutique premium) ne sont jamais perdus : ils restent jusqu'à la fin de l'événement.
      // Ils servent après les Tickets gratuits.
      premiereDescenteOfferte: true,   // la toute première descente est guidée et ne coûte pas de Ticket
    },

    // ÉNERGIE BLEUE : chaque Ticket remplit une barre d'énergie bleue, la même pour tous les joueurs (le niveau du mineur
    // ne compte pas : le classement reste juste). L'énergie de la mine principale n'est pas touchée.
    // Dans la mine de l'événement : pas de potion, de pub, de perles, de bombe ni de radar. La barre vide termine la descente.
    // La puissance de l'équipement compte : elle fait baisser les coups par roche.
    energieTicket: 60,

    // NIVEAUX : la mine n'a pas de fond. Les 3 décors se suivent par tranches de 10 niveaux, puis recommencent
    // (31 = Potager, 41 = Forêt…). Une Citrouille géante garde chaque checkpoint (10, 20, 30…, voir "boss").
    // Battre la Citrouille d'un checkpoint ouvre le départ juste après (11, 21, 31…).
    // Ce qui monte avec la profondeur :
    //   "resistanceDepart" + "resistanceParDizaine" × (dizaine − 1) = résistance de toutes les roches
    //     (3 aux niveaux 1-10, 4 aux niveaux 11-20, 5 aux niveaux 21-30, 6 aux niveaux 31-40…) ;
    //   la grille grandit d'une case tous les "tailleEnPlusTous" niveaux, jusqu'à 7 × 7.
    profondeur: { resistanceDepart: 3, resistanceParDizaine: 1, tailleEnPlusTous: 30 },
    // Un décor par tranche de 10 niveaux. "depuis" = son premier niveau (le premier tour : 1, 11, 21).
    // "taille" = la grille (5 = 5 × 5 cases, 7 maximum) ; "tresors" = [minimum, maximum] de trésors par niveau ;
    // "partPierre" = part des cases en pierre (0.35 = 35 %) ; "chanceCandy" = chance qu'une pierre soit une Pierre à Candy Corn.
    //   Résistance 3 : une pierre demande 9 coups à la puissance 0, 3 coups avec 20 de puissance, 1 avec 80.
    // "cout" = énergie pour dégager les trésors d'un niveau (à la puissance 0), en part de l'énergie bleue (0.06 = 6 %) :
    //   chaque joueur fait à peu près le même nombre de niveaux par Ticket
    //   (au moins 3 énergie par niveau, soit une pierre). Repère : environ 15 niveaux par Ticket si le joueur ne casse
    //   que ce qui cache les trésors, moins s'il casse aussi les Pierres à Candy Corn et les Pierres aux yeux.
    //   Comme dans la mine principale, un trésor garde une case dans la terre (energie > indiceTresor) :
    //   un petit trésor d'une case ne coûte donc rien.
    // "cases" = nombre de cases spéciales par niveau, [minimum, maximum] (voir "tuiles" plus bas).
    // "fond" = image de fond de l'écran ; "terre" = 1 à 3 images de terre (variantes) ;
    // "pierre" = 1 à 3 images de pierre (intacte, fissurée, très fissurée ; avec une seule image, des fissures sont dessinées dessus).
    biomes: [
      { nom: 'Potager aux citrouilles', depuis: 1, taille: 5, tresors: [1, 1], partPierre: 0.35, chanceCandy: 0.3, cout: 0.05,
        cases: { yeux: [1, 1], toiles: [0, 0], sacs: [0, 0], grosBonbons: [0, 1] },
        fond: '',     // Assets/Event/Halloween/Fond_Potager.png
        terre: ['Assets/Event/Halloween/Tile_Halloween_Dirt.png'],     // une image propre au décor : Assets/Event/Halloween/Terre_Potager_1.png, _2, _3
        pierre: ['Assets/Event/Halloween/Tile_Halloween_Stone.png'] }, // une image propre au décor : Assets/Event/Halloween/Pierre_Potager_1.png, _2, _3
      { nom: 'Forêt des chauves-souris', depuis: 11, taille: 6, tresors: [1, 2], partPierre: 0.4, chanceCandy: 0.3, cout: 0.06,
        cases: { yeux: [1, 2], toiles: [1, 1], sacs: [0, 1], grosBonbons: [0, 1] },
        fond: '',     // Assets/Event/Halloween/Fond_Foret.png
        terre: ['Assets/Event/Halloween/Tile_Halloween_Dirt.png'],     // une image propre au décor : Assets/Event/Halloween/Terre_Foret_1.png, _2, _3
        pierre: ['Assets/Event/Halloween/Tile_Halloween_Stone.png'] }, // une image propre au décor : Assets/Event/Halloween/Pierre_Foret_1.png, _2, _3
      { nom: 'Manoir des fantômes', depuis: 21, taille: 6, tresors: [2, 2], partPierre: 0.45, chanceCandy: 0.3, cout: 0.07,
        cases: { yeux: [1, 2], toiles: [1, 2], sacs: [1, 1], grosBonbons: [1, 1] },
        fond: '',     // Assets/Event/Halloween/Fond_Manoir.png
        terre: ['Assets/Event/Halloween/Tile_Halloween_Dirt.png'],     // une image propre au décor : Assets/Event/Halloween/Terre_Manoir_1.png, _2, _3
        pierre: ['Assets/Event/Halloween/Tile_Halloween_Stone.png'] }, // une image propre au décor : Assets/Event/Halloween/Pierre_Manoir_1.png, _2, _3
    ],
    // Niveaux trésor : remplis de Candy Corn, à chaque descente. Au milieu de chaque tranche de 10 : 5, 15, 25…
    niveauTresor: {
      tousLes: 10, decalage: 5,
      tailleEnPlus: 1,          // la grille est plus grande d'un cran (7 × 7 maximum)
      chanceCandy: 0.75,        // chance qu'une pierre soit une Pierre à Candy Corn (au lieu de "chanceCandy" du décor)
      tasDeBonbons: [3, 5],     // tas de Candy Corn, ramassés gratuitement d'un coup de pelle
      bonbonsParTas: [2, 4],
      texte: "Niveau trésor ! Des Candy Corn partout.",
    },
    // Niveaux gardiens : chaque checkpoint (10, 20, 30…), avec sa Citrouille géante (voir "boss")
    niveauGardien: {
      tousLes: 10,
      pierreEnPlus: 1.4,        // quantité de pierre (1 = normal)
      texte: "Niveau gardien ! Bats la Citrouille géante pour descendre plus bas.",
    },

    /* ----- LES TWISTS ----- */

    // NUIT D'HALLOWEEN : on ne voit que les cases à côté des cases déjà creusées (et la rangée du bas).
    // Les Pierres aux yeux brillent dans le noir ; la Citrouille géante aussi. Le radar marche comme d'habitude.
    // On peut creuser une case dans le noir : on ne sait juste pas ce qu'elle cache.
    nuit: {
      depuis: 11,              // la nuit tombe à partir de ce niveau (11 = la Forêt et le Manoir ; 1 = toute la mine ; 0 = jamais)
      rangeesEclairees: 1,     // rangées du bas toujours visibles (on part du bas pour remonter dans le noir)
      image: '',               // Assets/Event/Halloween/Tile_Nuit.png (une case dans le noir, 134 × 152 comme les autres cases)
    },

    // L'HEURE DES BONBONS : chaque soir, à l'heure du téléphone du joueur, tant que la mine est ouverte
    heureDesBonbons: {
      de: 20, a: 21,           // de 20 h à 21 h
      multiplicateur: 2,       // Candy Corn × 2 (pierres, sacs, tas, Bonbon ou farce)
      yeuxEnPlus: 2,           // Pierres aux yeux en plus dans chaque niveau
      texte: "Heure des bonbons : Candy Corn ×{x} !",
      texteBientot: "Heure des bonbons à {h} h : Candy Corn ×{x} !",
    },

    // LA CITROUILLE GÉANTE : elle garde chaque checkpoint (niveauGardien > tousLes). Tant qu'elle n'est pas battue,
    // on ne peut pas descendre plus bas. Elle prend 2 × 2 cases. Ses dégâts restent d'une descente à l'autre.
    // Une fois battue, elle ne revient plus : son départ (le niveau juste après) est ouvert.
    // "vie" = sa vie en coups de pioche à la puissance 0, en part de l'énergie bleue × la résistance du niveau
    //   (1.2 : 72 coups × la résistance) ; chaque Citrouille suivante a "vieEnPlus" de vie en plus (0.15 = +15 %).
    // "recompense" = la récompense de la 1re Citrouille (niveau 10) ; chaque suivante donne "recompenseEnPlus" de plus
    //   (pièces et Candy Corn), la potion va dans le sac de la mine principale. "exclusif" : seulement au niveau "exclusifAu".
    boss: {
      nom: 'Citrouille géante',
      vie: 1.2, vieEnPlus: 0.15,
      recompense: { pieces: 300, potions: 1, geodesLune: 1, candy: 60 },
      recompenseEnPlus: 0.5,
      exclusif: 'fauxCitrouille', exclusifAu: 30,
      image: 'Assets/Event/Halloween/Boss_Citrouille.png',   // couvre 2 × 2 cases
      texte: "La Citrouille géante ! Tes coups restent d'une descente à l'autre.",
      titreVaincu: "Citrouille géante vaincue !",
      texteVaincu: "La voie est libre : tu peux maintenant partir du niveau {n}.",
    },

    // CLASSEMENT : le niveau le plus profond atteint pendant l'événement. Pas encore de serveur : les autres joueurs
    // sont simulés (l'onglet le dit), ils descendent un peu chaque jour.
    // "recompenses" : à la fin de l'événement, selon le rang ("rang" = jusqu'à ce rang). Des cosmétiques :
    // un titre (affiché sous le nom du joueur), une bannière et un avatar (images à venir : nom seulement pour l'instant).
    classement: {
      joueursSimules: 49,
      recompenses: [
        { rang: 1,  titre: 'Roi de la Citrouille', banniere: 'Bannière de la Citrouille d\'or', avatar: 'Avatar Citrouille couronnée' },
        { rang: 3,  titre: 'Seigneur des ténèbres', banniere: 'Bannière de la nuit hantée' },
        { rang: 10, titre: 'Chasseur de citrouilles' },
        { rang: 50, titre: 'Explorateur hanté' },
      ],
    },

    // MISSION D'HALLOWEEN : tant que la mine est ouverte, une des missions du jour est une mission d'Halloween.
    // Mêmes réglages que missions > liste ; "candy" = Candy Corn gagnés en plus des pièces.
    missions: [
      { type: 'candy', texte: 'Trouve {n} Candy Corn', choix: [30, 50], pieces: 50, candy: 20 },
      { type: 'yeux',  texte: ['Casse une Pierre aux yeux', 'Casse {n} Pierres aux yeux'], choix: [3, 5], pieces: 50, candy: 20 },
    ],

    // CANDY CORN : la monnaie de l'événement (pas de place dans le sac, comme les minerais)
    candy: {
      nom: 'Candy Corn',
      icone: 'Assets/Event/Halloween/Icon_CandyCorn.png',
    },

    // LES TUILES. "coups" = coups de pioche avec la pioche de base (comme mine > coupsPierre).
    tuiles: {
      // Pierre à Candy Corn : une pierre à minerai
      pierreCandy: { coups: 3, candy: [1, 3], image: 'Assets/Event/Halloween/Tile_Overlay_Halloween_CandyCorn.png' },   // dessin posé sur la pierre
      // Pierre aux yeux : ses yeux clignent et suivent le doigt. Cassée, elle ouvre « Bonbon ou farce »
      // "yeux" = les dessins des yeux, posés sur la pierre (chaque pierre en prend un au hasard)
      yeux:        { coups: 3, yeux: ['Assets/Event/Halloween/Tile_Overlay_Halloween_Eyes1.png', 'Assets/Event/Halloween/Tile_Overlay_Halloween_Eyes1-1.png'] },
      // Toile d'araignée : comme la souche et ses racines. Casser l'araignée fait disparaître toute la toile.
      toile:       { coupsAraignee: 3, coupsFil: 4, filsParToile: [3, 5],
                     imageAraignee: 'Assets/Event/Halloween/Tile_Overlay_Halloween_SpiderwebCenter.png', imageFil: 'Assets/Event/Halloween/Tile_Overlay_Halloween_Spiderweb.png' },
      // Sac de bonbons surprise : un coup de pioche le fait éclater, ce qui casse les pierres autour (les 8 cases voisines)
      sac:         { coups: 1, candy: [2, 4], image: 'Assets/Event/Halloween/Tile_Overlay_Halloween_ExplosiveBag.png' },
      // Gros bonbon : se casse en 1 coup et rend un peu d'énergie (sans dépasser le maximum). Son image est une case entière.
      grosBonbon:  { coups: 1, energie: 3, image: 'Assets/Event/Halloween/Tile_Halloween_Candy.png' },
      // Tas de Candy Corn des niveaux trésor
      tas:         { image: '' },                                  // Assets/Event/Halloween/Tile_TasCandy.png
    },

    // BONBON OU FARCE (après une Pierre aux yeux). Les chances sont affichées dans la fenêtre.
    bonbonOuFarce: {
      titre: "Bonbon ou farce ?",
      texte: "La pierre te regarde avec de grands yeux…",
      bonbon: [3, 5],                       // Bonbon : un petit gain sûr de Candy Corn, [minimum, maximum]
      farce: { geode: 50, confettis: 50 },  // Farce : chances (le total fait 100) d'une Géode de lune ou d'une pluie de confettis
      texteConfettis: "Farce ! Une pluie de confettis !",
    },

    // GÉODE DE LUNE : s'ouvre à l'Atelier (mini-jeu habituel) et donne une pierre de lune.
    // "rarete" = sa difficulté à l'Atelier. "chances" = chance de chaque rareté de pierre (le total fait 100).
    // Ratée (plus de cœurs) : elle donne une pierre Commune.
    geodeLune: {
      nom: 'Géode de lune', rarete: 'rare',
      chances: { common: 60, rare: 30, epic: 10 },
      image: '',                // Assets/Event/Halloween/Geode_Lune.png
    },

    // COLLECTIONS DU MUSÉE (mêmes règles que les autres : prime, étoiles, bonus de revente).
    // "image" = le fichier dans Assets/Treasures/, sans « .png » ('' = dessin provisoire) ; "taille" = [largeur, hauteur] en cases.
    collections: {
      // Pierres de lune : elles sortent uniquement des Géodes de lune
      gemmes: {
        pierresDeLune: { nom: 'Pierres de lune', prime: 200, objets: {
          quartzEtoile:    { nom: 'Quartz étoilé',       rarete: 'common', image: '' },   // Halloween/Gem_QuartzEtoile
          opaleDeLune:     { nom: 'Opale de lune',       rarete: 'common', image: '' },   // Halloween/Gem_OpaleLune
          amethysteMinuit: { nom: 'Améthyste de minuit', rarete: 'rare',   image: '' },   // Halloween/Gem_AmethysteMinuit
          ambreCaramel:    { nom: 'Ambre caramel',       rarete: 'epic',   image: '' },   // Halloween/Gem_AmbreCaramel
        } },
      },
      // Fête d'Halloween : cachée dans la Mine Hantée
      artefacts: {
        feteHalloween: { nom: "Fête d'Halloween", prime: 300, objets: {
          bonbonEmballe: { nom: 'Bonbon emballé',      rarete: 'common', image: 'Halloween/Bonbon', taille: [1, 1] },   // Halloween/Bonbon
          chatPeluche:   { nom: 'Chat noir en peluche', rarete: 'common', image: 'Halloween/ChatPeluche', taille: [1, 2] },  // Halloween/ChatPeluche
          balai:         { nom: 'Balai de sorcière',   rarete: 'common', image: 'Halloween/Balai', taille: [2, 2] },   // Halloween/Balai
          chaudron:      { nom: 'Chaudron miniature',  rarete: 'rare',   image: 'Halloween/Chaudron', taille: [2, 2] },   // Halloween/Chaudron
          // En 4 morceaux à reconstituer au Musée (images des morceaux : Halloween/Citrouille_1 à _4)
          grandeCitrouille: { nom: 'Grande citrouille sculptée', article: 'la', rarete: 'epic', image: 'Halloween/GrandeCitrouille', morceaux: [
            { image: '', position: [30, 30, 50, 0] },   // le haut gauche
            { image: '', position: [70, 30, 50, 0] },   // le haut droit
            { image: '', position: [30, 70, 50, 0] },   // le bas gauche
            { image: '', position: [70, 70, 50, 0] },   // le bas droit
          ] },
        } },
      },
    },

    /* ----- RÉCOMPENSES ----- */

    // BOUTIQUE DE LA SORCIÈRE : on paie en Candy Corn. Ouverte jusqu'à la fin de l'événement (J16).
    // "prix" en Candy Corn ; "parJour" = achats possibles par jour (absent = sans limite) ;
    // "une fois" = les exclusivités ne s'achètent qu'une seule fois.
    // PRIX (simulation du 14 octobre 2026, avec les vrais niveaux du jeu) : un joueur qui joue ses 3 Tickets gratuits
    // chaque jour, sans pub, et casse tout ce qui donne des Candy Corn, en gagne par jour (et au total au jour 12) :
    //   énergie max 40 (joueur qui vient d'ouvrir les Événements) : ~105 par jour (~1 300 au J12, ~1 550 au J14)
    //   énergie max 60 (joueur moyen, la référence)                : ~150 par jour (~1 830 au J12, ~2 130 au J14)
    //   énergie max 100                                            : ~230 par jour (~2 800 au J12)
    // La Fée citrouille (1 800) tombe donc au J12 pour le joueur moyen s'il garde ses Candy Corn pour elle ;
    // avec les 2 pubs par jour (5 Tickets), vers le J8. Un joueur à 40 d'énergie ne l'a qu'avec les pubs.
    // Les Candy Corn dépendent de l'énergie du joueur : les Pierres à Candy Corn coûtent de l'énergie à casser.
    boutiqueSorciere: {
      geodeLune:  { prix: 90 },
      // Coffre Halloween : une pièce d'équipement à thème (voir "equipement" plus bas), avec ces chances de rareté
      coffre:     { prix: 160, chances: { commun: 60, rare: 35, epique: 5 } },
      // Les deux exclusivités, les objets les plus chers
      chapeau:    { prix: 1100 },   // le Chapeau de sorcière (équipement, Épique)
      feeCitrouille: { prix: 1800 },   // la Fée citrouille, la récompense phare
    },

    // BOUTIQUE PREMIUM (pas encore de vrai paiement : l'achat est immédiat, comme les fées rares)
    // "prix" = texte du bouton ; "prixPromo" = texte pendant la promo (calendrier > promo), avec l'ancien prix barré.
    // Les packs de Tickets ne sont vendus que tant que la mine est ouverte (un Ticket ne sert plus à rien après).
    premium: {
      tickets: [
        { tickets: 3,  prix: "0,99 €", prixPromo: "0,49 €" },
        { tickets: 10, prix: "2,99 €", prixPromo: "1,49 €" },
      ],
      // Pack « Nuit hantée »
      packNuitHantee: { nom: "Pack Nuit hantée", tickets: 10, geodes: 3, prix: "4,99 €", prixPromo: "2,49 €" },
      texteVieuxPrix: "Promo d'Halloween !",
    },

    // LES FÉES DE L'ÉVÉNEMENT (mêmes réglages que pets > fees). Elles ne sortent jamais d'une récompense « fée au hasard ».
    // "visuel" = image de la fée ('' = dessin provisoire).
    fees: {
      // Fée citrouille : achetée dans la Boutique de la Sorcière (boutiqueSorciere > feeCitrouille)
      citrouille: { nom: "Fée citrouille", categorie: 'fortune', visuel: '', effet: 'tasDOr', chance: 0.4, nombre: 2,
                    rarete: 'epique',   // Assets/Event/Halloween/Pet_Fairy_Pumpkin.png
                    bonus: "Peut faire apparaître 2 tas d'or", detail: "En arrivant dans l'étage : peut cacher 2 tas d'or dans la terre" },
      // Fée chauve-souris : rare, achetée dans la boutique premium de l'événement (comme la Fée champignon)
      chauveSouris: { nom: "Fée chauve-souris", categorie: 'tresor', visuel: '', effet: 'reveler', chance: 0.35,
                    rarete: 'rare', prix: "0,00 $", couleurAccueil: "#6b3fa0",   // Assets/Event/Halloween/Pet_Fairy_Bat.png
                    bonus: "Peut révéler un trésor caché", detail: "En arrivant dans l'étage : peut montrer où se cache un trésor" },
    },

    // ÉQUIPEMENT À THÈME. Chaque modèle va dans un emplacement du mineur (equipement > emplacements) et
    // "commeModele" = il a le même passif que ce modèle (avec ses propres "valeurs" : Épique, Épique S, Légendaire, Légendaire S, Mythique).
    // Ils ne sortent jamais des coffres de la Boutique : seulement du Coffre Halloween et des exclusivités.
    // "image" = son image ('' = dessin provisoire).
    equipement: {
      // Les 4 pièces du Coffre Halloween (ni casque ni bottes : ces emplacements sont pour le Chapeau et la Cape)
      piocheCitrouille:   { emplacement: 'pioche',   nom: 'Pioche-citrouille',   commeModele: 'picEclats', valeurs: [0.12, 0.17, 0.22, 0.275, 0.33], image: '' },
      pelleBalai:         { emplacement: 'pelle',    nom: 'Pelle-balai',         commeModele: 'pelleLarge', valeurs: [0.15, 0.2, 0.25, 0.325, 0.4], image: '' },
      gantsSquelette:     { emplacement: 'gants',    nom: 'Gants squelette',     commeModele: 'gantsDynamiteur', valeurs: [0.2, 0.225, 0.25, 0.29, 0.33], image: '' },
      lanterneCitrouille: { emplacement: 'lanterne', nom: 'Lanterne-citrouille', commeModele: 'lanterneAncienne', valeurs: [1.5, 1.75, 2, 2.5, 3], image: '' },
      // Exclusivités (données en Épique) : un peu plus fortes que le modèle dont elles prennent le passif
      chapeauSorciere:    { emplacement: 'casque',   nom: 'Chapeau de sorcière', commeModele: 'casqueChantier', valeurs: [0.35, 0.5, 0.65, 0.85, 1], image: '', rarete: 'epique' },
      capeChauveSouris:   { emplacement: 'bottes',   nom: 'Cape de chauve-souris', commeModele: 'bottesPorteBonheur', valeurs: [0.2, 0.25, 0.3, 0.375, 0.45], image: '', rarete: 'epique' },
      // Exclusivité de la Citrouille géante (boss > recompense > exclusif)
      fauxCitrouille:     { emplacement: 'pioche',   nom: 'Faux de la Citrouille', commeModele: 'picLourd', valeurs: [0.16, 0.2, 0.25, 0.31, 0.37], image: '', rarete: 'epique' },
    },
    coffre: { nom: "Coffre Halloween", image: '' },   // Assets/Event/Halloween/Chest_Halloween.png

    // MUSÉE : la catégorie « Halloween » (bouton Collection du Musée). Elle reste au Musée après l'événement.
    // "fond" = l'image derrière les vitrines ; "bandeau" = la couleur du bandeau de titre.
    vitrine: { nom: "Halloween", fond: '', bandeau: '#e0701a' },
    // La collection qui donne la Cape de chauve-souris à 3 étoiles
    collectionCape: 'feteHalloween',
    texteCape: "3 étoiles ! Tu gagnes la Cape de chauve-souris !",

    // FIN DE L'ÉVÉNEMENT : les Candy Corn qui restent deviennent des pièces (au premier retour au village après J16)
    conversion: { piecesParCandy: 2, texte: "L'événement est fini : tes {n} Candy Corn deviennent {p} pièces !" },

    // ÉCRANS
    images: {
      // Bouton du village (widget), de l'écran Événements et de la catégorie Halloween du Musée : la citrouille sculptée
      bouton: 'Assets/Event/Halloween/Icon_MineHantee.png',
    },
    textes: {
      // Première descente guidée (une phrase très courte, 8 mots maximum)
      guideCandy: "Casse la pierre pour des Candy Corn",
      guideYeux: "Casse la Pierre aux yeux !",
      // Écran de l'événement
      intro: "Une mine pleine de bonbons, ouverte pour Halloween !",
      fermee: "La mine est fermée. La boutique reste ouverte jusqu'à la fin de l'événement.",
      // Nouveau départ débloqué ({x} = le décor, {n} = le niveau)
      nouveauDepart: "Nouveau départ : {x} (niveau {n}) !",
      fondDeLaMine: "La Citrouille géante bloque le passage : bats-la pour descendre plus bas !",
    },
  },
};
