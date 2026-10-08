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

    // (l'énergie max après chaque amélioration est dans forge > reserveEnergie)

    // Énergie moyenne qu'il faut pour dégager les trésors d'un niveau, pour chaque biome (1 à 10).
    // Si un niveau coûte plus, le jeu remplace de la roche au-dessus des trésors par de la terre.
    // Avec 30 d'énergie au départ et 7 par niveau, une expédition fait environ 4 à 5 niveaux au biome 1
    // (10 avec la réserve à 70) ; avec 340 d'énergie et 16 par niveau, environ 20 niveaux au biome 10.
    coutNiveau: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],

    // Ce coût moyen est multiplié selon le type de niveau (voir aussi "rythme")
    multiplicateurCout: { facile: 0.8, niveau9: 1.3, tresor: 0.6, gardien: 2 },

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
    // Nombre de cases au début du jeu
    casesDepart: 4,

    // Sac plein : un doublon trouvé reste au sol, avec ce petit message (pas de fenêtre).
    // Une nouvelle découverte ouvre une fenêtre pour laisser un doublon du sac à la place.
    texteDoublonLaisse: "Sac plein : doublon laissé",

    // Le sac apparaît avec le premier trésor ramassé. La première fois qu'il est plein,
    // un petit tutoriel montre le bouton Remonter (texte : progression > textesTuto > sacPlein)

    // Améliorations du sac à la Boutique, achetées dans l'ordre. Deux sortes :
    // - "cases" = taille du sac après l'achat ;
    // - "geodes" = poche à géodes : ce nombre de géodes ne prend pas de case dans le sac.
    // "nom" = nom affiché à la Boutique, "pieces" = prix,
    // "biome" = à partir de quel biome atteint cette amélioration est proposée.
    agrandissements: [
      { biome: 1,  cases: 5,  pieces: 150,  nom: "Poche cousue" },
      { biome: 1,  geodes: 1, pieces: 250,  nom: "Poche à géodes" },
      { biome: 1,  cases: 6,  pieces: 400,  nom: "Sac renforcé" },
      { biome: 2,  cases: 8,  pieces: 700,  nom: "Sac en cuir" },
      { biome: 2,  geodes: 2, pieces: 900,  nom: "Grande poche à géodes" },
      { biome: 3,  cases: 10, pieces: 1300, nom: "Sac de mineur" },
      { biome: 4,  cases: 12, pieces: 1800, nom: "Sac à soufflets" },
      { biome: 4,  geodes: 3, pieces: 2000, nom: "Poche à géodes doublée" },
      { biome: 5,  cases: 14, pieces: 2400, nom: "Sac d'explorateur" },
      { biome: 6,  cases: 16, pieces: 3000, nom: "Sac d'expédition" },
      { biome: 7,  cases: 18, pieces: 3800, nom: "Sac des profondeurs" },
      { biome: 7,  geodes: 4, pieces: 4000, nom: "Coffret à géodes" },
      { biome: 8,  cases: 20, pieces: 4600, nom: "Sac de cristal" },
      { biome: 9,  cases: 22, pieces: 5500, nom: "Sac royal" },
      { biome: 10, cases: 24, pieces: 6500, nom: "Sac du Roi Mineur" },
    ],
  },

  /* ---------------------------------------------------------------
     BIOMES
     1 niveau = 1 étage. La mine est découpée en biomes.
     --------------------------------------------------------------- */
  biomes: {
    // Nombre de niveaux dans chaque biome
    niveauxParBiome: 100,

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
      forge: 11,         // la Forge apparaît au village (au retour suivant)
      geodes: 16,        // géodes blanches
      atelier: 16,       // l'Atelier apparaît au village (au retour suivant)
      magma: 26,         // magma et arrosoir (et Arrosoir rapide à la Forge)
      fer: 36,           // minerai de fer (niveaux 3 et 4 de la Réserve d'énergie)
      boutique: 46,      // la Boutique, avec seulement "Agrandir le sac"
      bombes: 56,        // les bombes arrivent à la Boutique (tutoriel avec une bombe offerte)
      geodeRose: 66,     // géodes roses
      potions: 81,       // les potions d'énergie arrivent à la Boutique
      coupEnEclats: 96,  // Coup en éclats à la Forge
      // Biomes suivants
      pierreDure: 101,   // biome 2 : pierre dure
      or: 116,           // minerai d'or
      geodeDoree: 131,   // géodes dorées
      grandArrosoir: 146, // Grand arrosoir à la Forge
      // (161, 176, 191 : nouveautés à créer)
      source: 201,       // biome 3 : source
      radar: 216,        // le radar arrive en boutique
      magmaChaine: 301,  // biome 4 : magma en chaîne
      mystere: 401,      // biome 5 : case mystère
      geodeCristal: 451, // géodes de cristal
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
      },
      prime: "Récupère ta récompense",                // 1re prime de collection au Musée
      museeRetour: "Retourne au village",             // fin de la 1re visite du Musée
      redescendre: "Redescends dans la mine",         // après la 1re visite du Musée
      checkpoints: "Un checkpoint tous les {n} niveaux",  // 1re fois dans l'ascenseur, avant « Reprends au niveau »
      ascenseur: "Reprends au niveau {n}",            // 1re fois que l'ascenseur propose un checkpoint
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
     4 géodes, une par rareté. Les gemmes ne se trouvent plus dans la mine :
     elles sortent uniquement des géodes, ouvertes à l'Atelier.
     Une géode donne une gemme tirée au hasard parmi TOUTES les gemmes de sa rareté.
     --------------------------------------------------------------- */
  geodes: {
    // Fréquence d'apparition de chaque géode dans la mine
    // (plus le nombre est grand, plus elle apparaît souvent)
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

    // GEMMES : elles sortent uniquement des géodes (une géode donne une gemme de sa rareté)
    gemmes: {
      claires: { nom: 'Gemmes claires', prime: 100, objets: {
        quartz:      { nom: 'Quartz',       rarete: 'common' },
        aigueMarine: { nom: 'Aigue-marine', rarete: 'common' },
        topazeBleue: { nom: 'Topaze bleue', rarete: 'common' },
        diamantBrut: { nom: 'Diamant brut', rarete: 'rare' },
      } },
      roses: { nom: 'Gemmes roses', prime: 200, objets: {
        quartzRose:    { nom: 'Quartz rose',   rarete: 'common' },
        rhodochrosite: { nom: 'Rhodochrosite', rarete: 'common' },
        kunzite:       { nom: 'Kunzite',       rarete: 'rare' },
        saphirRose:    { nom: 'Saphir rose',   rarete: 'epic' },
      } },
      dorees: { nom: 'Gemmes dorées', prime: 400, objets: {
        citrine:         { nom: 'Citrine',          rarete: 'rare' },
        ambre:           { nom: 'Ambre',            rarete: 'rare' },
        topazeImperiale: { nom: 'Topaze impériale', rarete: 'epic' },
        heliodore:       { nom: 'Héliodore',        rarete: 'legendary' },
      } },
      royales: { nom: 'Gemmes royales', prime: 400, objets: {
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
    bombe: 25,
    radar: 30,
    potion: 50,
  },

  /* ---------------------------------------------------------------
     FORGE : AMÉLIORATIONS
     Chaque ligne = le prix d'un niveau, dans l'ordre (niveau 1, niveau 2, …).
     fer / cuivre / or = minerais, pieces = pièces.
     --------------------------------------------------------------- */
  forge: {
    // Chaque ligne = un niveau d'amélioration, dans l'ordre.
    // "biome" = à partir de quel biome atteint ce niveau est proposé (les niveaux max se débloquent biome par biome).
    // Le reste est le prix : pieces, fer, cuivre, or, mithril, cristalBrut.

    // Réserve d'énergie : "energie" = énergie max après l'achat
    reserveEnergie: [
      { biome: 1,  energie: 40,  pieces: 100 },
      { biome: 1,  energie: 50,  pieces: 150, cuivre: 6 },
      { biome: 1,  energie: 60,  pieces: 220, cuivre: 10, fer: 6 },
      { biome: 1,  energie: 70,  pieces: 300, cuivre: 14, fer: 12 },
      { biome: 2,  energie: 85,  pieces: 450, fer: 20, or: 3 },
      { biome: 2,  energie: 100, pieces: 600, fer: 26, or: 6 },
      { biome: 3,  energie: 115, pieces: 800, fer: 32, or: 10 },
      { biome: 3,  energie: 130, pieces: 1000, fer: 38, or: 14 },
      { biome: 4,  energie: 145, pieces: 1250, cuivre: 40, or: 18 },
      { biome: 4,  energie: 160, pieces: 1500, cuivre: 50, or: 24 },
      { biome: 5,  energie: 175, pieces: 1800, fer: 60, or: 30 },
      { biome: 5,  energie: 190, pieces: 2100, fer: 70, or: 36 },
      { biome: 6,  energie: 205, pieces: 2500, or: 40, mithril: 4 },
      { biome: 6,  energie: 220, pieces: 2900, or: 46, mithril: 8 },
      { biome: 7,  energie: 235, pieces: 3300, mithril: 12 },
      { biome: 7,  energie: 250, pieces: 3800, mithril: 16 },
      { biome: 8,  energie: 265, pieces: 4300, mithril: 20 },
      { biome: 8,  energie: 280, pieces: 4800, mithril: 26 },
      { biome: 9,  energie: 295, pieces: 5400, mithril: 30, cristalBrut: 4 },
      { biome: 9,  energie: 310, pieces: 6000, mithril: 34, cristalBrut: 8 },
      { biome: 10, energie: 340, pieces: 7000, mithril: 40, cristalBrut: 14 },
    ],
    // Pioche renforcée : +1 dégât par coup à chaque niveau
    piocheRenforcee: [
      { biome: 1, pieces: 80, cuivre: 5 },       // achetable dès que la Forge apparaît
      { biome: 2, pieces: 900, fer: 30, or: 10 },
      { biome: 6, pieces: 3000, or: 30, mithril: 10 },
    ],
    coupEnEclats: [
      { biome: 1, pieces: 120, cuivre: 5 },
      { biome: 2, pieces: 400, cuivre: 9, or: 2 },
      { biome: 4, pieces: 1200, cuivre: 14, or: 8 },
    ],
    arrosoirRapide: [
      { biome: 1, pieces: 150, fer: 5, cuivre: 2 },
      { biome: 2, pieces: 400, fer: 9, cuivre: 5, or: 2 },
      { biome: 4, pieces: 1200, or: 10 },
    ],
    grandArrosoir: [
      { biome: 1, pieces: 200, cuivre: 6 },
      { biome: 3, pieces: 800, cuivre: 10, or: 4 },
      { biome: 4, pieces: 1500, or: 12 },
    ],

    // Chance de casser une roche voisine, pour chaque niveau de "Coup en éclats"
    // (le premier nombre = sans amélioration)
    chanceEclats: [0, 0.12, 0.22, 0.33],

    // Temps de recharge de l'arrosoir pour chaque niveau d'"Arrosoir rapide" (en millisecondes)
    rechargeArrosoirMs: [5000, 4000, 3000, 2000],
  },

  /* ---------------------------------------------------------------
     OBJECTIFS AU VILLAGE
     3 objectifs simples sont affichés à la fois. Quand l'un est réussi,
     le joueur touche "Récupérer" pour gagner ses pièces, et un nouvel
     objectif le remplace.
     --------------------------------------------------------------- */
  objectifs: {
    nombre: 3,                   // objectifs affichés en même temps

    // La récompense grandit avec la profondeur : +50 % par biome atteint
    bonusParBiome: 0.5,

    // Liste des objectifs possibles.
    // "texte" : {n} est remplacé par la quantité.
    // "choix" : la quantité est tirée au hasard parmi ces nombres ronds.
    // "pieces" : récompense (au biome 1).
    // "deblocage" : l'objectif n'est proposé qu'une fois cette nouveauté débloquée
    //   (mêmes noms que progression > deblocages, ou 'musee').
    // Pour "Atteins le niveau {n}", c'est l'écart avec ton record (le niveau visé est arrondi à 5).
    liste: [
      { type: 'terre',      texte: 'Creuse {n} cases de terre',          choix: [20, 25, 30, 50], pieces: 25 },
      { type: 'tresors',    texte: 'Trouve {n} trésors',                 choix: [5, 10],          pieces: 40 },
      { type: 'niveaux',    texte: 'Termine {n} niveaux',                choix: [5, 10],          pieces: 40 },
      { type: 'niveau',     texte: 'Atteins le niveau {n}',              choix: [5, 10],          pieces: 60 },
      { type: 'pierres',    texte: 'Casse {n} pierres',                  choix: [10, 20, 25],     pieces: 40, deblocage: 'pioche' },
      { type: 'minerais',   texte: 'Récolte {n} minerais',               choix: [10, 20, 25],     pieces: 50, deblocage: 'cuivre' },
      { type: 'forge',      texte: 'Achète une amélioration à la Forge', choix: [1],              pieces: 50, deblocage: 'forge' },
      { type: 'geodes',     texte: 'Ouvre {n} géodes',                   choix: [3, 5],           pieces: 60, deblocage: 'atelier' },
      { type: 'magma',      texte: 'Refroidis {n} cases de magma',       choix: [5, 10],          pieces: 40, deblocage: 'magma' },
      { type: 'bombes',     texte: 'Utilise {n} bombes',                 choix: [3, 5],           pieces: 50, deblocage: 'bombes' },
      { type: 'collection', texte: 'Complète une collection',            choix: [1],              pieces: 100, deblocage: 'musee' },
    ],
  },

  /* ---------------------------------------------------------------
     ATELIER : MINI-JEU D'OUVERTURE DES GÉODES
     Chaque liste a 4 valeurs, une par géode :
     [Blanche (Common), Rose (Rare), Dorée (Epic), Cristal (Legendary)]
     --------------------------------------------------------------- */
  atelier: {
    coupsNecessaires: [2, 3, 4, 5],              // coups réussis pour ouvrir
    largeurZoneVerte: [48, 39, 31, 24],          // en % de la barre (50 % plus large qu'avant : 32, 26, 21, 16)
    vitesseCurseur: [0.7, 0.85, 1.0, 1.15],      // allers-retours par seconde
    vies: 4,                                     // nombre de cœurs
    accelerationParCoup: 0.08,                   // le curseur accélère de 8 % après chaque coup réussi

    // Si le joueur perd tous ses cœurs, la géode s'ouvre quand même mais donne une gemme
    // d'une rareté en dessous. Une géode blanche ratée donne ce nombre de pièces à la place :
    piecesGeodeBlancheRatee: 15,
  },
};
